"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  cadence: "month" | "year";
  className?: string;
  children: React.ReactNode;
}

export default function CheckoutButton({
  cadence,
  className = "",
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cadence }),
      });

      if (!res.ok) {
        throw new Error("Checkout failed");
      }

      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch {
      setLoading(false);
      alert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
    >
      {loading ? "Wird geladen..." : children}
    </button>
  );
}
