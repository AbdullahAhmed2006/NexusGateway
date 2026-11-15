import type { ReactNode } from "react";
import { Check, Loader } from "lucide-react";
import type { Stage } from "../lib/types";

function AgentRow({
  dotClass,
  name,
  label,
  state,
  children,
}: {
  dotClass: string;
  name: string;
  label: string;
  state: "queued" | "running" | "done";
  children?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass} ${state === "running" ? "animate-pulse" : ""}`} />
        <span className="text-[13px] font-medium text-zinc-100">{name}</span>
        <span className="min-w-0 flex-1 truncate text-[13px] text-zinc-400">{label}</span>
        {state === "running" && <Loader size={14} className="shrink-0 animate-spin text-zinc-500" />}
        {state === "done" && <Check size={14} className="shrink-0 text-green-500" />}
        {state === "queued" && <span className="shrink-0 text-xs text-zinc-600">Queued</span>}
      </div>
      {children}
    </div>
  );
}

/** Animated supervisor status shown while a run is in progress. Renders nothing when idle. */
export function MultiAgentIndicator({ stage }: { stage: Stage }) {
  if (stage === 0) return null;
  const fluxWidth = stage === 4 ? "92%" : stage === 3 ? "55%" : "0%";

  return (
    <div className="rounded-xl border border-zinc-800/50 bg-surface p-4" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500"
              style={{ animationDelay: `${i * 200}ms`, animationDuration: "1.2s" }}
            />
          ))}
        </span>
        <span className="text-[13px] font-medium text-zinc-100">Multi-Agent Supervisor</span>
        <span className="text-[13px] text-zinc-400">
          {stage === 1 ? "Decomposing prompt…" : "Routing 2 tasks in parallel"}
        </span>
      </div>

      {stage >= 2 && (
        <div className="mt-3 space-y-2">
          <AgentRow
            dotClass="bg-indigo-400"
            name="DeepSeek-V3"
            label={stage === 4 ? "Code ready" : "Generating code…"}
            state={stage === 4 ? "done" : "running"}
          />
          <AgentRow
            dotClass="bg-violet-400"
            name="FLUX.1"
            label={stage === 2 ? "Waiting for a slot" : "Rendering image…"}
            state={stage === 2 ? "queued" : "running"}
          >
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-violet-400 transition-all duration-700 ease-out"
                style={{ width: fluxWidth }}
              />
            </div>
          </AgentRow>
        </div>
      )}
    </div>
  );
}
