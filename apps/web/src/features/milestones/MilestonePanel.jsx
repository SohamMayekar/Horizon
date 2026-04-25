"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Flag } from "lucide-react";
import { useMilestoneStore } from "./milestoneStore";
import { getCat } from "./milestoneConfig";
import { formatCurrency, AGE_MIN } from "../../utils/finance";
import { useSimulationStore } from "../simulation/store";

export default function MilestonePanel() {
  const milestones = useMilestoneStore((s) => s.milestones);
  const openNew = useMilestoneStore((s) => s.openNew);
  const openEdit = useMilestoneStore((s) => s.openEdit);
  const currentAge = useSimulationStore((s) => s.currentAge);

  const sorted = [...milestones].sort((a, b) => a.age - b.age);
  const past = sorted.filter((m) => m.age < currentAge);
  const future = sorted.filter((m) => m.age >= currentAge);

  return (
    <div
      className="rounded-2xl border border-[#1C2030] overflow-hidden"
      style={{ background: "var(--app-card-bg, #0A0C14)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1C2030]">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
            Milestones
          </h3>
          <p className="text-xs text-slate-500">
            {milestones.length} milestone{milestones.length !== 1 ? "s" : ""}{" "}
            across your life plan
          </p>
        </div>
        <button
          onClick={() => openNew(currentAge + 5)}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all"
          style={{ boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}
        >
          <Plus size={13} />
          Add
        </button>
      </div>

      {/* Horizontal card scroll */}
      <div
        className="px-4 py-4 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex gap-3 min-w-max">
          {milestones.length === 0 ? (
            <EmptyState onAdd={() => openNew(currentAge + 5)} />
          ) : (
            <>
              {/* Future milestones */}
              {future.map((m, i) => (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  onClick={() => openEdit(m.id)}
                  index={i}
                  past={false}
                />
              ))}
              {/* Past milestones (dimmed) */}
              {past.map((m, i) => (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  onClick={() => openEdit(m.id)}
                  index={i}
                  past={true}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({ milestone, onClick, index, past }) {
  const { title, age, cost, category } = milestone;
  const cat = getCat(category);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: past ? 0.45 : 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.04,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      onClick={onClick}
      className="flex flex-col text-left rounded-2xl overflow-hidden flex-shrink-0 group transition-all duration-200"
      style={{
        width: 192,
        background: "var(--app-card-bg-2, #0E1118)",
        border: `1px solid var(--app-border, #1C2030)`,
        boxShadow: "none",
        cursor: "pointer",
      }}
      whileHover={{
        y: -2,
        boxShadow: `0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px ${cat.color}30`,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Colored top bar */}
      <div
        className="h-[3px] w-full"
        style={{
          background: `linear-gradient(90deg, ${cat.color}, ${cat.color}40)`,
        }}
      />

      <div className="p-4 flex flex-col gap-3">
        {/* Icon + age badge */}
        <div className="flex items-start justify-between">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: cat.dim,
              border: `1px solid ${cat.color}25`,
              boxShadow: `0 0 16px ${cat.color}15`,
            }}
          >
            <cat.Icon size={16} color={cat.color} />
          </div>

          <span
            className="text-[10px] font-bold rounded-full px-2 py-0.5 tabular-nums"
            style={{
              background: cat.dim,
              color: cat.color,
              border: `1px solid ${cat.color}25`,
            }}
          >
            Age {age}
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-slate-200 leading-snug group-hover:text-white transition-colors line-clamp-2">
            {title || "Untitled milestone"}
          </span>
          <span
            className="text-[10px] font-medium"
            style={{ color: cat.color }}
          >
            {cat.label}
          </span>
        </div>

        {/* Cost */}
        <div
          className="pt-2 flex items-center justify-between border-t border-[#1C2030]"
        >
          <span className="text-[10px] text-slate-600 font-medium">
            Estimated cost
          </span>
          <span
            className="text-xs font-bold tabular-nums"
            style={{ color: cost > 0 ? cat.color : "var(--app-text-muted, #475569)" }}
          >
            {cost > 0 ? formatCurrency(cost) : "—"}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function EmptyState({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-3 w-64 py-8"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--app-border, #1C2030)" }}
      >
        <Flag size={20} className="text-slate-600" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-slate-400">
          No milestones yet
        </p>
        <p className="text-xs text-slate-600 text-center">
          Add life events to visualize them on the timeline
        </p>
      </div>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 transition-all hover:text-slate-100"
        style={{ background: "var(--app-border, #1C2030)" }}
      >
        <Plus size={12} /> Add first milestone
      </button>
    </motion.div>
  );
}
