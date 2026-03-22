"use client";

import { useState, FormEvent } from "react";
import Button from "@/components/ui/Button";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Etwas ist schiefgelaufen.");
      }

      const data = await res.json();
      setStatus("success");
      setMessage(data.message || "Bitte überprüfe dein Postfach und bestätige deine Anmeldung.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Etwas ist schiefgelaufen."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-black/5 p-6 text-center">
        <p
          className="text-[#1a1a1a] font-medium"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Deine E-Mail-Adresse"
        required
        className="flex-1 px-5 py-3 rounded-full bg-white/60 backdrop-blur-md border border-black/5 text-sm text-[#1a1a1a] placeholder:text-[#999] outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 transition-all"
        style={{ fontFamily: "Inter, sans-serif" }}
      />
      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={status === "loading"}
      >
        {status === "loading" ? "..." : "Abonnieren"}
      </Button>
      {status === "error" && (
        <p
          className="text-xs text-red-500 sm:absolute sm:bottom-0 sm:translate-y-full sm:pt-1"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
