import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const DEFAULT_MILESTONES = [
  // ₹85L flat — realistic for Tier-1 city (Mumbai/Bengaluru/Pune) 2024
  { id: "ms1", title: "Buy a flat", age: 31, cost: 85_00_000, category: "home" },
  // ₹18L wedding — middle-class Indian wedding (2-day function, catering, venue)
  { id: "ms2", title: "Wedding", age: 28, cost: 18_00_000, category: "family" },
  // ₹14L car — mid-range sedan (Honda City / Hyundai Creta level)
  { id: "ms3", title: "New car", age: 32, cost: 14_00_000, category: "vehicle" },
  {
    id: "ms4",
    // ₹40L — private college fees in India by 2040s (engineering/MBA)
    title: "Child's higher education",
    age: 48,
    cost: 40_00_000,
    category: "education",
  },
  {
    id: "ms5",
    title: "Retirement",
    age: 60,
    cost: 0,
    category: "retirement",
  },
  {
    id: "ms6",
    // ₹3.5L — Europe/Southeast Asia trip for a couple
    title: "Europe trip",
    age: 36,
    cost: 3_50_000,
    category: "travel",
  },
];

export const useMilestoneStore = create(
  subscribeWithSelector((set, get) => ({
    // ── Data ──────────────────────────────────────────────────────────────
    milestones: DEFAULT_MILESTONES,

    // ── Modal state ───────────────────────────────────────────────────────
    // editingId: null = closed  |  '__new__' = creating  |  string = editing existing
    editingId: null,
    pendingAge: 25, // pre-fill age when opening the "new" modal

    // ── CRUD ──────────────────────────────────────────────────────────────
    addMilestone: (m) =>
      set((s) => ({
        milestones: [...s.milestones, { ...m, id: `ms_${Date.now()}` }],
      })),

    removeMilestone: (id) =>
      set((s) => ({
        milestones: s.milestones.filter((m) => m.id !== id),
        editingId: s.editingId === id ? null : s.editingId,
      })),

    updateMilestone: (id, patch) =>
      set((s) => ({
        milestones: s.milestones.map((m) =>
          m.id === id ? { ...m, ...patch } : m,
        ),
      })),

    // ── Modal actions ─────────────────────────────────────────────────────
    openNew: (age = 25) => set({ editingId: "__new__", pendingAge: age }),
    openEdit: (id) => set({ editingId: id }),
    closeModal: () => set({ editingId: null }),

    // ── Reset ─────────────────────────────────────────────────────────────
    reset: () => set({ milestones: DEFAULT_MILESTONES, editingId: null }),
  })),
);
