import { Menu } from "lucide-react";
import type { Plan, Stage, View } from "../lib/types";

type TopBarProps = {
  title: string;
  stage: Stage;
  plan: Plan;
  email: string;
  onOpenSidebar: () => void;
  onNavigate: (view: View) => void;
};

export function TopBar({ title, stage, plan, email, onOpenSidebar, onNavigate }: TopBarProps) {
  const initial = (email.trim()[0] || "U").toUpperCase();
  
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-900 px-4 lg:px-6">
      <button
        aria-label="Open sidebar"
        onClick={() => onOpenSidebar()}
        className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-900 lg:hidden"
      >
        <Menu size={18} />
      </button>
      
      {/* Breadcrumb */}
      <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
        <span className="hidden shrink-0 text-zinc-500 sm:block">Nexus Gateway</span>
        <span className="hidden text-zinc-700 sm:block">/</span>
        <span className="truncate font-medium text-zinc-200">{title}</span>
      </div>

      {/* Center: session pill */}
      {stage !== 0 && (
        <button
          onClick={() => onNavigate("workspace")}
          className="hidden shrink-0 items-center gap-2 rounded-full border border-zinc-800/50 bg-surface px-3 py-1 text-xs text-zinc-400 hover:border-zinc-700 sm:flex"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
          Multi-agent active
        </button>
      )}

      {/* Right side */}
      <div className="flex shrink-0 items-center gap-3">
        {/* Plan badge */}
        <span className={`hidden rounded-full border px-2.5 py-0.5 text-[11px] font-medium sm:block ${
          plan === "pro"
            ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
            : "border-zinc-700 bg-zinc-900 text-zinc-400"
        }`}>
          {plan === "pro" ? "Pro Tier" : "Free Tier"}
        </span>

        {/* Active Memory indicator */}
        <span className="hidden items-center gap-1.5 text-xs text-zinc-500 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Active Memory (64%)
        </span>

        {/* User avatar */}
        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white ${
          plan === "pro" ? "bg-indigo-600" : "bg-zinc-700"
        }`}>
          {initial}
        </div>
      </div>
    </header>
  );
}
