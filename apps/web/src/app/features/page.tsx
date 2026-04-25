"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/landing/Navbar";
import Footer from "../../components/landing/Footer";
import {
  LineChart,
  Target,
  PiggyBank,
  Shield,
  Zap,
  Globe,
  BarChart3,
  Layers,
  Clock,
  ArrowRight,
  Check,
  Sparkles,
  TrendingUp,
  Calculator,
  Lock,
  Workflow,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] },
});

const CAPABILITIES = [
  {
    category: "Simulation Engine",
    icon: LineChart,
    color: "#3B82F6",
    title: "60-Year Real-Time Projections",
    description:
      "Every slider change triggers an instant recalculation of your entire financial trajectory. No loading spinners, no server calls — just pure, real-time math.",
    bullets: [
      "Compound interest visualization across decades",
      "Multi-variable sensitivity analysis",
      "Inflation-adjusted projections at 6-7% (Indian CPI)",
      "Income growth modeling with career milestones",
    ],
    image: "/images/dashboard-sm.png",
  },
  {
    category: "Milestone Planning",
    icon: Target,
    color: "#8B5CF6",
    title: "Drop Life Events. See the Ripple.",
    description:
      "Drag milestones onto your timeline — buying a home, funding education, early retirement. Watch how each event reshapes your projected wealth in real time.",
    bullets: [
      "Drag-and-drop milestone placement",
      "Automatic corpus impact analysis",
      "Multi-goal optimization engine",
      "Conflict detection between competing goals",
    ],
    image: "/images/workflow.png",
  },
  {
    category: "Indian Context",
    icon: Globe,
    color: "#10B981",
    title: "Built for Indian Financial Reality",
    description:
      "This isn't a US tool with the currency swapped. Every assumption, tax slab, and instrument is modeled for Indian demographics.",
    bullets: [
      "EPF, PPF, NPS, ELSS modeling",
      "Section 80C / 80D tax optimization",
      "Indian inflation & GDP growth rates",
      "HRA, LTA, and standard deduction calculations",
    ],
    image: "/images/nature.png",
  },
];

const ADDITIONAL_FEATURES = [
  { icon: Calculator, title: "SIP Calculator", description: "Model systematic investment plans with step-up and top-up scenarios." },
  { icon: TrendingUp, title: "Asset Allocation", description: "Visualize equity-debt-gold splits and their impact on returns." },
  { icon: Lock, title: "Zero Data Collection", description: "No accounts, no analytics, no tracking. Your browser is your vault." },
  { icon: Workflow, title: "Scenario Comparison", description: "Compare aggressive vs. conservative plans side by side." },
  { icon: Clock, title: "Retirement Readiness", description: "See your exact FIRE number with Indian cost-of-living data." },
  { icon: Sparkles, title: "AI Insights", description: "Context-aware suggestions that adapt as you tweak your plan." },
  { icon: Layers, title: "Multi-Goal Stacking", description: "Layer multiple financial goals and see how they interact." },
  { icon: BarChart3, title: "PDF Reports", description: "Export beautiful, shareable reports of your financial plan." },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/40 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-orange-100/30 blur-[100px]" />

        <div className="relative container-narrow text-center max-w-3xl mx-auto">
          <motion.span {...fadeUp(0)} className="inline-block text-[13px] font-semibold text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-4 py-1 mb-6">
            Product
          </motion.span>
          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl md:text-[52px] font-bold tracking-tight leading-[1.1] text-gray-900 mb-6"
          >
            One canvas for your{" "}
            <span className="font-serif italic text-orange-500">
              entire financial life
            </span>
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto"
          >
            Horizon connects every financial decision to every other — income,
            expenses, investments, milestones — in a single, real-time
            simulation.
          </motion.p>
        </div>
      </section>

      {/* ── Full-Width Screenshot ── */}
      <section className="pb-20">
        <div className="container-narrow max-w-5xl">
          <motion.div {...fadeUp(0.3)} className="relative">
            <div className="rounded-2xl overflow-hidden border border-gray-200/80 shadow-2xl shadow-gray-900/10 bg-white">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200/60">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-gray-100 rounded-md flex items-center px-3 max-w-md mx-auto">
                    <span className="text-xs text-gray-400">app.horizon.finance</span>
                  </div>
                </div>
              </div>
              <Image
                src="/images/dashboard.png"
                alt="Horizon product dashboard"
                width={2048}
                height={1317}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="absolute -inset-4 -z-10 bg-gradient-to-b from-orange-100/40 to-transparent rounded-3xl blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ── Deep Dive Features ── */}
      {CAPABILITIES.map((cap, i) => (
        <section
          key={cap.category}
          className={`py-20 md:py-28 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
        >
          <div className="container-narrow">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                i % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Text */}
              <motion.div {...fadeUp(0)}>
                <span
                  className="inline-flex items-center gap-2 text-[13px] font-semibold rounded-full px-4 py-1 mb-5"
                  style={{
                    color: cap.color,
                    background: cap.color + "10",
                    border: `1px solid ${cap.color}20`,
                  }}
                >
                  <cap.icon size={14} />
                  {cap.category}
                </span>
                <h3 className="text-3xl md:text-[36px] font-bold tracking-tight leading-[1.2] text-gray-900 mb-5">
                  {cap.title}
                </h3>
                <p className="text-[16px] text-gray-500 leading-relaxed mb-7">
                  {cap.description}
                </p>
                <ul className="flex flex-col gap-3">
                  {cap.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: cap.color + "15" }}
                      >
                        <Check size={12} style={{ color: cap.color }} />
                      </div>
                      <span className="text-[15px] text-gray-600">{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Image */}
              <motion.div {...fadeUp(0.15)} className="relative">
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white">
                  <Image
                    src={cap.image}
                    alt={cap.title}
                    width={512}
                    height={330}
                    className="w-full h-auto"
                  />
                </div>
                <div
                  className="absolute -inset-4 -z-10 rounded-3xl blur-2xl"
                  style={{ background: cap.color + "10" }}
                />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Additional Features Grid ── */}
      <section className="py-20 md:py-28" id="integrations">
        <div className="container-narrow">
          <motion.div {...fadeUp(0)} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-[38px] font-bold tracking-tight leading-[1.15] text-gray-900 mb-4">
              And{" "}
              <span className="font-serif italic text-orange-500">
                so much more
              </span>
            </h2>
            <p className="text-lg text-gray-500">
              Every feature is designed to give you clarity, not complexity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADDITIONAL_FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                {...fadeUp(0.05 * i)}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300"
              >
                <feat.icon size={20} className="text-orange-500 mb-4" />
                <h4 className="text-[15px] font-semibold text-gray-900 mb-1.5">
                  {feat.title}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="container-narrow">
          <motion.div
            {...fadeUp(0)}
            className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-12 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              See it in action
            </h2>
            <p className="text-lg text-orange-100 max-w-lg mx-auto mb-8">
              The best way to understand Horizon is to try it. It&apos;s free,
              takes 30 seconds, and nothing leaves your browser.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-[16px] font-semibold text-orange-600 bg-white hover:bg-orange-50 rounded-full shadow-xl transition-all active:scale-[0.97]"
            >
              Get started free
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
