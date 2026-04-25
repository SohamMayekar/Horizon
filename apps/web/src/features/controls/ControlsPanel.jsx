"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  TrendingUp,
  User,
  Calendar,
  IndianRupee,
  Zap,
  Target,
} from "lucide-react";
import { useSimulationStore } from "../simulation/store";
import SliderRow from "./SliderRow";
import { formatCurrency, AGE_MIN, AGE_MAX } from "../../utils/finance";

const TABS = [
  { value: "profile", label: "Profile", Icon: User },
  { value: "cashflow", label: "Cashflow", Icon: TrendingUp },
  { value: "events", label: "Life Events", Icon: Calendar },
];

export default function ControlsPanel() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="bg-[#0A0C14] rounded-2xl border border-[#1C2030] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#1C2030]">
        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">
          Simulation engine
        </p>
        <h3 className="text-sm font-bold text-slate-200">Plan parameters</h3>
        <p className="text-xs text-slate-500 mt-1">
          Every change recomputes the 60-year projection instantly.
        </p>
      </div>

      {/* Pill tab bar */}
      <div className="flex gap-1 px-4 pt-4">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              background: tab === t.value ? "#1A1F2E" : "transparent",
              color: tab === t.value ? "#F1F5F9" : "#475569",
              border:
                tab === t.value ? "1px solid #252B40" : "1px solid transparent",
            }}
          >
            <t.Icon size={11} /> {t.label}
          </button>
        ))}
      </div>

      <div className="px-6 py-4">
        {tab === "profile" ? <ProfileTab /> : null}
        {tab === "cashflow" ? <CashflowTab /> : null}
        {tab === "events" ? <EventsTab /> : null}
      </div>
    </div>
  );
}

function ProfileTab() {
  const currentAge = useSimulationStore((s) => s.currentAge);
  const setCurrentAge = useSimulationStore((s) => s.setCurrentAge);
  const currentNetWorth = useSimulationStore((s) => s.currentNetWorth);
  const setCurrentNetWorth = useSimulationStore((s) => s.setCurrentNetWorth);
  const retirementAge = useSimulationStore((s) => s.retirementAge);
  const setRetirementAge = useSimulationStore((s) => s.setRetirementAge);

  return (
    <div className="flex flex-col divide-y divide-[#1C2030]">
      <SliderRow
        label="Current age"
        value={currentAge}
        onChange={setCurrentAge}
        min={AGE_MIN}
        max={AGE_MAX - 1}
        format={(v) => `${v} yrs`}
      />
      <SliderRow
        label="Net worth today"
        value={currentNetWorth}
        onChange={setCurrentNetWorth}
        min={-50_00_000}
        max={5_00_00_000}
        step={50_000}
        format={formatCurrency}
        hint="Total assets minus liabilities"
      />
      <SliderRow
        label="Retirement age"
        value={retirementAge}
        onChange={setRetirementAge}
        min={Math.max(currentAge + 1, 40)}
        max={AGE_MAX}
        format={(v) => `${v} yrs`}
        hint={`${Math.max(0, retirementAge - currentAge)} working years remaining`}
      />
    </div>
  );
}

function CashflowTab() {
  const monthlySavings = useSimulationStore((s) => s.monthlySavings);
  const setMonthlySavings = useSimulationStore((s) => s.setMonthlySavings);
  const interestRate = useSimulationStore((s) => s.interestRate);
  const setInterestRate = useSimulationStore((s) => s.setInterestRate);
  const inflationRate = useSimulationStore((s) => s.inflationRate);
  const setInflationRate = useSimulationStore((s) => s.setInflationRate);
  const salaryGrowth = useSimulationStore((s) => s.salaryGrowth);
  const setSalaryGrowth = useSimulationStore((s) => s.setSalaryGrowth);
  const retirementSpend = useSimulationStore((s) => s.retirementSpend);
  const setRetirementSpend = useSimulationStore((s) => s.setRetirementSpend);

  const realReturn = ((1 + interestRate) / (1 + inflationRate) - 1) * 100;

  return (
    <div className="flex flex-col divide-y divide-[#1C2030]">
      <SliderRow
        label="Monthly SIP"
        value={monthlySavings}
        onChange={setMonthlySavings}
        min={0}
        max={5_00_000}
        step={1_000}
        format={(v) => `${formatCurrency(v)}/mo`}
        hint={`${formatCurrency(monthlySavings * 12)}/yr into equity & mutual funds`}
      />
      <SliderRow
        label="Expected return (nominal)"
        value={interestRate}
        onChange={setInterestRate}
        min={0.04}
        max={0.18}
        step={0.005}
        format={(v) => `${(v * 100).toFixed(1)}%`}
        hint={`Real return after inflation: ${realReturn.toFixed(1)}%`}
      />
      <SliderRow
        label="Inflation rate"
        value={inflationRate}
        onChange={setInflationRate}
        min={0.02}
        max={0.10}
        step={0.005}
        format={(v) => `${(v * 100).toFixed(1)}%`}
        hint="Indian CPI avg: ~6%. Milestone costs inflate at this rate."
      />
      <SliderRow
        label="Annual salary growth"
        value={salaryGrowth}
        onChange={setSalaryGrowth}
        min={0}
        max={0.20}
        step={0.005}
        format={(v) => `${(v * 100).toFixed(1)}%`}
        hint="Your SIP grows each year with salary increments"
      />
      <SliderRow
        label="Retirement spend (today's ₹)"
        value={retirementSpend}
        onChange={setRetirementSpend}
        min={0}
        max={50_00_000}
        step={50_000}
        format={formatCurrency}
        hint="Auto-inflated to future value at retirement"
      />
    </div>
  );
}

function EventsTab() {
  const events = useSimulationStore((s) => s.events);
  const addEvent = useSimulationStore((s) => s.addEvent);
  const removeEvent = useSimulationStore((s) => s.removeEvent);
  const currentAge = useSimulationStore((s) => s.currentAge);

  const [draft, setDraft] = useState({
    label: "",
    age: currentAge + 5,
    amount: 5_00_000,
    type: "expense",
  });

  const submit = () => {
    if (!draft.label.trim()) return;
    addEvent({
      label: draft.label.trim(),
      age: Number(draft.age),
      amount: Number(draft.amount),
      type: draft.type,
    });
    setDraft({
      label: "",
      age: currentAge + 5,
      amount: 5_00_000,
      type: "expense",
    });
  };

  const inp =
    "w-full bg-[#060810] border border-[#1C2030] rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {events.length === 0 ? (
          <p className="text-xs text-slate-600 py-2 text-center">
            No one-off events yet.
          </p>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center justify-between gap-3 bg-[#060810] border border-[#1C2030] rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-500 bg-[#1C2030] rounded-full px-2 py-0.5 flex-shrink-0">
                  Age {ev.age}
                </span>
                <span className="text-sm font-medium text-slate-200 truncate flex-1">
                  {ev.label}
                </span>
                <span
                  className={`text-xs font-bold tabular-nums flex-shrink-0 ${ev.type === "income" ? "text-emerald-400" : "text-amber-400"}`}
                >
                  {ev.type === "income" ? "+" : "−"}
                  {formatCurrency(ev.amount)}
                </span>
              </div>
              <button
                onClick={() => removeEvent(ev.id)}
                className="text-slate-600 hover:text-red-400 transition-colors p-1 flex-shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-[#060810] border border-[#1C2030] rounded-2xl p-4 flex flex-col gap-3">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          New event
        </span>
        <input
          type="text"
          placeholder="Label (e.g. Bonus, Medical expense)"
          value={draft.label}
          onChange={(e) => setDraft({ ...draft, label: e.target.value })}
          className={inp}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Age"
            value={draft.age}
            min={AGE_MIN}
            max={AGE_MAX}
            onChange={(e) => setDraft({ ...draft, age: e.target.value })}
            className={inp}
          />
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none select-none">
              ₹
            </span>
            <input
              type="number"
              placeholder="Amount (₹)"
              value={draft.amount}
              onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
              className={`${inp} pl-7`}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-0.5 bg-[#0E1118] border border-[#1C2030] rounded-xl">
            {["expense", "income"].map((type) => {
              const active = draft.type === type;
              const clr = type === "income" ? "#10B981" : "#F59E0B";
              return (
                <button
                  key={type}
                  onClick={() => setDraft({ ...draft, type })}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
                  style={{
                    background: active ? `${clr}18` : "transparent",
                    border: `1px solid ${active ? clr + "40" : "transparent"}`,
                    color: active ? clr : "#475569",
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
          <button
            onClick={submit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
            style={{ boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}
          >
            <Plus size={12} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
