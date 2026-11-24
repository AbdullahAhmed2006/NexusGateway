import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { isSupabaseConfigured } from "@/src/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json();

    // 1. Input Validation (Task S1-3)
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // Password policy: At least 8 characters with at least 1 number
    const passwordRegex = /^(?=.*[0-9]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long and contain at least 1 number." },
        { status: 400 }
      );
    }

    // 2. Supabase Signup Flow (Task S1-4)
    if (isSupabaseConfigured) {
      const supabase = createServerSupabaseClient();
      const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: full_name || email.split("@")[0],
          },
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        user: data.user,
        requiresVerification: !data.session,
        message: data.session
          ? "Account created successfully."
          : "Verification email sent. Please check your inbox to confirm your account.",
      });
    }

    // Fallback development mode
    return NextResponse.json({
      success: true,
      user: {
        id: `usr_${Date.now()}`,
        email,
        full_name: full_name || email.split("@")[0],
      },
      requiresVerification: true,
      message: "Verification email sent (simulated). Please check your email to confirm your account.",
      mode: "fallback_development",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
