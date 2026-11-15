import { BarStat } from "../components/BarStat";
import { MODEL_USAGE, PLANS } from "../lib/data";
import type { Plan, Range } from "../lib/types";
import { fmtTokens } from "../lib/ui";

type AnalyticsViewProps = {
  plan: Plan;
  onPlanChange: (plan: Plan) => void;
  range: Range;
  onRangeChange: (range: Range) => void;
  /** Requests used today, already capped at the plan limit. */
  used: number;
  /** Completed prompts this session; each one adds to the token and per-model figures. */
  runs: number;
};

/** Token and tier dashboard: limit bars, plan comparison, and requests by model. */
export function AnalyticsView({ plan, onPlanChange, range, onRangeChange, used, runs }: AnalyticsViewProps) {
  const limits = PLANS[plan];
  const tokensUsed = 380_000 + runs * 4_200;

  const modelRows = MODEL_USAGE[range].map((row) =>
    range === "24h" && (row.name === "DeepSeek-V3" || row.name === "FLUX.1")
      ? { ...row, value: row.value + runs }
      : row,
  );
  const modelMax = Math.max(...modelRows.map((r) => r.value));
  const modelTotal = modelRows.reduce((sum, r) => sum + r.value, 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-8 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.01em]">Usage and limits</h2>
            <p className="mt-1 text-sm text-zinc-500">Daily limits reset at 00:00 UTC. Figures are sample data.</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex rounded-lg border border-zinc-800/50 bg-surface p-0.5"
              role="tablist"
              aria-label="Plan"
            >
              {(["free", "pro"] as Plan[]).map((p) => (
                <button
                  key={p}
                  role="tab"
                  aria-selected={plan === p}
                  onClick={() => onPlanChange(p)}
                  className={`h-8 rounded-md px-3.5 text-[13px] font-medium transition duration-150 ${
                    plan === p ? "bg-zinc-800 text-zinc-50" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {PLANS[p].label}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPlanChange(plan === "free" ? "pro" : "free")}
              className={`h-9 rounded-lg px-4 text-[13px] font-medium transition duration-150 active:scale-[0.98] ${
                plan === "free"
                  ? "bg-zinc-100 text-black hover:bg-white"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700"
              }`}
            >
              {plan === "free" ? "Upgrade to Pro" : "Switch to Free"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <BarStat
            label="Flash model, per minute"
            value={9}
            limit={limits.flashRpm}
            display={`9 / ${limits.flashRpm} RPM`}
          />
          <BarStat label="Pro model, per minute" value={1} limit={limits.proRpm} display={`1 / ${limits.proRpm} RPM`} />
          <BarStat
            label="Requests today"
            value={used}
            limit={limits.rpd}
            display={`${used} / ${limits.rpd.toLocaleString()}`}
          />
          <BarStat
            label="Tokens vs budget"
            value={tokensUsed}
            limit={limits.tokens}
            display={`${fmtTokens(tokensUsed)} / ${fmtTokens(limits.tokens)}`}
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {/* Tier comparison */}
          <div className="rounded-xl border border-zinc-800/50 bg-surface p-5">
            <h3 className="text-sm font-medium">Free vs Pro</h3>
            <table className="mt-4 w-full text-[13px]">
              <thead>
                <tr className="border-b border-zinc-800 text-left">
                  <th className="pb-2.5 font-normal text-zinc-600">Limit</th>
                  {(["free", "pro"] as Plan[]).map((p) => (
                    <th
                      key={p}
                      className={`pb-2.5 text-right font-medium ${plan === p ? "text-zinc-50" : "text-zinc-500"}`}
                    >
                      {PLANS[p].label}
                      {plan === p && (
                        <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 align-middle" />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Flash model RPM", "15", "120"],
                  ["Pro model RPM", "2", "30"],
                  ["Requests per day", "200", "10,000"],
                  ["Token budget per day", "1M", "50M"],
                  ["Parallel agents", "2", "8"],
                  ["Two-factor sign-in", "No", "Yes"],
                ].map(([label, free, pro]) => (
                  <tr key={label} className="border-b border-zinc-900 last:border-0">
                    <td className="py-2.5 text-zinc-400">{label}</td>
                    <td className={`py-2.5 text-right font-mono ${plan === "free" ? "text-zinc-50" : "text-zinc-500"}`}>
                      {free}
                    </td>
                    <td className={`py-2.5 text-right font-mono ${plan === "pro" ? "text-zinc-50" : "text-zinc-500"}`}>
                      {pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Requests by model */}
          <div className="rounded-xl border border-zinc-800/50 bg-surface p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Requests by model</h3>
              <div className="flex rounded-lg border border-zinc-800 p-0.5" role="tablist" aria-label="Time range">
                {(["24h", "7d", "30d"] as Range[]).map((r) => (
                  <button
                    key={r}
                    role="tab"
                    aria-selected={range === r}
                    onClick={() => onRangeChange(r)}
                    className={`h-7 rounded-md px-2.5 font-mono text-xs transition duration-150 ${
                      range === r ? "bg-zinc-800 text-zinc-50" : "text-zinc-500 hover:text-zinc-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {modelRows.map((row) => (
                <div key={row.name}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-zinc-300">{row.name}</span>
                    <span className="font-mono text-zinc-400">{row.value.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${row.color}`}
                      style={{ width: `${(row.value / modelMax) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4 text-[13px]">
              <span className="text-zinc-500">Total requests</span>
              <span className="font-mono font-medium">{modelTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
