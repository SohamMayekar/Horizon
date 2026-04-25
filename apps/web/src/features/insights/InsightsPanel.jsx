"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Zap,
  Target,
  Shield,
  IndianRupee,
} from "lucide-react";
import { useSimulation } from "../../hooks/useSimulation";
import { useSimulationStore } from "../simulation/store";
import { useMilestoneStore } from "../milestones/milestoneStore";
import { getCat } from "../milestones/milestoneConfig";
import {
  computeMilestoneInsights,
  findBiggestBottleneck,
  computeRequiredSavingsForSuccess,
  formatCurrency,
  formatCompact,
  formatCurrencyFull,
} from "../../utils/finance";

export default function InsightsPanel() {
  const { points, summary } = useSimulation();
  const milestones = useMilestoneStore((s) => s.milestones);

  const currentAge = useSimulationStore((s) => s.currentAge);
  const currentNetWorth = useSimulationStore((s) => s.currentNetWorth);
  const monthlySavings = useSimulationStore((s) => s.monthlySavings);
  const interestRate = useSimulationStore((s) => s.interestRate);
  const retirementAge = useSimulationStore((s) => s.retirementAge);
  const retirementSpend = useSimulationStore((s) => s.retirementSpend);
  const events = useSimulationStore((s) => s.events);

  const inflationRate = useSimulationStore((s) => s.inflationRate);
  const salaryGrowth = useSimulationStore((s) => s.salaryGrowth);

  const simParams = {
    currentAge,
    currentNetWorth,
    monthlySavings,
    interestRate,
    inflationRate,
    salaryGrowth,
    retirementAge,
    retirementSpend,
    events,
  };

  const insights = useMemo(
    () => computeMilestoneInsights({ points, milestones, simParams }),
    [points, milestones, currentAge, currentNetWorth, monthlySavings, interestRate, inflationRate, salaryGrowth, retirementAge, retirementSpend, events],
  );

  const bottleneck = useMemo(() => findBiggestBottleneck(insights), [insights]);

  const requiredSavings = useMemo(
    () =>
      computeRequiredSavingsForSuccess({
        currentAge,
        currentNetWorth,
        interestRate,
        inflationRate,
        salaryGrowth,
        retirementAge,
        retirementSpend,
        milestones,
        events,
      }),
    [currentAge, currentNetWorth, interestRate, inflationRate, salaryGrowth, retirementAge, retirementSpend, milestones, events],
  );

  const sortedInsights = useMemo(
    () => [...insights].filter((i) => i.cost > 0).sort((a, b) => a.age - b.age),
    [insights],
  );

  const hasShortfall = sortedInsights.some((i) => !i.onTrack);
  const savingsGap = Math.max(0, requiredSavings - monthlySavings);

  return (
    <div className="bg-[#0A0C14] rounded-2xl border border-[#1C2030] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#1C2030]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #8B5CF620, #3B82F620)",
                border: "1px solid #8B5CF630",
              }}
            >
              <Zap size={14} className="text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 tracking-tight">
                Intelligent Insights
              </h3>
              <p className="text-[11px] text-slate-500">
                Real-time analysis for every milestone
              </p>
            </div>
          </div>

          {/* Required savings badge */}
          <div
            className="flex flex-col items-end gap-0.5 px-3 py-1.5 rounded-xl"
            style={{
              background: savingsGap > 0 ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)",
              border: `1px solid ${savingsGap > 0 ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)"}`,
            }}
          >
            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500">
              Required SIP
            </span>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: savingsGap > 0 ? "#FCD34D" : "#34D399" }}
            >
              {formatCurrency(requiredSavings)}/mo
            </span>
          </div>
        </div>

        {/* Savings gap indicator */}
        {savingsGap > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(245,158,11,0.06)",
              border: "1px solid rgba(245,158,11,0.15)",
            }}
          >
            <AlertTriangle size={12} className="text-amber-400 flex-shrink-0" />
            <span className="text-[11px] text-amber-300/80">
              You need{" "}
              <span className="font-bold text-amber-300">
                +{formatCurrency(savingsGap)}/month
              </span>{" "}
              more to achieve all milestones comfortably
            </span>
          </motion.div>
        )}
      </div>

      {/* Milestone insights cards */}
      <div className="px-4 py-4 flex flex-col gap-2.5">
        <AnimatePresence mode="popLayout">
          {sortedInsights.map((insight, idx) => (
            <MilestoneInsightCard key={insight.id} insight={insight} index={idx} />
          ))}
        </AnimatePresence>

        {sortedInsights.length === 0 && (
          <div className="py-8 flex flex-col items-center gap-2">
            <Target size={24} className="text-slate-600" />
            <p className="text-xs text-slate-500">
              Add milestones with costs to see insights
            </p>
          </div>
        )}
      </div>

      {/* Bottleneck highlight */}
      {bottleneck && bottleneck.cost > 0 && (
        <div className="px-5 py-4 border-t border-[#1C2030]">
          <div className="flex items-start gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <Shield size={12} className="text-red-400" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-widest font-bold text-red-400">
                Biggest bottleneck
              </span>
              <span className="text-xs text-slate-300 font-semibold">
                {bottleneck.title}
              </span>
              <span className="text-[11px] text-slate-500">
                This milestone reduces your final wealth by{" "}
                <span className="text-red-400 font-bold">
                  {formatCurrency(bottleneck.impactOnFinalWealth)}
                </span>
                {" "}due to lost compounding over {80 - bottleneck.age} years.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Individual insight card ────────────────────────────────────────────────────

function MilestoneInsightCard({ insight, index }) {
  const {
    title,
    age,
    cost,
    category,
    onTrack,
    gap,
    additionalMonthlySavings,
    balanceAtMilestone,
    impactOnFinalWealth,
    status,
  } = insight;

  const cat = getCat(category);
  const CatIcon = cat.Icon;

  const statusConfig = {
    green: {
      bg: "rgba(16,185,129,0.06)",
      border: "rgba(16,185,129,0.15)",
      color: "#34D399",
      label: "On track",
      Icon: CheckCircle,
    },
    amber: {
      bg: "rgba(245,158,11,0.06)",
      border: "rgba(245,158,11,0.15)",
      color: "#FCD34D",
      label: "Tight",
      Icon: AlertTriangle,
    },
    red: {
      bg: "rgba(239,68,68,0.06)",
      border: "rgba(239,68,68,0.15)",
      color: "#FCA5A5",
      label: "Shortfall",
      Icon: TrendingDown,
    },
  };

  const st = statusConfig[status] || statusConfig.green;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.28,
        delay: index * 0.04,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      className="rounded-xl overflow-hidden"
      style={{
        background: "#0E1118",
        border: `1px solid #1C2030`,
      }}
    >
      {/* Top accent */}
      <div
        className="h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${cat.color}80, ${st.color}60, transparent)`,
        }}
      />

      <div className="px-4 py-3.5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: cat.dim,
                border: `1px solid ${cat.color}25`,
              }}
            >
              <CatIcon size={12} color={cat.color} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200 leading-tight">
                {title}
              </span>
              <span className="text-[10px] text-slate-500">
                Age {age} · {formatCurrency(cost)}
              </span>
            </div>
          </div>

          {/* Status pill */}
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{
              background: st.bg,
              border: `1px solid ${st.border}`,
              color: st.color,
            }}
          >
            <st.Icon size={9} />
            {st.label}
          </div>
        </div>

        {/* Data rows */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Balance at milestone</span>
            <span
              className="text-[11px] font-bold tabular-nums"
              style={{ color: balanceAtMilestone >= 0 ? "#CBD5E1" : "#FCA5A5" }}
            >
              {formatCurrency(balanceAtMilestone)}
            </span>
          </div>

          {impactOnFinalWealth > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Impact on wealth at 80</span>
              <span className="text-[11px] font-bold tabular-nums text-amber-400">
                −{formatCurrency(impactOnFinalWealth)}
              </span>
            </div>
          )}

          {/* Action insight */}
          {!onTrack && additionalMonthlySavings > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1.5 flex items-center gap-2 px-2.5 py-2 rounded-lg"
              style={{
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.12)",
              }}
            >
              <IndianRupee size={10} className="text-amber-400 flex-shrink-0" />
              <span className="text-[11px] text-amber-300/80 leading-snug">
                You need{" "}
                <span className="font-bold text-amber-300">
                  +{formatCurrency(additionalMonthlySavings)}/month
                </span>{" "}
                to achieve this
              </span>
            </motion.div>
          )}

          {onTrack && status === "green" && (
            <div className="mt-1 flex items-center gap-1.5">
              <CheckCircle size={10} className="text-emerald-400" />
              <span className="text-[11px] text-emerald-400/80">
                Current SIP covers this milestone comfortably
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
