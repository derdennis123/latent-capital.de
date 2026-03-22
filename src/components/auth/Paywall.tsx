"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";

interface PaywallProps {
  /** Full content to show when access is granted */
  children: React.ReactNode;
  /** Preview/teaser content shown above the paywall */
  preview?: React.ReactNode;
}

export default function Paywall({ children, preview }: PaywallProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-12">
        {preview}
        <div className="animate-pulse mt-8 space-y-4">
          <div className="h-4 bg-black/5 rounded w-3/4" />
          <div className="h-4 bg-black/5 rounded w-1/2" />
          <div className="h-4 bg-black/5 rounded w-5/6" />
        </div>
      </div>
    );
  }

  const hasAccess =
    user && (user.status === "paid" || user.status === "comped");

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Preview content — fully visible */}
      {preview && (
        <div className="ghost-content max-w-none">
          {preview}
        </div>
      )}

      {/* Blur fade overlay — transition from readable to blurred */}
      <div className="relative h-64 -mt-4 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {/* Gradient mask that fades content out */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(250,250,250,0.3) 30%, rgba(250,250,250,0.7) 60%, rgba(250,250,250,0.95) 100%)",
          }}
        />
        {/* Blur layers — increasing blur from top to bottom */}
        <div
          className="absolute inset-x-0 top-0 h-1/3"
          style={{ backdropFilter: "blur(1px)", WebkitBackdropFilter: "blur(1px)" }}
        />
        <div
          className="absolute inset-x-0 top-1/3 h-1/3"
          style={{ backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
        />
        <div
          className="absolute inset-x-0 top-2/3 h-1/3"
          style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        />
      </div>

      {/* Paywall CTA Card */}
      <div className="relative -mt-12 pb-8 text-center">
        <div className="mx-auto max-w-lg bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(108,92,231,0.08)] p-10">
          <h3
            className="text-2xl font-bold text-[#1a1a1a] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Dieser Artikel ist exklusiv f&uuml;r Premium-Leser
          </h3>
          <p
            className="text-[#666] text-sm leading-relaxed mb-8"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Erhalte Zugang zu allen Deep Dives, exklusiven Interviews
            und datengetriebenen Analysen aus dem deutschen AI-&Ouml;kosystem.
          </p>

          {/* Pricing */}
          <p
            className="text-sm text-[#444] font-medium mb-6"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            &euro;29/Monat oder &euro;249/Jahr
          </p>

          <Link
            href="/membership"
            className="inline-flex items-center gap-2 py-3.5 px-10 rounded-full bg-[#6C5CE7] text-white font-medium text-sm hover:bg-[#5A4BD1] transition-colors shadow-lg shadow-[#6C5CE7]/20"
          >
            Premium werden
            <span aria-hidden="true">&rarr;</span>
          </Link>

          {user ? (
            <p
              className="text-xs text-[#999] mt-5"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Eingeloggt als {user.email} &mdash;{" "}
              <Link href="/membership" className="text-[#6C5CE7] hover:underline">
                Upgrade auf Premium
              </Link>
            </p>
          ) : (
            <p
              className="text-xs text-[#999] mt-5"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Bereits Mitglied?{" "}
              <Link href="/login" className="text-[#6C5CE7] hover:underline">
                Anmelden
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
