import { useState } from "react";
import type { FormEvent } from "react";
import { Loader } from "lucide-react";
import { GitHubIcon, GoogleIcon } from "../components/BrandIcons";
import { Logo } from "../components/Logo";
import { useTimers } from "../hooks/useTimers";
import { inputClass, oauthClass } from "../lib/ui";

type LoginViewProps = {
  email: string;
  onEmailChange: (email: string) => void;
  onSignIn: () => void;
};

/** Auth screen: centred frosted card with OAuth buttons and an email and password form. */
export function LoginView({ email, onEmailChange, onSignIn }: LoginViewProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [resetNote, setResetNote] = useState(false);
  const { schedule } = useTimers();

  // Prototype sign-in: no credentials are checked.
  const signIn = (e?: FormEvent) => {
    e?.preventDefault();
    if (signingIn) return;
    setSigningIn(true);
    schedule(() => {
      setSigningIn(false);
      onSignIn();
    }, 500);
  };

  const signup = authMode === "signup";

  return (
    <div className="min-h-screen bg-canvas text-zinc-100 flex font-sans relative items-center justify-center overflow-hidden px-6 py-12 antialiased">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.16), rgba(99,102,241,0) 70%)" }}
      />

      <div className="relative w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size={56} />
          <p className="mt-4 text-sm font-medium text-zinc-100">Nexus Gateway</p>
          <p className="mt-1 text-xs text-zinc-400">One endpoint. Every model.</p>
        </div>

        <div
          className="rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          style={{ backgroundColor: "rgba(24,24,27,0.4)" }}
        >
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-zinc-100">
            {signup ? "Create your account" : "Welcome to Nexus"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {signup ? "Start routing in under a minute" : "Sign in to your gateway"}
          </p>

          <div className="mt-7 space-y-3">
            <button type="button" onClick={() => signIn()} className={oauthClass}>
              <GoogleIcon />
              Continue with Google
            </button>
            <button type="button" onClick={() => signIn()} className={oauthClass}>
              <GitHubIcon />
              Continue with GitHub
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-500">or</span>
            <span className="h-px flex-1 bg-zinc-800" />
          </div>

          <form onSubmit={signIn} className="space-y-4">
            {signup && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-[13px] font-medium text-zinc-400">
                  Name
                </label>
                <input
                  id="name"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-zinc-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="dev@acme.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-[13px] font-medium text-zinc-400">
                  Password
                </label>
                {!signup && (
                  <button
                    type="button"
                    onClick={() => setResetNote((v) => !v)}
                    className="text-[13px] font-medium text-zinc-300 hover:text-white"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                autoComplete={signup ? "new-password" : "current-password"}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
              {resetNote && !signup && (
                <p className="mt-2 text-xs text-zinc-500">
                  Password reset isn't wired up in this prototype. Any details will sign you in.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="!mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 text-sm font-medium text-black transition duration-150 hover:bg-white active:scale-[0.98]"
            >
              {signingIn ? <Loader size={16} className="animate-spin" /> : signup ? "Create account" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-zinc-500">
            {signup ? "Already have an account?" : "New to Nexus?"}{" "}
            <button
              type="button"
              onClick={() => {
                setAuthMode(signup ? "signin" : "signup");
                setResetNote(false);
              }}
              className="font-medium text-zinc-200 hover:text-white"
            >
              {signup ? "Sign in" : "Create account"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">Terms · Privacy · Status</p>
      </div>
    </div>
  );
}
