import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { revokeRedisSession } from "@/src/lib/auth/jwt-guard";
import { isSupabaseConfigured } from "@/src/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const { userId } = await request.json().catch(() => ({ userId: "" }));

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();
      await revokeRedisSession(userId || "anonymous", token);
    }

    if (isSupabaseConfigured) {
      const supabase = createServerSupabaseClient();
      await supabase.auth.signOut();
    }

    return NextResponse.json({ success: true, message: "Logged out and session revoked." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
