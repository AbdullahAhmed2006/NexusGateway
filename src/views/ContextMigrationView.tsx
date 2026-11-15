"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, Download, MessageSquare, Sparkles } from "lucide-react";
import type { View } from "../lib/types";

type ContextMigrationViewProps = {
  onNavigate: (view: View) => void;
};

export function ContextMigrationView({ onNavigate }: ContextMigrationViewProps) {
  const [techOpen, setTechOpen] = useState(false);
  const [exported, setExported] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[800px] px-6 py-8 lg:px-8">
        {/* Banner card */}
        <div className="mb-6 rounded-2xl border border-indigo-500/25 bg-indigo-500/5 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15">
              <Sparkles size={16} className="text-indigo-400" />
            </div>
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
              Autonomous Migration
            </span>
            <span className="text-xs text-zinc-500">· Zero Memory Loss</span>
          </div>

          <h2 className="text-xl font-bold tracking-[-0.01em] text-zinc-100 mb-2">
            Context threshold reached (80%) — Seamlessly migrated to Gemini 1.5 Pro
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Your continuous session state, active tool environment, and semantic intent were distilled and
            encapsulated into SSO active memory. You can proceed without any interruption.
          </p>
        </div>

        {/* Live Pipeline Visualizer */}
        <div className="mb-6 rounded-2xl border border-zinc-800/60 bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Live Pipeline Visualizer</p>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-medium">Hot-Swap Synchronized</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Source Model */}
            <div className="w-full sm:flex-1 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-sm font-semibold text-zinc-200">Claude 3.5 Sonnet</span>
                </div>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                  80% Full
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Active Usage</span>
                  <span className="text-zinc-200 font-mono">102k / 200k tok</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full w-[80%] rounded-full bg-amber-500 transition-all duration-500" />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 pt-1">
                  <span>State: Compressed</span>
                  <span className="text-indigo-400 font-medium">AST Transferred</span>
                </div>
              </div>
            </div>

            {/* Hot swap transfer icon */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 shadow-md">
              <ArrowRight size={16} className="text-indigo-400" />
            </div>

            {/* Target Model */}
            <div className="w-full sm:flex-1 rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  <span className="text-sm font-semibold text-zinc-200">Gemini 1.5 Pro</span>
                </div>
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                  Active Target
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Ceiling Available</span>
                  <span className="text-indigo-300 font-mono font-medium">2,000,000 tok</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full w-[5%] rounded-full bg-indigo-500" />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 pt-1">
                  <span>Capacity: 94.9% free</span>
                  <span className="text-emerald-400 font-medium">Optimal Window</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-zinc-800/80 pt-4">
            {[
              { label: "Distillation Efficiency", value: "74%", color: "text-indigo-400" },
              { label: "Pinned State Variables", value: "12 Vars", color: "text-indigo-400" },
              { label: "Hot-Swap Speed", value: "222ms", color: "text-emerald-400" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span className="text-xs text-zinc-500">{s.label}:</span>
                <span className={`text-xs font-semibold ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate("workspace")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.98]"
          >
            <MessageSquare size={16} />
            Continue conversation in Gemini 1.5 Pro
          </button>
          <button
            onClick={() => {
              setExported(true);
              setTimeout(() => setExported(false), 2000);
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-surface px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <Download size={15} />
            {exported ? "Snapshot Exported" : "Export Snapshot"}
          </button>
        </div>

        {/* Technical state accordion */}
        <button
          onClick={() => setTechOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-zinc-800/60 bg-surface px-5 py-3.5 text-xs text-zinc-300 transition hover:bg-zinc-900"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-zinc-500">⇌</span>
            <span>View technical state &amp; serialized variables (12 vars)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-emerald-400">✓ Verified lossless</span>
            <ChevronDown size={14} className={`text-zinc-500 transition-transform ${techOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {techOpen && (
          <div className="mt-2 rounded-xl border border-zinc-800/60 bg-surface px-5 py-4">
            <div className="grid gap-2 font-mono text-xs">
              {[
                { key: "session_id", val: "#nexus-09418" },
                { key: "source_context_used", val: "102,400 tokens (80.0%)" },
                { key: "target_model", val: "gemini-1.5-pro-002" },
                { key: "active_tools", val: '["code_execution", "vector_search", "web_browser"]' },
                { key: "semantic_intent", val: '"context_distillation_and_routing"' },
                { key: "compression_ratio", val: "0.74 (lossless semantic AST)" },
                { key: "ast_hash", val: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" },
                { key: "pinned_vars", val: "12 state registers synchronized" },
              ].map((item) => (
                <div key={item.key} className="flex flex-col sm:flex-row sm:gap-4 py-1 border-b border-zinc-800/40 last:border-0">
                  <span className="w-48 shrink-0 text-zinc-500">{item.key}</span>
                  <span className="text-zinc-300 break-all">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
