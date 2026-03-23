import { NextRequest, NextResponse } from "next/server";
import { getMemberByUuid, unsubscribeMember } from "@/lib/members/api";

export async function POST(request: NextRequest) {
  try {
    const { uuid, mode } = (await request.json()) as {
      uuid: string;
      mode: "all" | "newsletter";
    };

    if (!uuid || !mode) {
      return NextResponse.json(
        { error: "uuid and mode are required" },
        { status: 400 }
      );
    }

    const member = await getMemberByUuid(uuid);

    if (!member) {
      return NextResponse.json(
        { error: "member_not_found" },
        { status: 404 }
      );
    }

    if (mode === "all") {
      // Unsubscribe from all newsletters
      await unsubscribeMember(member.id, []);
    } else {
      // Unsubscribe from the first/default newsletter only
      // Keep other newsletters if any
      const remaining = member.newsletters.slice(1);
      await unsubscribeMember(member.id, remaining);
    }

    return NextResponse.json({ success: true, email: member.email });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: "server_error" },
      { status: 500 }
    );
  }
}
