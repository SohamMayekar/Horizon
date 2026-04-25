"use client";

import { motion } from "motion/react";
import Navbar from "../../components/landing/Navbar";
import Footer from "../../components/landing/Footer";
import { Check, ArrowRight, Sparkles, Zap, Building } from "lucide-react";
import Link from "next/link";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] },
});

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "For individuals getting started with financial planning.",
    icon: Sparkles,
    color: "#6B7280",
    bg: "bg-white",
    border: "border-gray-200",
    cta: "Get started",
    ctaStyle:
      "bg-gray-900 hover:bg-gray-800 text-white",
    popular: false,
    features: [
      "60-year projection engine",
      "5 milestones on timeline",
      "Basic insights & suggestions",
      "Indian tax slab modeling",
      "100% browser-based privacy",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "For serious planners who want the full picture.",
    icon: Zap,
    color: "#F97316",
    bg: "bg-orange-500",
    border: "border-orange-400",
    cta: "Start 14-day trial",
    ctaStyle:
      "bg-white hover:bg-orange-50 text-orange-600",
    popular: true,
    features: [
      "Everything in Free",
      "Unlimited milestones",
      "AI-powered scenario analysis",
      "Side-by-side plan comparison",
      "Advanced tax optimization (ELSS, NPS, HRA)",
      "Export PDF reports",
      "Priority support",
      "Family plan (up to 4 members)",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For wealth advisors and financial planning firms.",
    icon: Building,
    color: "#8B5CF6",
    bg: "bg-white",
    border: "border-gray-200",
    cta: "Contact sales",
    ctaStyle:
      "bg-gray-900 hover:bg-gray-800 text-white",
    popular: false,
    features: [
      "Everything in Pro",
      "White-label dashboards",
      "Client management portal",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA & compliance support",
    ],
  },
];

const FAQ = [
  {
    q: "Can I really use Horizon for free?",
    a: "Absolutely. The Free plan gives you full access to the simulation engine, 5 milestones, and Indian tax modeling — forever. No credit card needed.",
  },
  {
    q: "Is my financial data safe?",
    a: "Yes. All calculations run 100% in your browser. We never see, store, or transmit your financial data. There's no server to breach because there's no server.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major Indian payment methods through Razorpay — UPI, debit/credit cards, net banking, and wallets.",
  },
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Yes, cancel anytime with one click. No questions asked, no hidden cancellation fees. Your data stays in your browser regardless.",
  },
  {
    q: "Do you offer a student discount?",
    a: "Yes! Students with a valid .edu email get 50% off Pro. Email us at students@horizon.finance with your university email.",
  },
  {
    q: "What's the difference between Free and Pro AI insights?",
    a: "Free gets rule-based suggestions (e.g., 'increase SIP by ₹2K'). Pro gets GPT-powered scenario analysis that can answer questions like 'What if I take a career break for 2 years?'",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/40 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-orange-100/30 blur-[100px]" />

        <div className="relative container-narrow text-center max-w-3xl mx-auto">
          <motion.span {...fadeUp(0)} className="inline-block text-[13px] font-semibold text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-4 py-1 mb-6">
            Pricing
          </motion.span>
          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl md:text-[52px] font-bold tracking-tight leading-[1.1] text-gray-900 mb-6"
          >
            Simple pricing,{" "}
            <span className="font-serif italic font-light text-orange-500">
              no surprises
            </span>
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto"
          >
            Start free, upgrade when you need more. Every plan includes
            our core simulation engine and Indian-context modeling.
          </motion.p>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="pb-24 md:pb-32">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                {...fadeUp(0.1 * i)}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? "bg-orange-500 text-white shadow-2xl shadow-orange-500/20 scale-[1.03] md:scale-105 z-10"
                    : "bg-white border border-gray-200 hover:shadow-lg hover:shadow-gray-100/80"
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <plan.icon
                      size={20}
                      className={plan.popular ? "text-orange-200" : ""}
                      style={!plan.popular ? { color: plan.color } : {}}
                    />
                    <h3
                      className={`text-lg font-semibold ${
                        plan.popular ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {plan.name}
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span
                      className={`text-4xl font-bold tracking-tight ${
                        plan.popular ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        className={`text-sm ${
                          plan.popular ? "text-orange-200" : "text-gray-400"
                        }`}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      plan.popular ? "text-orange-100" : "text-gray-500"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <Link
                  href="/signup"
                  className={`w-full text-center py-3 rounded-full text-[15px] font-semibold transition-all active:scale-[0.97] mb-7 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>

                <ul className="flex flex-col gap-3 mt-auto">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <Check
                        size={16}
                        className={`flex-shrink-0 mt-0.5 ${
                          plan.popular ? "text-orange-200" : "text-green-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.popular ? "text-orange-50" : "text-gray-600"
                        }`}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container-narrow max-w-3xl">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <h2 className="text-3xl md:text-[38px] font-bold tracking-tight leading-[1.15] text-gray-900 mb-4">
              Frequently asked{" "}
              <span className="font-serif italic font-light text-orange-500">
                questions
              </span>
            </h2>
          </motion.div>
          <div className="flex flex-col gap-4">
            {FAQ.map((item, i) => (
              <motion.details
                key={i}
                {...fadeUp(0.05 * i)}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all"
              >
                <summary className="flex items-center justify-between px-7 py-5 cursor-pointer list-none">
                  <span className="text-[16px] font-semibold text-gray-900 pr-4">
                    {item.q}
                  </span>
                  <span className="text-gray-400 flex-shrink-0 transition-transform group-open:rotate-45 text-xl leading-none">
                    +
                  </span>
                </summary>
                <div className="px-7 pb-5">
                  <p className="text-[15px] text-gray-500 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </motion.details>
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
              Start planning for free
            </h2>
            <p className="text-lg text-orange-100 max-w-lg mx-auto mb-8">
              No credit card. No data stored. Just a better way to plan
              your financial life.
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
