"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { label: "Product", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
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
              ? "bg-white/70 border-gray-200/80 py-2.5 px-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              : "bg-black/20 border-white/10 py-4 px-8 shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-[30px] h-[30px] rounded-lg bg-[#FF8A3D] flex items-center justify-center relative shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-[14px] h-[14px] bg-white rounded-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
              scrolled ? "text-gray-900" : "text-white"
            }`}>
              Horizon
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-medium transition-colors duration-300 ${
                  scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/login"
              className={`text-[15px] font-medium transition-colors duration-300 ${
                scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"
              }`}
            >
              Login
            </Link>
            <Link
              href="/app"
              className={`px-6 py-2.5 text-[15px] font-semibold text-white rounded-full transition-all hover:-translate-y-[2px] active:scale-[0.97] ${
                scrolled 
                  ? "bg-gray-900 hover:bg-black shadow-lg" 
                  : "bg-[#FF8A3D] hover:bg-[#e67a2e] shadow-[0_10px_20px_rgba(255,138,61,0.3)]"
              }`}
            >
              Get started
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden relative w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-[5px]">
              <span
                className={`w-5 h-[2.5px] rounded-full transition-all origin-center ${
                  scrolled ? "bg-gray-900" : "bg-white"
                } ${mobileOpen ? "rotate-45 translate-y-[7.5px]" : ""}`}
              />
              <span
                className={`w-5 h-[2.5px] rounded-full transition-all ${
                  scrolled ? "bg-gray-900" : "bg-white"
                } ${mobileOpen ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`w-5 h-[2.5px] rounded-full transition-all origin-center ${
                  scrolled ? "bg-gray-900" : "bg-white"
                } ${mobileOpen ? "-rotate-45 -translate-y-[7.5px]" : ""}`}
              />
            </div>
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[80px] z-40 bg-white/95 backdrop-blur-xl md:hidden border border-gray-200 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col p-6 gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                <Link
                  href="/login"
                  className="px-4 py-3 text-center text-lg font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/app"
                  className="px-4 py-3 text-center text-lg font-semibold text-white bg-[#FF8A3D] rounded-full shadow-lg"
                >
                  Get started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
