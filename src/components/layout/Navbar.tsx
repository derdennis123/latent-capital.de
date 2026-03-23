"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

function NewsletterDropdown() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); setStatus("idle"); }}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-black/5 hover:bg-white/80 transition-all text-sm font-medium text-[#1a1a1a] cursor-pointer"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        Newsletter
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 bg-white/90 backdrop-blur-xl rounded-xl border border-black/5 shadow-lg p-4"
          >
            {status === "success" ? (
              <p className="text-sm text-[#1a1a1a] font-medium text-center py-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Erfolgreich abonniert!
              </p>
            ) : (
              <>
                <p className="text-xs text-[#666] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                  Wöchentliches AI-Briefing. Kostenlos.
                </p>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-Mail-Adresse"
                    required
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-black/10 text-sm text-[#1a1a1a] placeholder:text-[#999] outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 transition-all"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-3 py-2 rounded-lg bg-[#6C5CE7] text-white text-sm font-medium hover:bg-[#5A4BD1] transition-colors disabled:opacity-50 cursor-pointer"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {status === "loading" ? "..." : "OK"}
                  </button>
                </form>
                {status === "error" && (
                  <p className="text-xs text-red-500 mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
                    Etwas ist schiefgelaufen.
                  </p>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center text-xs font-bold text-[#6C5CE7] hover:bg-[#6C5CE7]/20 transition-colors cursor-pointer"
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-xl border border-black/5 shadow-lg py-2"
          >
            <div className="px-4 py-2 border-b border-black/5">
              <p className="text-xs text-[#666] truncate" style={{ fontFamily: "Inter, sans-serif" }}>
                {user.email}
              </p>
            </div>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-[#666] hover:text-[#1a1a1a] hover:bg-black/5 transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Mein Konto
            </Link>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-[#666] hover:text-[#1a1a1a] hover:bg-black/5 transition-colors cursor-pointer"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Abmelden
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
            ) : (
              <>
                <NewsletterDropdown />
                {(!user || user.status === "free") && (
                  <Link
                    href="/membership"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#6C5CE7] text-white text-sm font-medium hover:bg-[#5A4BD1] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Premium werden
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                )}
                {user && <UserDropdown />}
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
                <Link
                  href="/newsletter"
                  className="block text-sm text-[#666] hover:text-[#1a1a1a]"
                  onClick={() => setMobileOpen(false)}
                >
                  Newsletter
                </Link>
                {(!user || user.status === "free") && (
                  <Link
                    href="/membership"
                    className="inline-block px-6 py-2.5 rounded-full bg-[#6C5CE7] text-white text-sm font-medium hover:bg-[#5A4BD1] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Premium werden
                  </Link>
                )}
                {user && (
                  <Link
                    href="/account"
                    className="block text-sm text-[#666] hover:text-[#1a1a1a]"
                    onClick={() => setMobileOpen(false)}
                  >
                    Mein Konto
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
