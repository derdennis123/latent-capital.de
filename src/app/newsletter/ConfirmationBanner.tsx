"use client";

import { useSearchParams } from "next/navigation";

export default function ConfirmationBanner() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");

  if (status === "confirmed") {
    return (
      <div className="mb-8 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm text-center">
        Deine Anmeldung wurde bestätigt! Du erhältst ab jetzt unseren
        wöchentlichen Newsletter.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm text-center">
        {message === "expired"
          ? "Dieser Bestätigungslink ist abgelaufen. Bitte melde dich erneut an."
          : "Der Bestätigungslink ist ungültig. Bitte melde dich erneut an."}
      </div>
    );
  }

  return null;
}
