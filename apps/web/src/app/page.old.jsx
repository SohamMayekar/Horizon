"use client";

import { motion } from "motion/react";
import { RotateCcw, Sparkles } from "lucide-react";
import Timeline from "../features/timeline/Timeline";
import ControlsPanel from "../features/controls/ControlsPanel";
import SummaryPanel from "../features/simulation/SummaryPanel";
import MilestonePanel from "../features/milestones/MilestonePanel";
import MilestoneModal from "../features/milestones/MilestoneModal";
import InsightsPanel from "../features/insights/InsightsPanel";
import { useSimulationStore } from "../features/simulation/store";
import { useMilestoneStore } from "../features/milestones/milestoneStore";

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, delay, ease: [0.22, 0.61, 0.36, 1] },
});

export default function HomePage() {
  const resetSim = useSimulationStore((s) => s.reset);
  const resetMilestones = useMilestoneStore((s) => s.reset);
  const handleReset = () => {
    resetSim();
    resetMilestones();
  };

  return (
    <div className="min-h-screen bg-[#080A10] font-sans">
      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-[20%] w-[700px] h-[500px] rounded-full blur-[140px] opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #3B82F6, transparent)" }}
        />
        <div
          className="absolute top-[30%] right-[15%] w-[500px] h-[400px] rounded-full blur-[120px] opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent)" }}
        />
        <div
          className="absolute bottom-[10%] left-[40%] w-[400px] h-[300px] rounded-full blur-[100px] opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #06B6D4, transparent)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #94A3B8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <MilestoneModal />

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-7">
        {/* ── HEADER ── */}
        <motion.header
          {...FADE_UP(0)}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-3 py-1">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-blue-400"
                  style={{ boxShadow: "0 0 6px #60A5FA" }}
                />
                Live simulation
              </span>
              <span className="text-[11px] font-medium text-slate-600 bg-[#0E1118] border border-[#1C2030] rounded-full px-3 py-1">
                Ages 20 – 80
              </span>
              <span className="text-[11px] font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                🇮🇳 Indian Demographics
              </span>
            </div>

            <h1 className="text-3xl md:text-[40px] font-bold tracking-tight leading-[1.15]">
              <span className="text-slate-100">Your financial life,&nbsp;</span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #60A5FA 0%, #818CF8 50%, #A78BFA 100%)",
                }}
              >
                decade by decade
              </span>
            </h1>
            <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
              Drag any slider — the 60-year trajectory recomputes instantly.
              Drop milestones on the timeline, model life events, and
              stress-test your financial plan with Indian demographics.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E1118] border border-[#1C2030] text-sm font-medium text-slate-400 hover:text-slate-200 hover:border-[#2A3050] transition-all"
          >
            <RotateCcw size={14} /> Reset plan
          </button>
        </motion.header>

        {/* ── SUMMARY CARDS ── */}
        <motion.section {...FADE_UP(0.07)}>
          <SummaryPanel />
        </motion.section>

        {/* ── TIMELINE ── */}
        <motion.section {...FADE_UP(0.13)}>
          <Timeline />
        </motion.section>

        {/* ── MILESTONE PANEL ── */}
        <motion.section {...FADE_UP(0.18)}>
          <MilestonePanel />
        </motion.section>

        {/* ── CONTROLS + INSIGHTS ── */}
        <motion.section
          {...FADE_UP(0.23)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <div className="lg:col-span-2">
            <ControlsPanel />
          </div>
          <PrinciplesCard />
        </motion.section>

        {/* ── INSIGHTS PANEL ── */}
        <motion.section {...FADE_UP(0.28)}>
          <InsightsPanel />
        </motion.section>

        {/* ── FOOTER ── */}
        <footer className="pt-6 border-t border-[#1C2030] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <span className="text-xs text-slate-600">
            All projections run locally — nothing leaves your browser. Made for India 🇮🇳
          </span>
          <div className="flex items-center gap-2">
            <Chip>Client-side</Chip>
            <Chip>Zustand · Framer Motion</Chip>
            <Chip>₹ INR</Chip>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="text-[11px] text-slate-600 bg-[#0E1118] border border-[#1C2030] rounded-full px-3 py-1">
      {children}
    </span>
  );
}

function PrinciplesCard() {
  const items = [
    "SIP consistency beats timing the market",
    "Start early — even ₹5,000/month compounds massively",
    "Build an emergency fund before investing",
    "Factor in inflation at 6-7% for Indian context",
  ];
  return (
    <div className="relative bg-[#0E1118] rounded-2xl border border-[#1C2030] p-6 flex flex-col gap-5 overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #8B5CF650, transparent)" }}
      />
      <div
        className="absolute -top-10 right-0 w-48 h-36 rounded-full blur-3xl pointer-events-none"
        style={{ background: "#8B5CF610" }}
      />
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-violet-400" />
        <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
          Planning principles
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((text) => (
          <div key={text} className="flex items-start gap-3">
            <span className="text-[8px] text-violet-500 mt-[5px] flex-shrink-0">◆</span>
            <span className="text-xs text-slate-400 leading-relaxed">{text}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4 border-t border-[#1C2030]">
        <p className="text-[11px] text-slate-600 leading-relaxed">
          The best financial plan is one you can actually follow — not just the
          mathematically optimal one.
        </p>
      </div>
    </div>
  );
}
