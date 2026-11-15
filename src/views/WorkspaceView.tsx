"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Code, Copy, Image as ImageIcon, Paperclip, Sparkles } from "lucide-react";
import { ArtifactThumb } from "../components/ArtifactThumb";
import { ChatInput } from "../components/ChatInput";
import { MultiAgentIndicator } from "../components/MultiAgentIndicator";
import { useTimers } from "../hooks/useTimers";
import { SAMPLE_CODE, WORKSPACE_SUGGESTIONS } from "../lib/data";
import type { Message, Plan, Setter, Stage, View } from "../lib/types";

type WorkspaceViewProps = {
  messages: Message[];
  stage: Stage;
  input: string;
  setInput: Setter<string>;
  files: string[];
  setFiles: Setter<string[]>;
  recording: boolean;
  setRecording: Setter<boolean>;
  autoRoute: boolean;
  setAutoRoute: Setter<boolean>;
  plan: Plan;
  email: string;
  onSend: () => void;
  onNavigate: (view: View) => void;
};

/** Main chat area: thread, multi-agent status, and the composer. */
export function WorkspaceView({
  messages,
  stage,
  input,
  setInput,
  files,
  setFiles,
  recording,
  setRecording,
  autoRoute,
  setAutoRoute,
  plan,
  email,
  onSend,
  onNavigate,
}: WorkspaceViewProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { schedule } = useTimers();

  // Extract friendly display name from email (e.g. huzaifa@... -> Huzaifa)
  const userName = email
    ? email.split("@")[0].replace(/[._]/g, " ").split(" ")[0].replace(/^\w/, (c) => c.toUpperCase())
    : "Huzaifa";

  // Keep the newest message or status in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, stage]);

  const copyCode = (id: number) => {
    try {
      navigator.clipboard
        .writeText(SAMPLE_CODE)
        .then(() => {
          setCopiedId(id);
          schedule(() => setCopiedId(null), 1500);
        })
        .catch(() => {});
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-6 py-8">
          {/* ── Empty State Hero ── */}
          {messages.length === 0 && stage === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center text-center my-auto py-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 shadow-lg mb-4">
                <Sparkles size={26} className="text-indigo-400" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Back at it, {userName}
              </h2>
              <p className="mt-2 max-w-md text-sm text-zinc-400 font-mono text-[13px]">
                Nexus Multi-Agent Gateway is primed. Unified semantic context ready.
              </p>

              {/* Suggestions below empty state */}
              <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-xl">
                {WORKSPACE_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInput(s);
                      textareaRef.current?.focus();
                    }}
                    className="rounded-full border border-zinc-800/80 bg-surface px-4 py-2 text-xs text-zinc-300 transition duration-150 hover:border-zinc-700 hover:text-zinc-50 hover:bg-zinc-800/60 shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Message Thread ── */}
          <div className="space-y-6">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex flex-col items-end gap-1.5">
                  <div className="max-w-[80%] whitespace-pre-wrap break-words rounded-2xl bg-zinc-800 px-4 py-3 text-sm leading-[22px] text-white shadow-sm">
                    {m.text}
                  </div>
                  {m.files.length > 0 && (
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {m.files.map((f) => (
                        <span
                          key={f}
                          className="flex items-center gap-1.5 rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-400"
                        >
                          <Paperclip size={11} />
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div key={m.id} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Sparkles size={13} className="text-indigo-400" />
                    <span className="font-semibold text-zinc-300">Nexus Gateway</span>
                    <span>·</span>
                    <Check size={12} className="text-emerald-400" />
                    <span>Completed · 2 agents · 3.0s</span>
                  </div>

                  <p className="text-sm leading-[22px] text-zinc-200">
                    Done. I split your request into two tasks and ran them in parallel. DeepSeek-V3 wrote the component
                    below, and FLUX.1 rendered a visual to go with it.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2 pt-1">
                    {/* DeepSeek-V3 Code Card */}
                    <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800/60 bg-surface shadow-sm">
                      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-400" />
                        <span className="text-[13px] font-semibold text-zinc-200">DeepSeek-V3</span>
                        <span className="flex items-center gap-1 rounded-full border border-zinc-700/80 px-2 py-0.5 text-[10px] text-zinc-400">
                          <Code size={10} />
                          Code
                        </span>
                        <button
                          onClick={() => copyCode(m.id)}
                          className="ml-auto flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                        >
                          {copiedId === m.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          {copiedId === m.id ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <pre className="max-h-64 overflow-auto bg-zinc-950 p-3 font-mono text-xs leading-5 text-zinc-300">
                        <code>{SAMPLE_CODE}</code>
                      </pre>
                      <p className="px-3 py-2 font-mono text-[11px] text-zinc-500">1.2k tokens · 2.2s</p>
                    </div>

                    {/* FLUX.1 Visual Card */}
                    <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800/60 bg-surface shadow-sm">
                      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-violet-400" />
                        <span className="text-[13px] font-semibold text-zinc-200">FLUX.1</span>
                        <span className="flex items-center gap-1 rounded-full border border-zinc-700/80 px-2 py-0.5 text-[10px] text-zinc-400">
                          <ImageIcon size={10} />
                          Image
                        </span>
                        <button
                          onClick={() => onNavigate("gallery")}
                          className="ml-auto rounded-md px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                        >
                          View in Artifacts
                        </button>
                      </div>
                      <div className="aspect-[4/3] bg-zinc-950">
                        <ArtifactThumb kind="image" />
                      </div>
                      <p className="px-3 py-2 font-mono text-[11px] text-zinc-500">
                        Placeholder image · 1024 × 1024 · 3.0s
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}

            <MultiAgentIndicator stage={stage} />
          </div>
        </div>
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        files={files}
        setFiles={setFiles}
        recording={recording}
        setRecording={setRecording}
        autoRoute={autoRoute}
        setAutoRoute={setAutoRoute}
        plan={plan}
        stage={stage}
        onSend={onSend}
        textareaRef={textareaRef}
      />
    </>
  );
}
