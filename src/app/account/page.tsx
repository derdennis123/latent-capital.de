"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <Container className="py-20">
        <div className="mx-auto max-w-lg">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-black/5 rounded w-48 mx-auto" />
            <div className="h-48 bg-black/5 rounded-2xl" />
          </div>
        </div>
      </Container>
    );
  }

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    router.push("/");
  }

  const tierLabel =
    user.status === "paid"
      ? "Premium"
      : user.status === "comped"
        ? "Premium (Comp)"
        : "Free";

  const tierColor =
    user.status === "paid" || user.status === "comped"
      ? "text-[#6C5CE7] bg-[#6C5CE7]/10"
      : "text-[#666] bg-black/5";

  return (
    <Container className="py-20">
      <div className="mx-auto max-w-lg">
        <h1
          className="text-3xl font-bold text-[#1a1a1a] mb-8 text-center"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Mein Konto
        </h1>

        <GlassCard className="p-8">
          {/* Avatar / Initial */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-[#6C5CE7]">
                {(user.name || user.email)[0].toUpperCase()}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-black/5">
              <span className="text-sm text-[#666]">E-Mail</span>
              <span className="text-sm font-medium text-[#1a1a1a]">
                {user.email}
              </span>
            </div>

            {user.name && (
              <div className="flex items-center justify-between py-3 border-b border-black/5">
                <span className="text-sm text-[#666]">Name</span>
                <span className="text-sm font-medium text-[#1a1a1a]">
                  {user.name}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-3 border-b border-black/5">
              <span className="text-sm text-[#666]">Mitgliedschaft</span>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${tierColor}`}
              >
                {tierLabel}
              </span>
            </div>
          </div>

          {/* Upgrade CTA for free members */}
          {user.status === "free" && (
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-[#6C5CE7]/5 to-[#a29bfe]/5 border border-[#6C5CE7]/10">
              <h3 className="font-semibold text-[#1a1a1a] mb-1">
                Upgrade auf Premium
              </h3>
              <p className="text-sm text-[#666] mb-4">
                Erhalte Zugang zu exklusiven Playbooks, erweiterten Analysen und
                der Member-Community.
              </p>
              <a
                href="/membership"
                className="inline-block py-2.5 px-6 rounded-full bg-[#6C5CE7] text-white font-medium text-sm hover:bg-[#5A4BD1] transition-colors"
              >
                Premium werden &mdash; ab &euro;29/Monat
              </a>
            </div>
          )}

          {/* Logout */}
          <div className="mt-8 pt-6 border-t border-black/5">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full py-3 px-4 rounded-full border border-black/10 text-sm font-medium text-[#666] hover:text-[#1a1a1a] hover:bg-black/5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loggingOut ? "Wird abgemeldet..." : "Abmelden"}
            </button>
          </div>
        </GlassCard>
      </div>
    </Container>
  );
}
