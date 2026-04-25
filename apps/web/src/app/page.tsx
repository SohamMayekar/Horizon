"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import {
  BarChart3,
  Target,
  Zap,
  Shield,
  TrendingUp,
  Users,
  ArrowRight,
  Check,
  Globe,
  Sparkles,
  PiggyBank,
  LineChart,
} from "lucide-react";

/* ── Animation variants ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});



/* ── Features ── */
const FEATURES = [
  {
    icon: LineChart,
    title: "60-Year Projections",
    description:
      "Simulate your financial trajectory decade by decade. Every slider change recomputes instantly.",
    color: "#3B82F6",
  },
  {
    icon: Target,
    title: "Milestone Planning",
    description:
      "Drop life events — home purchase, education, retirement — onto your timeline and see the impact.",
    color: "#8B5CF6",
  },
  {
    icon: PiggyBank,
    title: "SIP & Investment Modeling",
    description:
      "Model SIP growth, lump-sum investments, and asset allocation strategies with Indian demographics.",
    color: "#10B981",
  },
  {
    icon: Shield,
    title: "100% Private",
    description:
      "All computations run in your browser. Nothing leaves your device. No sign-up required to start.",
    color: "#F43F5E",
  },
  {
    icon: Zap,
    title: "Real-Time Insights",
    description:
      "AI-powered suggestions adapt as you adjust your plan — instant feedback, zero latency.",
    color: "#F97316",
  },
  {
    icon: Globe,
    title: "Indian Context",
    description:
      "Built for Indian demographics, tax slabs, inflation rates, and investment instruments.",
    color: "#06B6D4",
  },
];



/* ── Stats ── */
const STATS = [
  { value: "60 yrs", label: "Projection horizon" },
  { value: "< 2 min", label: "To your first plan" },
  { value: "0 bytes", label: "Data sent to server" },
  { value: "100%", label: "Client-side privacy" },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col items-center pt-[150px] md:pt-[170px] pb-0 z-0">
        {/* Background Image — full bleed, no dark bg, let it breathe */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.png"
            alt="Horizon Background"
            fill
            className="object-cover object-[center_top]"
            priority
          />
          {/* Light overlay only at top for navbar legibility, fades to transparent in center */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />
          {/* Bottom fade to white for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-[280px] bg-gradient-to-t from-white via-white/60 to-transparent" />
        </div>

        {/* Text content — upper portion, centered */}
        <div className="relative z-10 w-full px-4 md:px-8 max-w-3xl mx-auto flex flex-col items-center text-center pb-8 md:pb-10">
          <motion.div {...fadeUp(0)} className="flex flex-col items-center gap-0">
            {/* Headline */}
            <h1 className="text-[clamp(2.6rem,6.5vw,4.5rem)] font-bold leading-[1.1] text-white drop-shadow-xl mb-4 tracking-tight [text-wrap:balance]">
              Plan your financial life,{" "}
              see the <em className="font-serif italic font-light text-[#FF8A3D]">horizon</em>
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-[1.1rem] text-white/85 max-w-[500px] mx-auto leading-relaxed mb-7 drop-shadow [text-wrap:balance]">
              Discover the right strategy, model your milestones, and run
              simulations that actually work — all in your browser.
            </p>

            {/* CTA */}
            <Link
              href="/app"
              className="px-9 py-3.5 text-[1rem] font-semibold text-white bg-[#FF8A3D] hover:bg-[#e67a2e] rounded-full transition-all hover:-translate-y-1 shadow-[0_12px_28px_rgba(255,138,61,0.45)] flex items-center gap-2 group"
            >
              Get started free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Dashboard — bleeds out of hero into next section, like reference */}
        <div className="relative z-10 w-full px-4 md:px-6 max-w-[980px] mx-auto translate-y-[80px] md:translate-y-[120px] mb-0">
          <motion.div {...fadeUp(0.25)}>
            <div className="rounded-[20px] p-[6px] bg-white/15 backdrop-blur-xl border-2 border-white/35 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_40px_100px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]">
              <div className="rounded-[14px] overflow-hidden">
                <Image
                  src="/images/dashboard.png"
                  alt="Horizon Dashboard — Financial planning workspace"
                  width={2048}
                  height={1317}
                  className="w-full h-auto block"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* ═══════════════════════════════════════════
          FEATURES GRID
      ═══════════════════════════════════════════ */}
      {/* Extra top padding absorbs the dashboard bleed from hero */}
      <section className="pt-[140px] md:pt-[200px] pb-24 md:pb-32" id="features">
        <div className="container-narrow">
          <motion.div
            {...fadeUp(0)}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-[42px] font-bold tracking-tight leading-[1.15] text-gray-900 mb-4">
              Everything you need to plan your money
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              From decade-by-decade projections to real-time AI insights —
              Horizon gives you the full picture.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                {...fadeUp(0.08 * i)}
                className="group relative bg-white border border-gray-100 rounded-2xl p-7 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: feat.color + "12" }}
                >
                  <feat.icon size={22} style={{ color: feat.color }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRODUCT SHOWCASE (Split)
      ═══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="container-narrow">
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
            <motion.div {...fadeUp(0)}>
              <h3 className="text-3xl md:text-[36px] font-bold tracking-tight leading-[1.2] text-gray-900 mb-5">
                Drag a slider.
                <br />
                <em className="font-serif italic font-light text-blue-500 not-italic">
                  Watch 60 years recalculate.
                </em>
              </h3>
              <p className="text-[16px] text-gray-500 leading-relaxed mb-6">
                Every parameter — income growth, inflation rate, SIP amount —
                feeds into a real-time projection engine. No waiting, no
                page reloads. Just move a slider and see your entire financial
                trajectory shift.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Compound growth visualization",
                  "Indian inflation & tax modeling",
                  "Side-by-side scenario comparison",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-blue-600" />
                    </div>
                    <span className="text-[15px] text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="relative">
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white">
                <Image
                  src="/images/dashboard-sm.png"
                  alt="Simulation engine showing financial projections"
                  width={512}
                  height={330}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -inset-4 -z-10 bg-blue-100/30 rounded-3xl blur-2xl" />
            </motion.div>
          </div>

          {/* Row 2 — Reversed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div {...fadeUp(0.15)} className="relative order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white">
                <Image
                  src="/images/workflow.png"
                  alt="Workflow and milestone planning"
                  width={384}
                  height={256}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -inset-4 -z-10 bg-purple-100/30 rounded-3xl blur-2xl" />
            </motion.div>
            <motion.div {...fadeUp(0)} className="order-1 lg:order-2">
              <h3 className="text-3xl md:text-[36px] font-bold tracking-tight leading-[1.2] text-gray-900 mb-5">
                Plan life events.
                <br />
                <em className="font-serif italic font-light text-purple-500">
                  See the ripple effect.
                </em>
              </h3>
              <p className="text-[16px] text-gray-500 leading-relaxed mb-6">
                Drop milestones — buying a house, your child&apos;s education,
                early retirement — directly onto the timeline. Watch how each
                event changes your projected corpus in real time.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Drag-and-drop milestone placement",
                  "Automatic expense impact analysis",
                  "Multi-goal optimization",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-purple-600" />
                    </div>
                    <span className="text-[15px] text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAND
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="container-narrow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fadeUp(0.1 * i)}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-gray-950">
        <div className="container-narrow">
          <motion.div
            {...fadeUp(0)}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
              Build your financial plan.
              <br />
              <span className="text-[#FF8A3D]">Right now. In your browser.</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
              No sign-up. No data collection. Just open the app and start
              simulating your future in under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/app"
                className="group px-8 py-4 text-[16px] font-semibold text-white bg-[#FF8A3D] hover:bg-[#e67a2e] rounded-full shadow-[0_10px_30px_rgba(255,138,61,0.35)] transition-all active:scale-[0.97] flex items-center gap-2"
              >
                Open the app
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 text-[16px] font-semibold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-full transition-all"
              >
                See features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
