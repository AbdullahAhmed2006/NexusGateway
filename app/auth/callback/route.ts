import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Sync OAuth profile metadata if needed
      const metadata = data.user.user_metadata || {};
      const fullName = metadata.full_name || metadata.name || data.user.email?.split("@")[0];
      const avatarUrl = metadata.avatar_url || metadata.picture || null;

      try {
        await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          });
      } catch {
        // Fallback or ignore if table migration has not been run
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/?auth_error=could_not_authenticate`);
}
