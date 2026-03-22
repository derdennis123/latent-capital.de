"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";

interface PaywallProps {
  /** Content to show when access is granted */
  children: React.ReactNode;
  /** Required tier: "free" = any logged-in member, "paid" = paid/comped only */
  requiredTier?: "free" | "paid";
  /** Preview content to show above the paywall (e.g. first paragraphs) */
  preview?: React.ReactNode;
}

export default function Paywall({
  children,
  requiredTier = "paid",
  preview,
}: PaywallProps) {
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
    user &&
    (requiredTier === "free" ||
      user.status === "paid" ||
      user.status === "comped");

  if (hasAccess) {
    return <>{children}</>;
  }

  // Determine which CTA to show
  const isLoggedIn = !!user;
  const needsUpgrade = isLoggedIn && requiredTier === "paid";

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
          <div className="text-3xl mb-4">
            {needsUpgrade ? "\u2728" : "\u{1F512}"}
          </div>
          <h3
            className="text-xl font-bold text-[#1a1a1a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {needsUpgrade
              ? "Premium-Inhalt"
              : "Dieser Artikel ist exklusiv f\u00FCr Mitglieder"}
          </h3>
          <p className="text-[#666] text-sm mb-6">
            {needsUpgrade
              ? "Upgrade auf Premium f\u00FCr Zugang zu allen Inhalten, Playbooks und der Community."
              : "Erstelle ein kostenloses Konto oder melde dich an, um weiterzulesen."}
          </p>

          {needsUpgrade ? (
            <Link
              href="/membership"
              className="inline-block py-3 px-8 rounded-full bg-[#6C5CE7] text-white font-medium text-sm hover:bg-[#5A4BD1] transition-colors"
            >
              Premium werden
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="inline-block py-3 px-8 rounded-full bg-[#6C5CE7] text-white font-medium text-sm hover:bg-[#5A4BD1] transition-colors"
              >
                Kostenlos registrieren
              </Link>
              <p className="text-xs text-[#999]">
                Bereits Mitglied?{" "}
                <Link
                  href="/login"
                  className="text-[#6C5CE7] hover:underline"
                >
                  Anmelden
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
