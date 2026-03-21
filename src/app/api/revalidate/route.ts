import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));

    // If the webhook payload contains a post slug, revalidate that specific path
    const slug = body?.post?.current?.slug;
    if (slug) {
      revalidatePath(`/deep-dives/${slug}`);
      revalidatePath(`/startups/${slug}`);
      revalidatePath(`/interviews/${slug}`);
    }

    // Always revalidate listing pages
    revalidatePath("/", "layout");
    revalidatePath("/deep-dives");
    revalidatePath("/startups");
    revalidatePath("/interviews");
    revalidatePath("/themen");
    revalidatePath("/newsletter");

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    });
  } catch {
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 }
    );
  }
}
