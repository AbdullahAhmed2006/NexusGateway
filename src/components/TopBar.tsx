import { Menu } from "lucide-react";
import type { Stage, View } from "../lib/types";

type TopBarProps = {
  title: string;
  stage: Stage;
  onOpenSidebar: () => void;
  onNavigate: (view: View) => void;
};

/** Page header with the mobile menu button and the live "Multi-agent active" pill. */
export function TopBar({ title, stage, onOpenSidebar, onNavigate }: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-900 px-4 lg:px-6">
      <button
        aria-label="Open sidebar"
        onClick={() => onOpenSidebar()}
        className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-900 lg:hidden"
      >
        <Menu size={18} />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-sm font-medium">{title}</h1>
      {stage !== 0 && (
        <button
          onClick={() => onNavigate("workspace")}
          className="flex shrink-0 items-center gap-2 rounded-full border border-zinc-800/50 bg-surface px-3 py-1 text-xs text-zinc-400 hover:border-zinc-700"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
          Multi-agent active
        </button>
      )}
    </header>
  );
}
