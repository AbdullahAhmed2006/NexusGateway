import { useState } from "react";
import type { FormEvent } from "react";
import { ChevronDown, Eye, EyeOff, Loader, Mail, Moon } from "lucide-react";
import { GitHubIcon, GoogleIcon } from "../components/BrandIcons";
import { Logo } from "../components/Logo";
import { useTimers } from "../hooks/useTimers";
import { inputClass, oauthClass } from "../lib/ui";

type LoginViewProps = {
  email: string;
  onEmailChange: (email: string) => void;
  onSignIn: () => void;
};

export function LoginView({ email, onEmailChange, onSignIn }: LoginViewProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailExpanded, setEmailExpanded] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const { schedule } = useTimers();

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
    <div className="min-h-screen bg-canvas text-zinc-100 font-sans antialiased flex flex-col justify-between">
      {/* ── Top Header ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-900 px-6">
        <div className="flex items-center gap-2.5">
          <Logo size={22} />
          <span className="text-sm font-semibold text-zinc-100">Nexus Gateway</span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400">
            v2.4
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs text-zinc-400">
          <button className="hidden hover:text-zinc-200 transition sm:block">Documentation</button>
          <button className="hidden hover:text-zinc-200 transition sm:block">System Status</button>
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-zinc-300">Gateway Operational</span>
          </span>
          <button
            aria-label="Toggle theme"
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition"
          >
            <Moon size={15} />
          </button>
        </div>
      </header>

      {/* ── Center Content ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-60"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18), rgba(99,102,241,0) 70%)" }}
        />

        <div className="relative w-full max-w-[420px]">
          {/* Logo & Headline */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-lg">
              <Logo size={32} />
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-zinc-100">Nexus Gateway</h1>
            <p className="mt-1 text-sm text-zinc-400">Unified intelligence for every task.</p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-2xl shadow-black/50">
            {/* Tab switch */}
            <div className="mb-5 flex rounded-xl border border-zinc-800/70 bg-zinc-950/80 p-1">
              {(["signin", "signup"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAuthMode(mode)}
                  className={`flex-1 rounded-lg py-2 text-[13px] font-medium transition duration-150 ${
                    authMode === mode ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {mode === "signin" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-2.5">
              <button type="button" onClick={() => signIn()} className={oauthClass}>
                <GoogleIcon />
                Continue with Google
              </button>
              <button type="button" onClick={() => signIn()} className={oauthClass}>
                <GitHubIcon />
                Continue with GitHub
              </button>
            </div>

            {/* Continue with Email Accordion */}
            <div className="mt-3.5">
              <button
                type="button"
                onClick={() => setEmailExpanded((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-zinc-400" />
                  <span>Continue with Email</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-zinc-500 transition-transform duration-200 ${emailExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {emailExpanded && (
                <form onSubmit={signIn} className="mt-3.5 space-y-3.5">
                  {signup && (
                    <div>
                      <label htmlFor="name" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Full Name
                      </label>
                      <input
                        id="name"
                        autoComplete="name"
                        placeholder="Huzaifa"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Work or Personal Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder={signup ? "you@company.com" : "elena.rostova@nexus.ai"}
                      value={email}
                      onChange={(e) => onEmailChange(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Password
                      </label>
                      {!signup && (
                        <button type="button" className="text-[11px] text-indigo-400 hover:text-indigo-300 transition">
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={signup ? "new-password" : "current-password"}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-500">Must be at least 8 characters with 1 number</p>
                  </div>

                  <button
                    type="submit"
                    disabled={signingIn}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition duration-150 hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-70"
                  >
                    {signingIn ? <Loader size={16} className="animate-spin" /> : null}
                    {signup ? "Create Nexus Account →" : "Sign in to Nexus Workspace →"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Trust Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-500">Protected by enterprise encryption &amp; zero data retention guarantees.</p>
            <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-zinc-600">
              <button className="hover:text-zinc-400 transition">Terms of Service</button>
              <span>·</span>
              <button className="hover:text-zinc-400 transition">Privacy Policy</button>
              <span>·</span>
              <button className="hover:text-zinc-400 transition">Security Audit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
