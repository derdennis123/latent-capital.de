import { NextResponse } from "next/server";
import { getSession, createSession, setSessionCookie } from "@/lib/auth/session";
import { getMemberById } from "@/lib/members/api";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Re-check Ghost for latest member status to catch upgrades/downgrades
  try {
    const member = await getMemberById(session.memberId);
    if (member && member.status !== session.status) {
      // Status changed — update session cookie
      const newToken = await createSession({
        memberId: member.id,
        email: member.email,
        name: member.name ?? undefined,
        status: member.status,
      });
      await setSessionCookie(newToken);

      return NextResponse.json({
        user: {
          memberId: member.id,
          email: member.email,
          name: member.name,
          status: member.status,
        },
      });
    }
  } catch {
    // If Ghost is unreachable, fall back to cached session data
  }

  return NextResponse.json({
    user: {
      memberId: session.memberId,
      email: session.email,
      name: session.name,
      status: session.status,
    },
  });
}
