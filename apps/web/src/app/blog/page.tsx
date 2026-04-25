"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Navbar from "../../components/landing/Navbar";
import Footer from "../../components/landing/Footer";
import { ArrowRight, Clock } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.22, 0.61, 0.36, 1] },
});

const POSTS = [
  {
    tag: "Guide",
    tagColor: "#3B82F6",
    title: "The Complete Guide to SIP Planning in India (2026 Edition)",
    excerpt:
      "Everything you need to know about systematic investment plans — from choosing the right funds to optimizing your step-up strategy.",
    date: "Apr 20, 2026",
    readTime: "8 min",
  },
  {
    tag: "Product",
    tagColor: "#F97316",
    title: "Introducing Horizon: Financial Planning, Reimagined",
    excerpt:
      "Why we built Horizon, what makes it different from every SIP calculator out there, and where we're heading next.",
    date: "Apr 15, 2026",
    readTime: "5 min",
  },
  {
    tag: "Finance",
    tagColor: "#10B981",
    title: "How Inflation at 7% Silently Destroys Your Retirement Corpus",
    excerpt:
      "Most retirement calculators use 5% inflation. In India, the reality is closer to 7%. Here's what that means for your plan.",
    date: "Apr 10, 2026",
    readTime: "6 min",
  },
  {
    tag: "Tax",
    tagColor: "#8B5CF6",
    title: "Section 80C Beyond ELSS: A Complete Tax-Saving Framework",
    excerpt:
      "EPF, PPF, NPS, ELSS, life insurance premiums — here's how to max out your 80C deductions without sacrificing returns.",
    date: "Apr 5, 2026",
    readTime: "7 min",
  },
  {
    tag: "Strategy",
    tagColor: "#F43F5E",
    title: "The FIRE Movement in India: Realistic or Delusional?",
    excerpt:
      "Financial Independence, Retire Early sounds great. But does it work with Indian salaries, inflation, and healthcare costs?",
    date: "Mar 28, 2026",
    readTime: "10 min",
  },
  {
    tag: "Guide",
    tagColor: "#3B82F6",
    title: "Emergency Fund Calculator: How Much Do You Really Need?",
    excerpt:
      "6 months of expenses is the generic advice. But your number depends on your job type, dependents, and insurance coverage.",
    date: "Mar 20, 2026",
    readTime: "5 min",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/40 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-orange-100/30 blur-[100px]" />

        <div className="relative container-narrow text-center max-w-3xl mx-auto">
          <motion.span {...fadeUp(0)} className="inline-block text-[13px] font-semibold text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-4 py-1 mb-6">
            Blog
          </motion.span>
          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl md:text-[52px] font-bold tracking-tight leading-[1.1] text-gray-900 mb-6"
          >
            Insights for a{" "}
            <span className="font-serif italic font-light text-orange-500">
              smarter
            </span>{" "}
            financial life
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto"
          >
            Guides, strategies, and product updates to help you make better
            financial decisions.
          </motion.p>
        </div>
      </section>

      {/* ── Posts Grid ── */}
      <section className="pb-24 md:pb-32">
        <div className="container-narrow">
          {/* Featured Post */}
          <motion.div
            {...fadeUp(0)}
            className="mb-10"
          >
            <div className="group bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100/50 rounded-2xl p-8 md:p-10 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <span
                    className="inline-block text-xs font-semibold rounded-full px-3 py-1 mb-4"
                    style={{
                      color: POSTS[0].tagColor,
                      background: POSTS[0].tagColor + "15",
                    }}
                  >
                    {POSTS[0].tag}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3 group-hover:text-orange-600 transition-colors">
                    {POSTS[0].title}
                  </h2>
                  <p className="text-[15px] text-gray-500 leading-relaxed mb-4 max-w-xl">
                    {POSTS[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{POSTS[0].date}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {POSTS[0].readTime}
                    </span>
                  </div>
                </div>
                <ArrowRight size={24} className="text-orange-400 group-hover:translate-x-1 transition-transform flex-shrink-0 hidden md:block" />
              </div>
            </div>
          </motion.div>

          {/* Rest of posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POSTS.slice(1).map((post, i) => (
              <motion.article
                key={post.title}
                {...fadeUp(0.08 * i)}
                className="group bg-white border border-gray-100 rounded-2xl p-7 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300 cursor-pointer"
              >
                <span
                  className="inline-block text-xs font-semibold rounded-full px-3 py-1 mb-4"
                  style={{
                    color: post.tagColor,
                    background: post.tagColor + "15",
                  }}
                >
                  {post.tag}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-2 group-hover:text-orange-600 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {post.readTime}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
