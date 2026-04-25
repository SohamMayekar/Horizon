"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Check } from "lucide-react";
import { useMilestoneStore } from "./milestoneStore";
import { CATEGORIES, CATEGORY_KEYS, getCat } from "./milestoneConfig";
import { AGE_MIN, AGE_MAX } from "../../utils/finance";

const EMPTY = { title: "", age: 25, cost: 0, category: "home" };

function parseCost(v) {
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export default function MilestoneModal() {
  const editingId = useMilestoneStore((s) => s.editingId);
  const pendingAge = useMilestoneStore((s) => s.pendingAge);
  const milestones = useMilestoneStore((s) => s.milestones);
  const addMilestone = useMilestoneStore((s) => s.addMilestone);
  const updateMilestone = useMilestoneStore((s) => s.updateMilestone);
  const removeMilestone = useMilestoneStore((s) => s.removeMilestone);
  const closeModal = useMilestoneStore((s) => s.closeModal);

  const isNew = editingId === "__new__";
  const isOpen = editingId !== null;
  const existing = milestones.find((m) => m.id === editingId);

  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (!isOpen) return;
    if (isNew) setForm({ ...EMPTY, age: pendingAge });
    else if (existing)
      setForm({
        title: existing.title,
        age: existing.age,
        cost: existing.cost,
        category: existing.category,
      });
  }, [editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(() => {
    const payload = {
      title: form.title.trim() || "Untitled milestone",
      age: Number(form.age),
      cost: parseCost(form.cost),
      category: form.category,
    };
    if (isNew) addMilestone(payload);
    else updateMilestone(editingId, payload);
    closeModal();
  }, [form, isNew, editingId, addMilestone, updateMilestone, closeModal]);

  const handleDelete = useCallback(() => {
    if (!isNew && editingId) removeMilestone(editingId);
    closeModal();
  }, [isNew, editingId, removeMilestone, closeModal]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSave();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeModal, handleSave]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const cat = getCat(form.category);
  const agePct = ((form.age - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100;

  const modal = (
    <AnimatePresence>
      {isOpen ? (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <motion.div style={{ position: "absolute", inset: 0, background: "rgba(4,6,16,0.82)", backdropFilter: "blur(8px)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} onClick={closeModal} />
          <motion.div
            style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460, background: "var(--app-card-bg, #0B0D18)", border: `1px solid ${cat.color}35`, borderRadius: 22, boxShadow: `0 0 0 1px var(--app-border, #1C2030), 0 40px 100px rgba(0,0,0,0.6), 0 0 80px ${cat.color}12`, overflow: "hidden" }}
            initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }} onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: 3, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}50, transparent)` }} />
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: cat.dim, border: `1px solid ${cat.color}30`, boxShadow: `0 0 14px ${cat.color}18` }}>
                  <cat.Icon size={16} color={cat.color} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{isNew ? "New milestone" : "Edit milestone"}</span>
                  <span className="text-sm font-bold text-slate-100 leading-tight">{form.title || (isNew ? "Untitled" : existing?.title) || "—"}</span>
                </div>
              </div>
              <button onClick={closeModal} className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"><X size={14} /></button>
            </div>
            <div className="h-px mx-5" style={{ background: "var(--app-border-2, #1A1F2E)" }} />
            <div className="px-5 py-5 flex flex-col gap-5">
              <Field label="Title">
                <input autoFocus type="text" placeholder="e.g. Buy a flat, Wedding…" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} style={{ outline: "none", background: "var(--app-input-bg, #080A13)", borderColor: "var(--app-border, #1C2030)", color: "var(--app-text-primary, #F1F5F9)" }} className="w-full border rounded-xl px-4 py-2.5 text-sm placeholder:text-slate-600 focus:border-blue-500/60 transition-all" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={`Age — ${form.age}`}>
                  <div className="relative h-10 flex items-center">
                    <div className="absolute inset-x-0 h-[3px] rounded-full" style={{ background: "var(--app-border, #1C2030)" }} />
                    <div className="absolute left-0 h-[3px] rounded-full" style={{ width: `${agePct}%`, background: `linear-gradient(90deg, ${cat.color}90, ${cat.color})`, boxShadow: `0 0 8px ${cat.color}50` }} />
                    <div className="absolute w-[15px] h-[15px] rounded-full bg-white border-2 pointer-events-none" style={{ left: `calc(${agePct}% - 7.5px)`, borderColor: cat.color, boxShadow: `0 0 0 3px ${cat.color}28, 0 2px 8px rgba(0,0,0,0.5)` }} />
                    <input type="range" min={AGE_MIN} max={AGE_MAX} step={1} value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: Number(e.target.value) }))} className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                  </div>
                </Field>
                <Field label="Cost (₹)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none select-none">₹</span>
                    <input type="number" placeholder="0" value={form.cost} onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))} style={{ outline: "none", background: "var(--app-input-bg, #080A13)", borderColor: "var(--app-border, #1C2030)", color: "var(--app-text-primary, #F1F5F9)" }} className="w-full border rounded-xl pl-7 pr-3 py-2.5 text-sm placeholder:text-slate-600 focus:border-blue-500/60 transition-all tabular-nums" />
                  </div>
                </Field>
              </div>
              <Field label="Category">
                <div className="grid grid-cols-4 gap-1.5">
                  {CATEGORY_KEYS.map((key) => {
                    const c = CATEGORIES[key];
                    const active = form.category === key;
                    return (
                      <button key={key} onClick={() => setForm((f) => ({ ...f, category: key }))} className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all" style={{ background: active ? c.dim : "var(--app-card-bg-2, #0E1118)", border: `1px solid ${active ? c.color + "55" : "var(--app-border, #1C2030)"}`, boxShadow: active ? `0 0 12px ${c.color}20` : "none" }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: active ? `${c.color}28` : "var(--app-border-2, #1A1F2E)" }}>
                          <c.Icon size={13} color={active ? c.color : "#475569"} />
                        </div>
                        <span className="text-[9px] font-bold leading-none text-center" style={{ color: active ? c.color : "#475569" }}>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t" style={{ borderColor: "var(--app-border-2, #1A1F2E)" }}>
              {!isNew ? (
                <button onClick={handleDelete} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-400/8 border border-transparent hover:border-red-400/25 transition-all"><Trash2 size={12} /> Delete</button>
              ) : <div />}
              <div className="flex items-center gap-2">
                <button onClick={closeModal} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 transition-all" style={{ background: "var(--app-tab-active, #1A1F2E)" }}>Cancel</button>
                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all" style={{ background: `linear-gradient(135deg, ${cat.color}EE, ${cat.color}AA)`, boxShadow: `0 4px 18px ${cat.color}45` }}><Check size={12} />{isNew ? "Create" : "Save changes"}</button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</label>
      {children}
    </div>
  );
}
