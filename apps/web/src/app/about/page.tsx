"use client";

import { motion } from "motion/react";
import Navbar from "../../components/landing/Navbar";
import Footer from "../../components/landing/Footer";
import {
  Heart,
  Target,
  Eye,
  Users,
  Lightbulb,
  MapPin,
  Mail,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] },
});

const VALUES = [
  {
    icon: Eye,
    title: "Transparency First",
    description:
      "Every calculation is visible, every assumption is adjustable. No black boxes, no hidden agendas.",
    color: "#3B82F6",
  },
  {
    icon: Heart,
    title: "Privacy by Design",
    description:
      "Your financial data never leaves your browser. We literally can't see it — and that's by design.",
    color: "#F43F5E",
  },
  {
    icon: Lightbulb,
    title: "Simplicity over Complexity",
    description:
      "Financial planning shouldn't require a CA degree. We make the complex approachable.",
    color: "#F97316",
  },
  {
    icon: Users,
    title: "Built for India",
    description:
      "Indian tax slabs, EPF, PPF, NPS, ELSS — we speak your financial language fluently.",
    color: "#10B981",
  },
];

const TEAM = [
  {
    name: "Soham Mayekar",
    role: "Core Team",
    initials: "SM",
    gradient: "from-orange-400 to-amber-500",
  },
  {
    name: "Devesh Kushe",
    role: "Core Team",
    initials: "DK",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    name: "Rudraksha Patil",
    role: "Core Team",
    initials: "RP",
    gradient: "from-purple-400 to-violet-500",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/40 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-orange-100/30 blur-[100px]" />

        <div className="relative container-narrow text-center max-w-3xl mx-auto">
          <motion.span {...fadeUp(0)} className="inline-block text-[13px] font-semibold text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-4 py-1 mb-6">
            About Horizon
          </motion.span>
          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl md:text-[52px] font-bold tracking-tight leading-[1.1] text-gray-900 mb-6"
          >
            We&apos;re building the financial
            <br />
            planning tool we{" "}
            <span className="font-serif italic font-light text-orange-500">
              wished existed
            </span>
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto"
          >
            Born from the frustration of spreadsheets and generic calculators,
            Horizon gives every Indian a clear, visual, privacy-first way to
            plan their financial life.
          </motion.p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-20 md:py-28">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp(0)}>
              <h2 className="text-3xl md:text-[38px] font-bold tracking-tight leading-[1.15] text-gray-900 mb-6">
                Our problem{" "}
                <span className="font-serif italic font-light text-orange-500">
                  statement
                </span>
              </h2>
              <div className="flex flex-col gap-5 text-[16px] text-gray-500 leading-relaxed">
                <p>
                  Horizon is built around a simple but technically demanding
                  question: what happens when life goals are placed on a real
                  age-indexed timeline, and every decision changes the money
                  available for every decision after it?
                </p>
                <p>
                  A standard calculator can compound savings in isolation. Our
                  challenge is forward simulation: each milestone drawdown,
                  whether an apartment, studio, education fund, or retirement
                  event, reduces the base from which all future compounding
                  continues.
                </p>
                <p>
                  The product turns that model into an interactive canvas with
                  drag-to-place milestone markers, real-time what-if
                  recalculation, contextual shortfall signals, and animated
                  zoom so people can understand the exact parameter change
                  needed without judgment or financial guesswork.
                </p>
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="relative">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100/50 rounded-2xl p-10">
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <Target className="text-orange-500 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Real-Life Scenario</h4>
                      <p className="text-[15px] text-gray-500 leading-relaxed">
                        Aditya, 28, drags an apartment milestone to age 32 and
                        a studio milestone to age 35. His Rs. 25,000 monthly
                        savings projection shows an amber shortfall; at Rs.
                        32,000, the curve rises and the marker resolves green.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Eye className="text-orange-500 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Core Experience</h4>
                      <p className="text-[15px] text-gray-500 leading-relaxed">
                        The timeline supports age 20-80 planning, category
                        markers, sequential capital drawdowns, what-if savings
                        controls, net-worth baselines, multi-scale zoom, and
                        optional inflation-adjusted assumptions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container-narrow">
          <motion.div {...fadeUp(0)} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-[38px] font-bold tracking-tight leading-[1.15] text-gray-900 mb-4">
              What we{" "}
              <span className="font-serif italic font-light text-orange-500">
                believe in
              </span>
            </h2>
            <p className="text-lg text-gray-500">
              These aren&apos;t corporate platitudes. They&apos;re the principles
              that shape every feature we build.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp(0.08 * i)}
                className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: v.color + "12" }}
                >
                  <v.icon size={22} style={{ color: v.color }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {v.title}
                </h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 md:py-28" id="team">
        <div className="container-narrow">
          <motion.div {...fadeUp(0)} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-[38px] font-bold tracking-tight leading-[1.15] text-gray-900 mb-4">
              The{" "}
              <span className="font-serif italic font-light text-orange-500">team</span>
            </h2>
            <p className="text-lg text-gray-500">
              A small, focused team obsessed with building the best financial
              planning experience.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                {...fadeUp(0.1 * i)}
                className="text-center group"
              >
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform`}
                >
                  {member.initials}
                </div>
                <h4 className="text-[15px] font-semibold text-gray-900">
                  {member.name}
                </h4>
                <p className="text-sm text-gray-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-20 md:py-28 bg-gray-50" id="contact">
        <div className="container-narrow max-w-2xl text-center">
          <motion.div {...fadeUp(0)}>
            <h2 className="text-3xl md:text-[38px] font-bold tracking-tight leading-[1.15] text-gray-900 mb-4">
              Get in{" "}
              <span className="font-serif italic font-light text-orange-500">touch</span>
            </h2>
            <p className="text-lg text-gray-500 mb-10">
              Have questions, partnership ideas, or just want to say hello?
              We&apos;d love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="mailto:hello@horizon.finance"
                className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all text-gray-700"
              >
                <Mail size={18} className="text-orange-500" />
                <span className="font-medium">hello@horizon.finance</span>
              </a>
              <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700">
                <MapPin size={18} className="text-orange-500" />
                <span className="font-medium">Mumbai, India</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20">
        <div className="container-narrow">
          <motion.div
            {...fadeUp(0)}
            className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-12 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to plan your financial future?
            </h2>
            <p className="text-lg text-orange-100 max-w-lg mx-auto mb-8">
              Join Horizon for free and start building a plan that works.
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
