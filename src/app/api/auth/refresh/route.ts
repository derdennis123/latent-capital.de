import { NextResponse } from "next/server";
import { getSession, createSession, setSessionCookie } from "@/lib/auth/session";
import { getMemberById } from "@/lib/members/api";

export async function POST() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Re-fetch member from Ghost to get current status
  const member = await getMemberById(session.memberId);

  if (!member) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  // Update session with current Ghost data
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
