"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Sparkles, ArrowLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import Timeline from "../../features/timeline/Timeline";
import ControlsPanel from "../../features/controls/ControlsPanel";
import SummaryPanel from "../../features/simulation/SummaryPanel";
import MilestonePanel from "../../features/milestones/MilestonePanel";
import MilestoneModal from "../../features/milestones/MilestoneModal";
import InsightsPanel from "../../features/insights/InsightsPanel";
import { useSimulationStore } from "../../features/simulation/store";
import { useMilestoneStore } from "../../features/milestones/milestoneStore";

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, delay, ease: [0.22, 0.61, 0.36, 1] },
});

/* ── App Navbar ─────────────────────────────────────────────── */
function AppNavbar({ onReset }: { onReset: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 flex justify-center w-full pointer-events-none">
        <nav
          className={`pointer-events-auto transition-all duration-500 backdrop-blur-[16px] border rounded-[100px] flex items-center justify-between w-full max-w-[1200px] ${
            scrolled
              ? "bg-[#0A0C14]/90 border-white/10 py-2.5 px-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              : "bg-black/30 border-white/10 py-4 px-8 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-[30px] h-[30px] rounded-lg bg-[#FF8A3D] flex items-center justify-center relative shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-[14px] h-[14px] bg-white rounded-sm" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Horizon</span>
          </Link>

          {/* Desktop center links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Features", href: "/#features" },
              { label: "Pricing", href: "/pricing" },
              { label: "About", href: "/about" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[15px] font-medium text-white/70 hover:text-white transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-4">
            {/* Live dot */}
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Live simulation
            </span>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all"
            >
              <RotateCcw size={13} /> Reset
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF8A3D]/15 border border-[#FF8A3D]/30 text-[13px] font-semibold text-[#FF8A3D] hover:bg-[#FF8A3D]/25 transition-all"
            >
              <ArrowLeft size={13} /> Home
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[80px] z-40 bg-[#0D0F1A]/95 backdrop-blur-xl md:hidden border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col p-5 gap-1">
              {[
                { label: "Features", href: "/#features" },
                { label: "Pricing", href: "/pricing" },
                { label: "About", href: "/about" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-[15px] font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => { onReset(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-4 py-3 text-[15px] font-medium text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                >
                  <RotateCcw size={14} /> Reset plan
                </button>
                <Link
                  href="/"
                  className="px-4 py-3 text-center text-[15px] font-semibold text-white bg-[#FF8A3D] rounded-full"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Main App Page ───────────────────────────────────────────── */
export default function AppPage() {
  const resetSim = useSimulationStore((s) => s.reset);
  const resetMilestones = useMilestoneStore((s) => s.reset);
  const handleReset = () => { resetSim(); resetMilestones(); };

  return (
    <div className="min-h-screen bg-[#080A10] font-sans text-white">

      {/* ── Ambient glow background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-[20%] w-[700px] h-[500px] rounded-full blur-[140px] opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #FF8A3D, transparent)" }} />
        <div className="absolute top-[30%] right-[15%] w-[500px] h-[400px] rounded-full blur-[120px] opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent)" }} />
        <div className="absolute bottom-[10%] left-[40%] w-[400px] h-[300px] rounded-full blur-[100px] opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #3B82F6, transparent)" }} />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #94A3B8 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, #FF8A3D40 40%, #FF8A3D40 60%, transparent 100%)" }} />
      </div>

      <AppNavbar onReset={handleReset} />
      <MilestoneModal />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-16 flex flex-col gap-8">

        {/* ── PAGE HEADER ── */}
        <motion.header {...FADE_UP(0)} className="flex flex-col gap-4 pb-2 border-b border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
              🇮🇳 Indian Demographics
            </span>
            <span className="text-[11px] font-medium text-white/40 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              Ages 20 – 80 · 60-year simulation
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-[38px] font-bold tracking-tight leading-[1.15]">
                <span className="text-white">Your financial life,&nbsp;</span>
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #FF8A3D 0%, #F59E0B 100%)" }}>
                  decade by decade
                </span>
              </h1>
              <p className="mt-2 text-[15px] text-white/45 max-w-xl leading-relaxed">
                Drag any slider — the 60-year trajectory recomputes instantly.
                Drop milestones, model life events, stress-test your plan.
              </p>
            </div>
          </div>
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

        {/* ── CONTROLS + PRINCIPLES ── */}
        <motion.section {...FADE_UP(0.23)} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ControlsPanel />
          </div>
          <PrinciplesCard />
        </motion.section>

        {/* ── INSIGHTS ── */}
        <motion.section {...FADE_UP(0.28)}>
          <InsightsPanel />
        </motion.section>

        {/* ── FOOTER ── */}
        <footer className="pt-6 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#FF8A3D] flex items-center justify-center">
              <div className="w-[9px] h-[9px] bg-white rounded-sm" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
            </div>
            <span className="text-[13px] font-bold text-white/80 tracking-tight">Horizon</span>
            <span className="text-[12px] text-white/30 ml-1">· All projections run locally. Nothing leaves your browser. Made for India 🇮🇳</span>
          </div>
          <div className="flex items-center gap-2">
            <Chip>Client-side</Chip>
            <Chip>₹ INR</Chip>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] text-white/30 bg-white/5 border border-white/10 rounded-full px-3 py-1">
      {children}
    </span>
  );
}

function PrinciplesCard() {
  const items = [
    "SIP consistency beats timing the market",
    "Start early — even ₹5,000/month compounds massively",
    "Build an emergency fund before investing",
    "Factor in inflation at 6–7% for Indian context",
  ];
  return (
    <div className="relative bg-white/[0.03] rounded-2xl border border-white/[0.07] p-6 flex flex-col gap-5 overflow-hidden">
      {/* top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #FF8A3D50, transparent)" }} />
      <div className="absolute -top-10 right-0 w-48 h-36 rounded-full blur-3xl pointer-events-none"
        style={{ background: "#FF8A3D10" }} />
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-[#FF8A3D]" />
        <h3 className="text-sm font-semibold text-white/80 tracking-tight">Planning principles</h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((text) => (
          <div key={text} className="flex items-start gap-3">
            <span className="text-[8px] text-[#FF8A3D] mt-[5px] flex-shrink-0">◆</span>
            <span className="text-xs text-white/45 leading-relaxed">{text}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4 border-t border-white/[0.06]">
        <p className="text-[11px] text-white/25 leading-relaxed">
          The best financial plan is one you can actually follow — not just the mathematically optimal one.
        </p>
      </div>
    </div>
  );
}
