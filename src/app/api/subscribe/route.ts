import { NextRequest, NextResponse } from "next/server";
import { subscribeMember } from "@/lib/members/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "E-Mail-Adresse ist erforderlich." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    await subscribeMember(email);

    return NextResponse.json({
      success: true,
      message: "Erfolgreich angemeldet!",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ein Fehler ist aufgetreten.";

    if (message.includes("already exists") || message.includes("duplicate")) {
      return NextResponse.json(
        { error: "Diese E-Mail-Adresse ist bereits registriert." },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
