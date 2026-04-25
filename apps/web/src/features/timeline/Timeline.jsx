"use client";

/**
 * Timeline — high-performance horizontally-scrollable age timeline.
 *
 * Coordinate system:
 *   logX(age) = (age − AGE_MIN) × BASE_PX   → logical pixel space
 *   visX(age) = logX(age) × scale − scrollLeft  → screen pixel space
 *
 * Layers:
 *   1. Chart canvas  — motion.div with scaleX + x motion values (no DOM reflow on zoom)
 *   2. Axis overlay  — unscaled, each tick positioned with visX()
 *   3. UI overlay    — cursor, tooltip, milestone pins (all unscaled)
 *
 * Milestone interaction:
 *   - pointerDown captures the pointer and records startX
 *   - If pointer travels > 4px before pointerUp → drop (update age in store)
 *   - If pointer stays still → click → open edit modal
 */

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, useMotionValue, animate, AnimatePresence } from "motion/react";
import { Plus, X } from "lucide-react";
import { useSimulationStore } from "../simulation/store";
import { useMilestoneStore } from "../milestones/milestoneStore";
import { getCat } from "../milestones/milestoneConfig";
import { useSimulation } from "../../hooks/useSimulation";
import { formatCurrency, formatCurrencyFull, AGE_MIN, AGE_MAX, computeMilestoneInsights } from "../../utils/finance";

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PX = 120;
const TOTAL_AGES = AGE_MAX - AGE_MIN;
const LOG_W = TOTAL_AGES * BASE_PX;
const CHART_H = 180;
const AXIS_H = 64;
const VP_H = CHART_H + AXIS_H;
const OVERSCAN = 5;
const CHART_TOP_PAD = 24;
const CHART_BOT_PAD = 20;
const CHART_USABLE_H = CHART_H - CHART_TOP_PAD - CHART_BOT_PAD;
const DRAG_THRESHOLD = 4; // px before a pointerDown is considered a drag

const ZOOM_PRESETS = [
  { key: "full", label: "Life", years: TOTAL_AGES },
  { key: "10yr", label: "10 yr", years: 10 },
  { key: "5yr", label: "5 yr", years: 5 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const logX = (age) => (age - AGE_MIN) * BASE_PX;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ─── Component ────────────────────────────────────────────────────────────────

export default function Timeline() {
  // DOM refs
  const outerRef = useRef(null);
  const sizerRef = useRef(null);
  const scrollBarRef = useRef(null);

  // Scroll — ref (always-current) + state (drives axis + overlay renders)
  const scrollLeftRef = useRef(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Scale — same dual pattern
  const scaleRef = useRef(1);
  const [scale, setScale] = useState(1);

  // Framer Motion values drive the canvas transform — zero React re-renders during scroll/zoom
  const scaleXMV = useMotionValue(1);
  const scrollXMV = useMotionValue(0);

  const [viewportWidth, setViewportWidth] = useState(800);
  const [zoomKey, setZoomKey] = useState("full");

  // dragging: null | { id, ghostAge, startX, hasDragged }
  const [dragging, setDragging] = useState(null);
  const justDroppedRef = useRef(false);
  const ignoreScrollBarRef = useRef(false);

  // Simulation
  const { points, summary } = useSimulation();
  const selectedAge = useSimulationStore((s) => s.selectedAge);
  const setSelectedAge = useSimulationStore((s) => s.setSelectedAge);
  const currentAge = useSimulationStore((s) => s.currentAge);
  const retirementAge = useSimulationStore((s) => s.retirementAge);
  const events = useSimulationStore((s) => s.events);
  const currentNetWorth = useSimulationStore((s) => s.currentNetWorth);
  const monthlySavings = useSimulationStore((s) => s.monthlySavings);
  const interestRate = useSimulationStore((s) => s.interestRate);
  const retirementSpend = useSimulationStore((s) => s.retirementSpend);

  // Milestones from dedicated store
  const milestones = useMilestoneStore((s) => s.milestones);
  const openNew = useMilestoneStore((s) => s.openNew);
  const openEdit = useMilestoneStore((s) => s.openEdit);
  const updateMilestone = useMilestoneStore((s) => s.updateMilestone);

  // Milestone insights for status coloring
  const inflationRate = useSimulationStore((s) => s.inflationRate);
  const salaryGrowth = useSimulationStore((s) => s.salaryGrowth);
  const milestoneInsights = useMemo(() => {
    return computeMilestoneInsights({
      points,
      milestones,
      simParams: { currentAge, currentNetWorth, monthlySavings, interestRate, inflationRate, salaryGrowth, retirementAge, retirementSpend, events },
    });
  }, [points, milestones, currentAge, currentNetWorth, monthlySavings, interestRate, inflationRate, salaryGrowth, retirementAge, retirementSpend, events]);

  const insightMap = useMemo(() => {
    const map = new Map();
    for (const ins of milestoneInsights) map.set(ins.id, ins);
    return map;
  }, [milestoneInsights]);

  // ── Scale ──────────────────────────────────────────────────────────────────

  const computeScale = useCallback((key, vpw) => {
    const p = ZOOM_PRESETS.find((z) => z.key === key) ?? ZOOM_PRESETS[0];
    return vpw / (p.years * BASE_PX);
  }, []);

  // ── ResizeObserver ─────────────────────────────────────────────────────────

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setViewportWidth(w);
      const s = computeScale(zoomKey, w);
      scaleRef.current = s;
      scaleXMV.set(s);
      setScale(s);
      if (sizerRef.current) sizerRef.current.style.width = `${LOG_W * s}px`;
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [zoomKey, computeScale, scaleXMV]);

  // ── Scroll helper ──────────────────────────────────────────────────────────

  const applyScroll = useCallback(
    (sl) => {
      scrollLeftRef.current = sl;
      scrollXMV.set(-sl);
      setScrollLeft(sl);
      if (scrollBarRef.current) {
        ignoreScrollBarRef.current = true;
        scrollBarRef.current.scrollLeft = sl;
        requestAnimationFrame(() => {
          ignoreScrollBarRef.current = false;
        });
      }
    },
    [scrollXMV],
  );

  // ── Wheel ──────────────────────────────────────────────────────────────────

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const maxSL = Math.max(0, LOG_W * scaleRef.current - viewportWidth);
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      applyScroll(clamp(scrollLeftRef.current + delta, 0, maxSL));
    },
    [viewportWidth, applyScroll],
  );

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // ── Scrollbar ──────────────────────────────────────────────────────────────

  const handleScrollBarScroll = useCallback(
    (e) => {
      if (ignoreScrollBarRef.current) return;
      const maxSL = Math.max(0, LOG_W * scaleRef.current - viewportWidth);
      applyScroll(clamp(e.currentTarget.scrollLeft, 0, maxSL));
    },
    [viewportWidth, applyScroll],
  );

  // ── Zoom (spring-animated via motion values — no layout recalc) ────────────

  const handleZoom = useCallback(
    (key) => {
      if (key === zoomKey) return;
      const newScale = computeScale(key, viewportWidth);
      const curS = scaleRef.current;
      const centerAge = clamp(
        (scrollLeftRef.current + viewportWidth / 2) / (BASE_PX * curS) +
          AGE_MIN,
        AGE_MIN,
        AGE_MAX,
      );
      const newSL = clamp(
        logX(centerAge) * newScale - viewportWidth / 2,
        0,
        Math.max(0, LOG_W * newScale - viewportWidth),
      );

      setZoomKey(key);

      const scaleAnim = animate(scaleXMV, newScale, {
        type: "spring",
        stiffness: 260,
        damping: 28,
      });
      const unsubScale = scaleXMV.on("change", (s) => {
        scaleRef.current = s;
        if (sizerRef.current) sizerRef.current.style.width = `${LOG_W * s}px`;
      });
      const scrollAnim = animate(scrollLeftRef.current, newSL, {
        type: "spring",
        stiffness: 260,
        damping: 28,
        onUpdate: (v) => {
          scrollLeftRef.current = v;
          scrollXMV.set(-v);
          if (scrollBarRef.current) {
            ignoreScrollBarRef.current = true;
            scrollBarRef.current.scrollLeft = v;
            requestAnimationFrame(() => {
              ignoreScrollBarRef.current = false;
            });
          }
        },
      });

      Promise.all([scaleAnim, scrollAnim])
        .then(() => {
          unsubScale();
          setScale(newScale);
          setScrollLeft(newSL);
        })
        .catch(() => {});
    },
    [zoomKey, viewportWidth, computeScale, scaleXMV, scrollXMV],
  );

  // ── Virtualization ─────────────────────────────────────────────────────────

  const visibleAges = useMemo(() => {
    const colW = BASE_PX * scale;
    const startIdx = Math.max(0, Math.floor(scrollLeft / colW) - OVERSCAN);
    const endIdx = Math.min(
      TOTAL_AGES,
      Math.ceil((scrollLeft + viewportWidth) / colW) + OVERSCAN,
    );
    const ages = [];
    for (let i = startIdx; i <= endIdx; i++) ages.push(AGE_MIN + i);
    return ages;
  }, [scrollLeft, viewportWidth, scale]);

  // ── Chart paths ────────────────────────────────────────────────────────────

  const { linePath, areaPath, yFor } = useMemo(() => {
    let min = Infinity,
      max = -Infinity;
    for (const p of points) {
      if (p.balance < min) min = p.balance;
      if (p.balance > max) max = p.balance;
    }
    if (!Number.isFinite(min)) min = 0;
    if (!Number.isFinite(max)) max = 0;
    if (min === max) max = min + 1;

    const yF = (val) =>
      CHART_H - CHART_BOT_PAD - ((val - min) / (max - min)) * CHART_USABLE_H;

    let line = "";
    points.forEach((p, i) => {
      line += `${i === 0 ? "M" : "L"}${logX(p.age)},${yF(p.balance)} `;
    });
    line = line.trim();
    const baseY = yF(Math.min(0, min));
    const area = `${line} L${logX(AGE_MAX)},${baseY} L${logX(AGE_MIN)},${baseY} Z`;
    return { linePath: line, areaPath: area, yFor: yF };
  }, [points]);

  // ── Coordinate helpers ─────────────────────────────────────────────────────

  const visX = useCallback(
    (age) => logX(age) * scale - scrollLeft,
    [scale, scrollLeft],
  );

  const pointerToAge = useCallback((clientX) => {
    const rect = outerRef.current?.getBoundingClientRect();
    if (!rect) return AGE_MIN;
    const logicalX =
      (clientX - rect.left + scrollLeftRef.current) / scaleRef.current;
    return clamp(Math.round(logicalX / BASE_PX) + AGE_MIN, AGE_MIN, AGE_MAX);
  }, []);

  // ── Milestone pointer events ───────────────────────────────────────────────

  const handleMilestonePD = useCallback(
    (e, id) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      const m = milestones.find((x) => x.id === id);
      setDragging({
        id,
        ghostAge: m?.age ?? AGE_MIN,
        startX: e.clientX,
        hasDragged: false,
      });
    },
    [milestones],
  );

  const handleOuterPM = useCallback(
    (e) => {
      if (!dragging) return;
      const moved = Math.abs(e.clientX - dragging.startX) > DRAG_THRESHOLD;
      const age = pointerToAge(e.clientX);
      setDragging((d) =>
        d ? { ...d, ghostAge: age, hasDragged: d.hasDragged || moved } : null,
      );
    },
    [dragging, pointerToAge],
  );

  const handleOuterPU = useCallback(
    (e) => {
      if (!dragging) return;
      if (dragging.hasDragged) {
        const age = pointerToAge(e.clientX);
        updateMilestone(dragging.id, { age });
        justDroppedRef.current = true;
        requestAnimationFrame(() => {
          justDroppedRef.current = false;
        });
      } else {
        // Treat as click → open edit modal
        openEdit(dragging.id);
      }
      setDragging(null);
    },
    [dragging, pointerToAge, updateMilestone, openEdit],
  );

  // ── Viewport click → select age ────────────────────────────────────────────

  const handleViewportClick = useCallback(
    (e) => {
      if (justDroppedRef.current || dragging) return;
      setSelectedAge(pointerToAge(e.clientX));
    },
    [dragging, pointerToAge, setSelectedAge],
  );

  // ── Add milestone via header button ────────────────────────────────────────

  const handleAddMilestone = useCallback(() => {
    const centerAge = clamp(
      Math.round(
        (scrollLeftRef.current + viewportWidth / 2) /
          (BASE_PX * scaleRef.current),
      ) + AGE_MIN,
      AGE_MIN,
      AGE_MAX,
    );
    openNew(centerAge);
  }, [viewportWidth, openNew]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const selectedPoint = useMemo(
    () => points.find((p) => p.age === selectedAge),
    [points, selectedAge],
  );
  const cursorVisX = visX(selectedAge);
  const ghostVisX = dragging ? visX(dragging.ghostAge) : null;
  const colVisualW = BASE_PX * scale;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-[#0A0C14] rounded-2xl border border-[#1C2030] overflow-hidden flex flex-col select-none">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-3 border-b border-[#1C2030] flex-shrink-0 flex-wrap gap-y-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
            Lifetime trajectory
          </h3>
          <p className="text-xs text-slate-500">
            Scroll · click any age to inspect · drag milestone pins to
            reposition · click a pin to edit
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Legend */}
          <div className="hidden lg:flex items-center gap-3 pr-3 border-r border-[#1C2030]">
            <LegendDot color="#60A5FA" label="Net worth" />
            <LegendDot color="#F59E0B" label="Life event" circle />
            <LegendDot color="#8B5CF6" label="Milestone" flag />
          </div>

          {/* Add milestone */}
          <button
            onClick={handleAddMilestone}
            className="h-7 px-2.5 rounded-lg text-xs font-semibold bg-[#080A10] border border-[#1C2030] text-slate-400 hover:text-slate-100 hover:border-[#2A3050] transition-all inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Plus size={12} /> Milestone
          </button>

          {/* Zoom */}
          <div className="flex items-center gap-0.5 p-0.5 bg-[#080A10] border border-[#1C2030] rounded-lg">
            {ZOOM_PRESETS.map((z) => (
              <button
                key={z.key}
                onClick={() => handleZoom(z.key)}
                className={`h-6 px-2.5 rounded-md text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  zoomKey === z.key
                    ? "bg-[#1C2030] text-slate-100 shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── VIEWPORT ── */}
      <div
        ref={outerRef}
        className="relative overflow-hidden flex-shrink-0 cursor-crosshair"
        style={{ height: VP_H, background: "#070910" }}
        onClick={handleViewportClick}
        onPointerMove={handleOuterPM}
        onPointerUp={handleOuterPU}
      >
        {/* LAYER 1 — Scaled chart canvas (motion values → CSS transform, zero reflow) */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: LOG_W,
            height: CHART_H,
            originX: 0,
            originY: 0,
            scaleX: scaleXMV,
            x: scrollXMV,
            pointerEvents: "none",
          }}
        >
          <svg
            width={LOG_W}
            height={CHART_H}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              overflow: "visible",
            }}
          >
            <defs>
              <linearGradient id="tlAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                <stop offset="65%" stopColor="#3B82F6" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.00" />
              </linearGradient>
              <filter
                id="lineGlow"
                x="-20%"
                y="-50%"
                width="140%"
                height="200%"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="2.5"
                  result="blur"
                />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Gridlines */}
            {[0.2, 0.4, 0.6, 0.8].map((t) => (
              <line
                key={t}
                x1={0}
                x2={LOG_W}
                y1={CHART_TOP_PAD + CHART_USABLE_H * t}
                y2={CHART_TOP_PAD + CHART_USABLE_H * t}
                stroke="#1A1F2E"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Retirement tint */}
            <rect
              x={logX(retirementAge)}
              y={0}
              width={logX(AGE_MAX) - logX(retirementAge)}
              height={CHART_H}
              fill="#8B5CF6"
              opacity={0.03}
            />

            {/* Area */}
            <motion.path
              d={areaPath}
              fill="url(#tlAreaGrad)"
              initial={false}
              animate={{ d: areaPath }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            />

            {/* Glow line */}
            <motion.path
              d={linePath}
              fill="none"
              stroke="#3B82F6"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.25}
              filter="url(#lineGlow)"
              initial={false}
              animate={{ d: linePath }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            />

            {/* Main line */}
            <motion.path
              d={linePath}
              fill="none"
              stroke="#60A5FA"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ d: linePath }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            />

            {/* Now rule */}
            <line
              x1={logX(currentAge)}
              x2={logX(currentAge)}
              y1={0}
              y2={CHART_H}
              stroke="#374151"
              strokeWidth={1}
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
            />

            {/* Retirement rule */}
            <line
              x1={logX(retirementAge)}
              x2={logX(retirementAge)}
              y1={0}
              y2={CHART_H}
              stroke="#2A3050"
              strokeWidth={1}
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
            />

            {/* Life event dots */}
            {events.map((ev) => {
              const pt = points.find((p) => p.age === ev.age);
              if (!pt) {
                return null;
              }

              return (
                <circle
                  key={ev.id}
                  cx={logX(ev.age)}
                  cy={yFor(pt.balance)}
                  r={4.5}
                  fill="#070910"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
        </motion.div>

        {/* LAYER 2 — Axis (unscaled, positioned with visX()) */}
        <div
          className="absolute left-0 right-0 overflow-hidden pointer-events-none"
          style={{
            top: CHART_H,
            height: AXIS_H,
            borderTop: "1px solid #1A1F2E",
          }}
        >
          {visibleAges.map((age) => {
            const vx = visX(age);
            const isDecade = age % 10 === 0;
            const isFive = age % 5 === 0;
            const isCurrent = age === currentAge;
            const isRetirement = age === retirementAge;
            const isSelected = age === selectedAge;
            const showLabel =
              isDecade ||
              (scale > 0.3 && isFive) ||
              scale > 1.0 ||
              isSelected ||
              isCurrent ||
              isRetirement;

            return (
              <div
                key={age}
                className="absolute top-0 flex flex-col items-center"
                style={{ transform: `translateX(${vx}px)`, width: colVisualW }}
              >
                <div
                  className={`w-px ${isDecade ? "h-3 bg-slate-600" : isFive ? "h-2 bg-slate-700" : "h-1.5 bg-[#1C2030]"}`}
                />
                {showLabel ? (
                  <span
                    className={`mt-1.5 text-[11px] whitespace-nowrap pointer-events-none font-medium ${
                      isSelected
                        ? "text-slate-100 font-bold"
                        : isCurrent
                          ? "text-blue-400 font-bold"
                          : isRetirement
                            ? "text-violet-400 font-semibold"
                            : isDecade
                              ? "text-slate-400"
                              : "text-slate-600"
                    }`}
                  >
                    {age}
                  </span>
                ) : null}
                {isCurrent ? (
                  <span className="text-[8px] uppercase tracking-widest text-blue-500   mt-0.5 font-bold">
                    now
                  </span>
                ) : null}
                {isRetirement ? (
                  <span className="text-[8px] uppercase tracking-widest text-violet-500 mt-0.5 font-bold">
                    retire
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* LAYER 3 — UI overlay: cursor, tooltip, milestone pins */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ height: VP_H }}
        >
          {/* Ghost drop line */}
          {dragging?.hasDragged && ghostVisX !== null ? (
            <div
              className="absolute top-0 pointer-events-none"
              style={{
                left: ghostVisX,
                width: 1,
                height: CHART_H,
                borderLeft: "1.5px dashed #60A5FA60",
              }}
            />
          ) : null}

          {/* Snap badge */}
          {dragging?.hasDragged ? (
            <motion.div
              className="absolute pointer-events-none text-white text-[11px] font-bold rounded-lg px-2 py-0.5 leading-none"
              style={{
                left: (ghostVisX ?? 0) - 14,
                top: 8,
                zIndex: 20,
                background: "#1D4ED8",
                boxShadow: "0 4px 12px rgba(29,78,216,0.4)",
              }}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
            >
              {dragging.ghostAge}
            </motion.div>
          ) : null}

          {/* Selected age cursor */}
          <motion.div
            className="absolute top-0 pointer-events-none"
            animate={{ left: cursorVisX }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
          >
            <div
              className="w-px bg-slate-300 opacity-60"
              style={{ height: CHART_H + 4 }}
            />
            {selectedPoint ? (
              <div
                className="absolute w-3 h-3 rounded-full bg-white border-2"
                style={{
                  top: yFor(selectedPoint.balance) - 6,
                  left: -5.5,
                  borderColor: "#60A5FA",
                  boxShadow: "0 0 10px rgba(96,165,250,0.7)",
                }}
              />
            ) : null}
          </motion.div>

          {/* Floating age tooltip — enhanced with milestone info */}
          <AnimatePresence mode="wait">
            {selectedPoint ? (
              <motion.div
                key={selectedAge}
                className="absolute pointer-events-none flex flex-col gap-1"
                style={{
                  left: clamp(cursorVisX - 72, 8, viewportWidth - 160),
                  top: 8,
                  width: 152,
                  zIndex: 20,
                  background: "#0D0F1AEE",
                  border: "1px solid #1C2030",
                  borderRadius: 12,
                  padding: "10px 14px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                  backdropFilter: "blur(12px)",
                }}
                initial={{ opacity: 0, y: -6, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.92 }}
                transition={{ duration: 0.15 }}
              >
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                  Age {selectedAge}
                </span>
                <span className="text-sm font-bold text-slate-100 tabular-nums">
                  {formatCurrencyFull(selectedPoint.balance)}
                </span>
                {selectedPoint.milestoneCost > 0 && (
                  <span className="text-[10px] text-amber-400 font-semibold">
                    −{formatCurrency(selectedPoint.milestoneCost)} milestone
                  </span>
                )}
                {(() => {
                  const msAtAge = milestones.filter(m => m.age === selectedAge && m.cost > 0);
                  if (!msAtAge.length) return null;
                  return msAtAge.map(ms => {
                    const ins = insightMap.get(ms.id);
                    if (!ins) return null;
                    return (
                      <div key={ms.id} className="flex flex-col gap-0.5 mt-0.5 pt-1 border-t border-[#1C203050]">
                        <span className="text-[9px] font-bold" style={{ color: ins.status === 'green' ? '#34D399' : '#FCD34D' }}>
                          {ins.status === 'green' ? '✓ On track' : '⚠ Shortfall'}
                        </span>
                        {ins.gap > 0 && (
                          <span className="text-[9px] text-amber-300">Gap: {formatCurrency(ins.gap)}</span>
                        )}
                        {ins.additionalMonthlySavings > 0 && (
                          <span className="text-[9px] text-amber-300">Need +{formatCurrency(ins.additionalMonthlySavings)}/mo</span>
                        )}
                      </div>
                    );
                  });
                })()}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Milestone pins */}
          {milestones.map((m) => {
            const isDraggingThis = dragging?.id === m.id;
            const pinAge = isDraggingThis ? dragging.ghostAge : m.age;
            const pinVisX = visX(pinAge);
            const cat = getCat(m.category);
            const CategoryIcon = cat.Icon;
            const insight = insightMap.get(m.id);
            const pinColor = (insight && m.cost > 0) ? (insight.status === 'green' ? '#10B981' : insight.status === 'amber' ? '#F59E0B' : '#EF4444') : cat.color;

            return (
              <div
                key={m.id}
                className="absolute top-0 pointer-events-auto group"
                style={{
                  left: pinVisX,
                  height: CHART_H,
                  width: 2,
                  zIndex: isDraggingThis ? 50 : 15,
                  cursor: isDraggingThis ? "grabbing" : "grab",
                  transform: "translateX(-0.5px)",
                }}
                onPointerDown={(e) => handleMilestonePD(e, m.id)}
              >
                {/* Vertical stem */}
                <div
                  className="w-px h-full transition-opacity duration-150"
                  style={{
                    marginLeft: 0.5,
                    background: `linear-gradient(to bottom, ${cat.color}, ${cat.color}00)`,
                    opacity: isDraggingThis ? 0.3 : 0.6,
                  }}
                />

                {/* Pin head assembly */}
                <div
                  className="absolute"
                  style={{ top: 0, left: "50%", transform: "translateX(-50%)" }}
                >
                  {/* Icon circle */}
                  <motion.div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle, ${pinColor}EE, ${pinColor}AA)`,
                      boxShadow: `0 0 0 2px ${pinColor}30, 0 0 16px ${pinColor}50`,
                    }}
                    animate={{
                      scale: isDraggingThis ? 1.35 : 1,
                      boxShadow: isDraggingThis
                        ? `0 0 0 3px ${pinColor}60, 0 0 28px ${pinColor}70`
                        : `0 0 0 2px ${pinColor}30, 0 0 16px ${pinColor}50`,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    title={m.title}
                  >
                    <CategoryIcon size={11} color="white" strokeWidth={2.5} />
                  </motion.div>

                  {/* Label chip — visible on hover or drag */}
                  <div
                    className="mt-1.5 px-2 py-0.5 rounded-lg text-[9px] font-bold whitespace-nowrap text-center leading-tight transition-opacity duration-150"
                    style={{
                      background: `${cat.color}18`,
                      border: `1px solid ${cat.color}30`,
                      color: cat.color,
                      maxWidth: 80,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      opacity: isDraggingThis ? 0.5 : 0,
                      transform: "translateX(-50%)",
                      marginLeft: "50%",
                    }}
                    // Show label on hover via group
                    ref={(el) => {
                      if (el) el.style.opacity = isDraggingThis ? "0.5" : "";
                    }}
                  >
                    {m.title || cat.label}
                  </div>

                  {/* Delete button on hover */}
                  <button
                    className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-full flex items-center justify-center"
                    style={{
                      width: 16,
                      height: 16,
                      top: 24,
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 60,
                      background: "#0D0F1A",
                      border: "1px solid #1C2030",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(m.id);
                    }}
                  >
                    <X size={8} color="#94A3B8" />
                  </button>
                </div>

                {/* Hover label — shown via CSS group trick */}
                <div
                  className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200"
                  style={{
                    top: 32,
                    left: "50%",
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                    background: `${cat.color}18`,
                    border: `1px solid ${cat.color}35`,
                    borderRadius: 8,
                    padding: "2px 7px",
                    color: cat.color,
                    fontSize: 9,
                    fontWeight: 700,
                    maxWidth: 88,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {m.title || cat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SCROLLBAR ── */}
      <div
        ref={scrollBarRef}
        onScroll={handleScrollBarScroll}
        className="flex-shrink-0 overflow-x-scroll overflow-y-hidden"
        style={{
          height: 10,
          scrollbarWidth: "thin",
          scrollbarColor: "#2A3050 transparent",
        }}
      >
        <div ref={sizerRef} style={{ height: 1, width: LOG_W * scale }} />
      </div>
    </div>
  );
}

// ─── Legend dot helper ────────────────────────────────────────────────────────

function LegendDot({ color, label, circle, flag }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
      {flag ? (
        <span
          className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
          style={{ background: color + "30" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: color }}
          />
        </span>
      ) : circle ? (
        <span
          className="w-2 h-2 rounded-full border"
          style={{ background: "transparent", borderColor: color }}
        />
      ) : (
        <span
          className="w-3 h-[2px] rounded-full"
          style={{ background: color }}
        />
      )}
      {label}
    </span>
  );
}
