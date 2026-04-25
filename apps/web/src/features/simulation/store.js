import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { AGE_MIN, AGE_MAX } from "../../utils/finance";

export const useSimulationStore = create(
  subscribeWithSelector((set) => ({
    // ── Personal ──────────────────────────────────────────────────────────
    currentAge: 25,
    currentNetWorth: 2_00_000, // ₹2 Lakh — realistic savings at 25 (just starting out)

    // ── Savings engine inputs ─────────────────────────────────────────────
    monthlySavings: 20_000, // ₹20,000/month SIP — ~30% savings rate on ₹65k take-home
    interestRate: 0.12, // 12% — Nifty 50 long-run CAGR average
    inflationRate: 0.06, // 6% — RBI target band for India
    salaryGrowth: 0.08, // 8% annual increment — typical IT/corporate India

    // ── Retirement ────────────────────────────────────────────────────────
    retirementAge: 60,
    retirementSpend: 12_00_000, // ₹12 Lakh/year = ₹1L/month (comfortable retirement in today's money)

    // ── Timeline UI state ─────────────────────────────────────────────────
    selectedAge: 25,

    // ── Legacy one-off life events ─────────────────────────────────────────
    events: [
      {
        id: "e1",
        age: 40,
        amount: 15_00_000,
        label: "PPF maturity payout",
        type: "income",
      },
      {
        id: "e2",
        age: 55,
        amount: 8_00_000,
        label: "Medical emergency fund",
        type: "expense",
      },
    ],

    // ── Setters ───────────────────────────────────────────────────────────
    setCurrentAge: (v) => set({ currentAge: v }),
    setCurrentNetWorth: (v) => set({ currentNetWorth: v }),
    setMonthlySavings: (v) => set({ monthlySavings: v }),
    setInterestRate: (v) => set({ interestRate: v }),
    setInflationRate: (v) => set({ inflationRate: v }),
    setSalaryGrowth: (v) => set({ salaryGrowth: v }),
    setRetirementAge: (v) => set({ retirementAge: v }),
    setRetirementSpend: (v) => set({ retirementSpend: v }),
    setSelectedAge: (v) => set({ selectedAge: v }),

    addEvent: (ev) =>
      set((s) => ({ events: [...s.events, { ...ev, id: `e${Date.now()}` }] })),
    removeEvent: (id) =>
      set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
    updateEvent: (id, patch) =>
      set((s) => ({
        events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      })),

    reset: () =>
      set({
        currentAge: 25,
        currentNetWorth: 2_00_000,
        monthlySavings: 20_000,
        interestRate: 0.12,
        inflationRate: 0.06,
        salaryGrowth: 0.08,
        retirementAge: 60,
        retirementSpend: 12_00_000,
        selectedAge: 25,
        events: [
          {
            id: "e1",
            age: 40,
            amount: 15_00_000,
            label: "PPF maturity payout",
            type: "income",
          },
          {
            id: "e2",
            age: 55,
            amount: 8_00_000,
            label: "Medical emergency fund",
            type: "expense",
          },
        ],
      }),
  })),
);
