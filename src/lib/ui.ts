/** Shared class strings and small formatting helpers. */

export const tone = (pct: number) =>
  pct >= 90
    ? { bar: "bg-red-500", stroke: "#ef4444" }
    : pct >= 70
      ? { bar: "bg-amber-500", stroke: "#f59e0b" }
      : { bar: "bg-indigo-500", stroke: "#6366f1" };

export const fmtTokens = (n: number) =>
  n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(2)}M` : `${Math.round(n / 1000)}k`;

export const inputClass =
  "h-11 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white placeholder:text-zinc-600 " +
  "outline-none transition duration-150 hover:border-zinc-700 " +
  "focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/25";

export const oauthClass =
  "flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-sm font-medium text-zinc-200 " +
  "transition duration-150 hover:border-zinc-700 hover:bg-zinc-800 active:scale-[0.98]";
