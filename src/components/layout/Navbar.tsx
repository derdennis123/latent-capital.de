"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

const navLinks = [
  {
    label: "CURATED",
    href: "#",
    dropdown: [
      { label: "Startups", href: "/startups" },
      { label: "Interviews", href: "/interviews" },
    ],
  },
  { label: "INSIGHTS", href: "/deep-dives" },
  { label: "LIBRARY", href: "/themen" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[#6C5CE7] text-xl leading-none">&#9638;</span>
            <span
              className="text-sm font-bold tracking-[0.2em] text-[#1a1a1a]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              LATENT CAPITAL
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() =>
                  link.dropdown ? setDropdownOpen(link.label) : undefined
                }
                onMouseLeave={() => setDropdownOpen(null)}
              >
                {link.dropdown ? (
                  <button
                    className="text-xs font-medium tracking-[0.15em] text-[#666] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-xs font-medium tracking-[0.15em] text-[#666] hover:text-[#1a1a1a] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown */}
                {link.dropdown && dropdownOpen === link.label && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-black/5 shadow-lg py-2 min-w-[160px]">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-[#666] hover:text-[#1a1a1a] hover:bg-black/5 transition-colors"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side — auth-aware */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-8 rounded-full bg-black/5 animate-pulse" />
            ) : user ? (
              <Link
                href="/account"
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-black/5 hover:bg-white/80 transition-all text-sm font-medium text-[#1a1a1a]"
              >
                <span className="w-6 h-6 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center text-xs font-bold text-[#6C5CE7]">
                  {(user.name || user.email)[0].toUpperCase()}
                </span>
                Konto
              </Link>
            ) : (
              <>
                <Button variant="ghost" size="sm" href="/login">
                  Login
                </Button>
                <Button variant="secondary" size="sm" href="/subscribe">
                  Subscribe
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-[#1a1a1a] transition-transform duration-200 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#1a1a1a] transition-opacity duration-200 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#1a1a1a] transition-transform duration-200 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-t border-black/5 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label} className="space-y-2">
                    <span
                      className="block text-xs font-medium tracking-[0.15em] text-[#666]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {link.label}
                    </span>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block pl-4 py-1 text-sm text-[#666] hover:text-[#1a1a1a]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-xs font-medium tracking-[0.15em] text-[#666] hover:text-[#1a1a1a]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-4 space-y-3">
                {user ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    href="/account"
                  >
                    Mein Konto
                  </Button>
                ) : (
                  <>
                    <Button variant="primary" size="sm" href="/login">
                      Anmelden
                    </Button>
                    <Button variant="secondary" size="sm" href="/subscribe">
                      Subscribe
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
