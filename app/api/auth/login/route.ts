import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { registerRedisSession } from "@/src/lib/auth/jwt-guard";
import { isSupabaseConfigured } from "@/src/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const { email, password, totpCode, backupCode } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // 1. Live Supabase Authentication
    if (isSupabaseConfigured) {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      const token = data.session?.access_token || "";
      const userId = data.user.id;

      // Register session in Redis (Task S1-5)
      await registerRedisSession(userId, token);

      return NextResponse.json({
        success: true,
        user: data.user,
        session: data.session,
      });
    }

    // 2. Development / Fallback Mode (Runs if credentials are not yet supplied)
    // Create a deterministic session token for testing and validation
    const mockUserId = `usr_${Buffer.from(email).toString("hex").slice(0, 12)}`;
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(
      JSON.stringify({
        sub: mockUserId,
        email,
        role: "authenticated",
        session_id: `ses_${Date.now()}`,
        exp: Math.floor(Date.now() / 1000) + 86400,
        iat: Math.floor(Date.now() / 1000),
      })
    ).toString("base64url");
    const signature = Buffer.from("mock_signature_for_development").toString("base64url");
    const token = `${header}.${payload}.${signature}`;

    // Register into Redis
    await registerRedisSession(mockUserId, token);

    return NextResponse.json({
      success: true,
      user: {
        id: mockUserId,
        email,
        full_name: email.split("@")[0],
        plan: "free",
      },
      token,
      mode: "fallback_development",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
