"use client";

import { motion } from "motion/react";
import {
  TrendingUp,
  AlertTriangle,
  Target,
  Zap,
  ArrowUpRight,
  IndianRupee,
} from "lucide-react";
import { useSimulation, useSelectedPoint } from "../../hooks/useSimulation";
import { useSimulationStore } from "./store";
import CircularRing from "../../components/CircularRing";
import {
  formatCurrencyFull,
  formatCurrency,
  AGE_MIN,
} from "../../utils/finance";

// ─── Shared primitives ────────────────────────────────────────────────────────

function MetricCard({
  children,
  accent = "#3B82F6",
  delay = 0,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={`relative flex flex-col gap-0 overflow-hidden rounded-2xl border border-[#1C2030] ${className}`}
      style={{ background: "#0A0C14" }}
    >
      {/* top glow line */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${accent}60 40%, ${accent}60 60%, transparent 95%)`,
        }}
      />
      {/* corner glow blob */}
      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-24 rounded-full blur-3xl pointer-events-none"
        style={{ background: `${accent}12` }}
      />
      {children}
    </motion.div>
  );
}

function CardSection({ children, border = true }) {
  return (
    <div className={`px-5 py-4 ${border ? "border-t border-[#1C2030]" : ""}`}>
      {children}
    </div>
  );
}

function Kicker({ children, color = "#64748B" }) {
  return (
    <p
      className="text-[10px] uppercase tracking-widest font-bold"
      style={{ color }}
    >
      {children}
    </p>
  );
}

function BigNum({ value, sub, color = "#F8FAFC" }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[26px] font-bold tabular-nums tracking-tight leading-none"
        style={{ color }}
      >
        {value}
      </span>
      {sub ? (
        <span className="text-xs text-slate-500 font-medium">{sub}</span>
      ) : null}
    </div>
  );
}

function DataRow({ label, value, valueColor = "#CBD5E1" }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span
        className="text-xs font-bold tabular-nums"
        style={{ color: valueColor }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export default function SummaryPanel() {
  const { points, summary } = useSimulation();
  const selected = useSelectedPoint();
  const currentAge = useSimulationStore((s) => s.currentAge);
  const retirementAge = useSimulationStore((s) => s.retirementAge);
  const monthlySavings = useSimulationStore((s) => s.monthlySavings);
  const interestRate = useSimulationStore((s) => s.interestRate);
  const inflationRate = useSimulationStore((s) => s.inflationRate);

  const retirementPt = points.find((p) => p.age === retirementAge);
  const finalPt = points[points.length - 1];
  const depletes = !!summary.depletion;

  const workingYears = Math.max(1, retirementAge - AGE_MIN);
  const elapsed = Math.min(workingYears, Math.max(0, currentAge - AGE_MIN));
  const retirementPct = (elapsed / workingYears) * 100;

  const selectedGrowth = selected?.growthAmount ?? 0;
  const selectedSavings = selected?.annualSavings ?? 0;
  const selectedCost = selected?.milestoneCost ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* ── Card 1: Snapshot ── */}
      <MetricCard accent="#3B82F6" delay={0}>
        <CardSection border={false}>
          <div className="flex items-start justify-between mb-4">
            <Kicker color="#3B82F6">Age snapshot</Kicker>
            <span className="text-[11px] font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-2.5 py-0.5 tabular-nums">
              Age {selected?.age ?? "—"}
            </span>
          </div>
          <motion.div
            key={selected?.age}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BigNum
              value={formatCurrencyFull(selected?.balance ?? 0)}
              sub="Projected net worth"
            />
          </motion.div>
        </CardSection>

        <CardSection>
          <DataRow
            label="Investment growth"
            value={`+${formatCurrency(selectedGrowth)}/yr`}
            valueColor="#60A5FA"
          />
          <DataRow
            label="Annual SIP savings"
            value={
              selectedSavings > 0
                ? `+${formatCurrency(selectedSavings)}/yr`
                : "—"
            }
            valueColor="#34D399"
          />
          <DataRow
            label="Milestone cost"
            value={selectedCost > 0 ? `−${formatCurrency(selectedCost)}` : "—"}
            valueColor={selectedCost > 0 ? "#FCD34D" : "#475569"}
          />
          {selected?.events?.map((ev) => (
            <DataRow
              key={ev.id}
              label={ev.label}
              value={`${ev.type === "income" ? "+" : "−"}${formatCurrency(ev.amount)}`}
              valueColor={ev.type === "income" ? "#34D399" : "#FCD34D"}
            />
          ))}
        </CardSection>

        <CardSection>
          <div className="flex items-center gap-2">
            <Zap size={11} className="text-blue-400 flex-shrink-0" />
            <span className="text-[11px] text-slate-500">
              <span className="text-blue-400 font-bold">
                {(interestRate * 100).toFixed(1)}%
              </span>{" "}
              return · {" "}
              <span className="text-blue-400 font-bold">
                {(inflationRate * 100).toFixed(0)}%
              </span>{" "}
              inflation · {" "}
              <span className="text-blue-400 font-bold">
                {formatCurrency(monthlySavings)}/mo
              </span>{" "}
              SIP
            </span>
          </div>
        </CardSection>
      </MetricCard>

      {/* ── Card 2: Retirement ── */}
      <MetricCard accent="#8B5CF6" delay={0.07}>
        <CardSection border={false}>
          <div className="flex items-start justify-between mb-4">
            <Kicker color="#8B5CF6">At retirement</Kicker>
            <span className="text-[11px] font-bold text-violet-400 bg-violet-400/10 border border-violet-400/20 rounded-full px-2.5 py-0.5 inline-flex items-center gap-1">
              <Target size={9} /> Age {retirementAge}
            </span>
          </div>
          <motion.div
            key={retirementPt?.balance}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BigNum
              value={formatCurrencyFull(retirementPt?.balance ?? 0)}
              sub="Retirement corpus"
            />
          </motion.div>
        </CardSection>

        <CardSection>
          <div className="flex items-center gap-5">
            <CircularRing
              value={retirementPct}
              size={56}
              stroke={3.5}
              color="#8B5CF6"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-100">
                {Math.round(retirementPct)}% there
              </span>
              <span className="text-xs text-slate-500">
                {Math.max(0, retirementAge - currentAge)} yrs remaining
              </span>
            </div>
          </div>
        </CardSection>

        <CardSection>
          <DataRow
            label="Total milestone costs"
            value={`−${formatCurrency(summary.totalMilestoneCost ?? 0)}`}
            valueColor="#FCD34D"
          />
          <DataRow
            label="Balance at age 80"
            value={formatCurrency(finalPt?.balance ?? 0)}
            valueColor={(finalPt?.balance ?? 0) >= 0 ? "#34D399" : "#FCA5A5"}
          />
        </CardSection>
      </MetricCard>

      {/* ── Card 3: Lifetime outlook ── */}
      <MetricCard accent={depletes ? "#F59E0B" : "#10B981"} delay={0.14}>
        <CardSection border={false}>
          <div className="flex items-start justify-between mb-4">
            <Kicker color={depletes ? "#F59E0B" : "#10B981"}>
              Lifetime outlook
            </Kicker>
            <span
              className="text-[11px] font-bold rounded-full px-2.5 py-0.5 inline-flex items-center gap-1"
              style={{
                background: depletes
                  ? "rgba(245,158,11,0.1)"
                  : "rgba(16,185,129,0.1)",
                border: depletes
                  ? "1px solid rgba(245,158,11,0.3)"
                  : "1px solid rgba(16,185,129,0.3)",
                color: depletes ? "#FCD34D" : "#34D399",
              }}
            >
              {depletes ? (
                <AlertTriangle size={9} />
              ) : (
                <ArrowUpRight size={9} />
              )}
              {depletes ? `Depletes at ${summary.depletion.age}` : "On track"}
            </span>
          </div>
          <motion.div
            key={summary.peak?.balance}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BigNum
              value={formatCurrencyFull(summary.peak?.balance ?? 0)}
              sub={`Peak wealth · age ${summary.peak?.age ?? "—"}`}
              color={depletes ? "#FCD34D" : "#F8FAFC"}
            />
          </motion.div>
        </CardSection>

        <CardSection>
          <DataRow
            label="Balance at 80"
            value={formatCurrency(finalPt?.balance ?? 0)}
            valueColor={(finalPt?.balance ?? 0) >= 0 ? "#34D399" : "#FCA5A5"}
          />
          <DataRow label="Peak at age" value={summary.peak?.age ?? "—"} />
          <DataRow
            label="Total milestones"
            value={formatCurrency(summary.totalMilestoneCost ?? 0)}
            valueColor="#FCD34D"
          />
        </CardSection>

        <CardSection>
          <div className="flex items-center gap-2">
            <TrendingUp
              size={11}
              className={depletes ? "text-amber-400" : "text-emerald-400"}
            />
            <span className="text-[11px] text-slate-500">
              {depletes
                ? `Corpus depleted at age ${summary.depletion.age} — increase SIP or reduce retirement spend`
                : "Portfolio sustains through age 80 at current trajectory"}
            </span>
          </div>
        </CardSection>
      </MetricCard>
    </div>
  );
}
