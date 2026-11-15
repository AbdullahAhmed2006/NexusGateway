import { tone } from "../lib/ui";

/** Stat card with a value and a threshold-coloured progress bar. */
export function BarStat({
  label,
  value,
  limit,
  display,
}: {
  label: string;
  value: number;
  limit: number;
  display: string;
}) {
  const pct = Math.min(100, Math.round((value / limit) * 100));
  return (
    <div className="rounded-xl border border-zinc-800/50 bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-zinc-400">{label}</p>
        <span className="font-mono text-xs text-zinc-500">{pct}%</span>
      </div>
      <p className="mt-4 font-mono text-2xl font-semibold tracking-tight">{display}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${tone(pct).bar}`}
          style={{ width: `${Math.max(pct, 1)}%` }}
        />
      </div>
    </div>
  );
}
