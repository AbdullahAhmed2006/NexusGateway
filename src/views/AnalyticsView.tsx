"use client";

import { useState } from "react";
import { ArrowDown, Check, Download, Key, Shield, Sparkles } from "lucide-react";
import { BarStat } from "../components/BarStat";
import { MODEL_CONSUMPTION, MODEL_USAGE, PLANS } from "../lib/data";
import type { Plan, Range } from "../lib/types";
import { fmtTokens } from "../lib/ui";

type AnalyticsViewProps = {
  plan: Plan;
  onPlanChange: (plan: Plan) => void;
  range: Range;
  onRangeChange: (range: Range) => void;
  used: number;
  runs: number;
};

export function AnalyticsView({ plan, onPlanChange, range, onRangeChange, used, runs }: AnalyticsViewProps) {
  const [tab, setTab] = useState<"billing" | "security">("billing");
  const [copiedKey, setCopiedKey] = useState(false);
  const limits = PLANS[plan];
  const tokensUsed = 380_000 + runs * 4_200;

  const modelRows = MODEL_USAGE[range].map((row) =>
    range === "24h" && (row.name === "DeepSeek-V3" || row.name === "FLUX.1")
      ? { ...row, value: row.value + runs }
      : row,
  );
  const modelMax = Math.max(...modelRows.map((r) => r.value));
  const modelTotal = modelRows.reduce((sum, r) => sum + r.value, 0);

  const copyKey = () => {
    try {
      navigator.clipboard.writeText("nx_live_9a87f2e1c4b0451a89d71c8932ef");
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch {}
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1080px] px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">Account &amp; Infrastructure</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.02em] text-zinc-100">Settings &amp; Usage</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Manage your subscription plan, track multi-model token consumption, and configure gateway security credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-zinc-800">
          <button
            onClick={() => setTab("billing")}
            className={`pb-3 text-sm font-medium transition duration-150 border-b-2 mr-6 ${
              tab === "billing"
                ? "border-indigo-500 text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            General &amp; Billing
          </button>
          <button
            onClick={() => setTab("security")}
            className={`pb-3 text-sm font-medium transition duration-150 border-b-2 ${
              tab === "security"
                ? "border-indigo-500 text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Security &amp; Access
          </button>
        </div>

        {tab === "billing" ? (
          <div className="space-y-6">
            {/* ── Subscription Plan Card ── */}
            <div className="rounded-2xl border border-zinc-800/60 bg-surface p-6 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 mb-4">
                <span className="font-semibold uppercase tracking-wider text-zinc-400">Subscription Plan</span>
                <span>Next billing cycle Nov 1, 2026</span>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-bold text-zinc-100">
                      {plan === "pro" ? "Pro Tier" : "Free Tier"}
                    </h3>
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-400 max-w-lg">
                    {plan === "pro"
                      ? "Multi-tenant context memory, automated model routing, and standard zero-data retention."
                      : "Standard autonomous model gateway with community limits and basic context retention."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onPlanChange(plan === "pro" ? "free" : "pro")}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white active:scale-[0.98]"
                  >
                    {plan === "pro" ? "Manage Plan" : "Upgrade to Pro"}
                  </button>
                </div>
              </div>

              {/* Month Usage & Savings */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800/50 bg-zinc-950/60 p-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">Current Month Usage</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-zinc-100 font-mono">
                      {plan === "pro" ? "$142.80" : "$0.00"}
                    </span>
                    <span className="text-xs text-zinc-500">USD</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    <ArrowDown size={13} />
                    Saved $304.50 (68%) via Auto-Router
                  </span>

                  <button className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-zinc-800 hover:text-white">
                    <Download size={13} />
                    Invoice PDF
                  </button>
                </div>
              </div>
            </div>

            {/* ── Model Consumption Breakdown ── */}
            <div className="rounded-2xl border border-zinc-800/60 bg-surface p-6 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-5">
                <span className="font-semibold uppercase tracking-wider text-zinc-400">Model Consumption</span>
                <span className="text-zinc-500">Billing period: Oct 1 – Oct 31</span>
              </div>

              <div className="space-y-4">
                {MODEL_CONSUMPTION.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-200">{item.name}</span>
                        <span className="text-xs text-zinc-500">{item.desc}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="font-semibold text-zinc-100">${item.cost.toFixed(2)}</span>
                        <span className="text-zinc-500">{item.tokens}</span>
                      </div>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800/60">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.bar}`}
                        style={{ width: `${item.barPct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Context Memory Multi-Tenant SLA ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800/60 bg-surface p-4">
              <div>
                <p className="text-sm font-semibold text-zinc-200">Context Memory Multi-Tenant SLA</p>
                <p className="text-xs text-zinc-500 mt-0.5">Dedicated Redis memory pool with 99.95% availability guaranteed.</p>
              </div>
              <button
                onClick={() => onPlanChange(plan === "pro" ? "free" : "pro")}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
              >
                Manage Quotas →
              </button>
            </div>

            {/* ── Quota & Telemetry Metrics ── */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">Live Quotas &amp; Rate Limits</p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <BarStat
                  label="Flash model, per minute"
                  value={9}
                  limit={limits.flashRpm}
                  display={`9 / ${limits.flashRpm} RPM`}
                />
                <BarStat
                  label="Pro model, per minute"
                  value={1}
                  limit={limits.proRpm}
                  display={`1 / ${limits.proRpm} RPM`}
                />
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
            </div>

            {/* ── Tier Comparison & Model Activity ── */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-zinc-800/60 bg-surface p-5">
                <h3 className="text-sm font-semibold text-zinc-200">Free vs Pro Tier Limits</h3>
                <table className="mt-4 w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-zinc-800 text-left">
                      <th className="pb-2.5 font-normal text-zinc-500">Feature / Limit</th>
                      {(["free", "pro"] as Plan[]).map((p) => (
                        <th
                          key={p}
                          className={`pb-2.5 text-right font-medium ${plan === p ? "text-zinc-100" : "text-zinc-500"}`}
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
                        <td className={`py-2.5 text-right font-mono ${plan === "free" ? "text-zinc-100" : "text-zinc-500"}`}>
                          {free}
                        </td>
                        <td className={`py-2.5 text-right font-mono ${plan === "pro" ? "text-zinc-100" : "text-zinc-500"}`}>
                          {pro}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Requests by Model Chart */}
              <div className="rounded-xl border border-zinc-800/60 bg-surface p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-200">Requests by Model</h3>
                  <div className="flex rounded-lg border border-zinc-800 p-0.5" role="tablist">
                    {(["24h", "7d", "30d"] as Range[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => onRangeChange(r)}
                        className={`h-7 rounded-md px-2.5 font-mono text-xs transition duration-150 ${
                          range === r ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-200"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {modelRows.map((row) => (
                    <div key={row.name}>
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-zinc-300">{row.name}</span>
                        <span className="font-mono text-zinc-400">{row.value.toLocaleString()}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-800/60">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${row.color}`}
                          style={{ width: `${(row.value / modelMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-3 text-[13px]">
                  <span className="text-zinc-500">Total requests</span>
                  <span className="font-mono font-medium text-zinc-200">{modelTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Security & Access Tab ── */
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800/60 bg-surface p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Key size={18} className="text-indigo-400" />
                <h3 className="text-base font-semibold text-zinc-100">Gateway API Credentials</h3>
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                Use this bearer token to authenticate external microservices, SDK clients, or CLI instances directly to Nexus Gateway.
              </p>

              <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <code className="flex-1 font-mono text-xs text-indigo-300 truncate">
                  nx_live_9a87f2e1c4b0451a89d71c8932ef
                </code>
                <button
                  onClick={copyKey}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                  {copiedKey ? <Check size={12} className="text-emerald-400" /> : null}
                  {copiedKey ? "Copied" : "Copy Key"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/60 bg-surface p-6 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={18} className="text-emerald-400" />
                <h3 className="text-base font-semibold text-zinc-100">Zero-Data Retention Guarantee</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All prompt embeddings, chat traces, and tool execution environments are held ephemerally in active memory. No user payload data is stored permanently or used to train public foundation models.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Enterprise SOC2 Type II &amp; HIPAA Compliant</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
