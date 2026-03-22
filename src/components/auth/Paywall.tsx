"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";

interface PaywallProps {
  /** Content to show when access is granted */
  children: React.ReactNode;
  /** Preview content to show above the paywall (e.g. first paragraphs) */
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
      {/* Preview content with fade */}
      {preview && (
        <div className="relative">
          {preview}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
        </div>
      )}

      {/* Paywall CTA */}
      <div className="relative -mt-8 py-12 text-center">
        <div className="mx-auto max-w-md bg-white/80 backdrop-blur-xl rounded-2xl border border-black/5 shadow-sm p-8">
          <div className="text-3xl mb-4">{"\u{1F512}"}</div>
          <h3
            className="text-xl font-bold text-[#1a1a1a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Premium-Inhalt
          </h3>
          <p
            className="text-[#666] text-sm mb-6"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Dieser Artikel ist exklusiv f&uuml;r Premium-Mitglieder. Werde
            jetzt Mitglied und erhalte Zugang zu allen Deep Dives und Analysen.
          </p>

          <Link
            href="/membership"
            className="inline-block py-3 px-8 rounded-full bg-[#6C5CE7] text-white font-medium text-sm hover:bg-[#5A4BD1] transition-colors"
          >
            Premium werden &mdash; ab &euro;19/Monat
          </Link>

          {user && (
            <p
              className="text-xs text-[#999] mt-4"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Bereits eingeloggt als {user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
