import { useEffect, useRef, useState } from "react";
import { Check, Code, Copy, Image as ImageIcon, Paperclip, Sparkles } from "lucide-react";
import { ArtifactThumb } from "../components/ArtifactThumb";
import { ChatInput } from "../components/ChatInput";
import { Logo } from "../components/Logo";
import { MultiAgentIndicator } from "../components/MultiAgentIndicator";
import { useTimers } from "../hooks/useTimers";
import { SAMPLE_CODE, SUGGESTIONS } from "../lib/data";
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
  onSend,
  onNavigate,
}: WorkspaceViewProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { schedule } = useTimers();

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
          {messages.length === 0 && stage === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <Logo size={44} />
              <h2 className="mt-5 text-xl font-semibold tracking-[-0.01em]">What should Nexus route today?</h2>
              <p className="mt-2 max-w-sm text-sm text-zinc-500">
                One prompt is split into tasks and sent to the best model for each, in parallel.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInput(s);
                      textareaRef.current?.focus();
                    }}
                    className="rounded-full border border-zinc-800/50 bg-surface px-3.5 py-1.5 text-[13px] text-zinc-300 transition duration-150 hover:border-zinc-700 hover:text-zinc-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex flex-col items-end gap-1.5">
                  <div className="max-w-[75%] whitespace-pre-wrap break-words rounded-xl bg-zinc-800 px-4 py-2.5 text-sm leading-[22px] text-white">
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
                <div key={m.id}>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Sparkles size={13} className="text-indigo-400" />
                    <span className="font-medium text-zinc-300">Nexus</span>
                    <span>·</span>
                    <Check size={12} className="text-green-500" />
                    <span>Completed · 2 agents · 3.0s</span>
                  </div>
                  <p className="mt-3 text-sm leading-[22px] text-zinc-200">
                    Done. I split your request into two tasks and ran them in parallel. DeepSeek-V3 wrote the component
                    below, and FLUX.1 rendered a visual to go with it.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800/50 bg-surface">
                      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-400" />
                        <span className="text-[13px] font-medium">DeepSeek-V3</span>
                        <span className="flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-400">
                          <Code size={11} />
                          Code
                        </span>
                        <button
                          onClick={() => copyCode(m.id)}
                          className="ml-auto flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition duration-150 hover:bg-zinc-900 hover:text-zinc-200"
                        >
                          {copiedId === m.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          {copiedId === m.id ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <pre className="max-h-64 overflow-auto bg-zinc-950 p-3 font-mono text-xs leading-5 text-zinc-300">
                        <code>{SAMPLE_CODE}</code>
                      </pre>
                      <p className="px-3 py-2 font-mono text-[11px] text-zinc-500">1.2k tokens · 2.2s</p>
                    </div>

                    <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800/50 bg-surface">
                      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-violet-400" />
                        <span className="text-[13px] font-medium">FLUX.1</span>
                        <span className="flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-400">
                          <ImageIcon size={11} />
                          Image
                        </span>
                        <button
                          onClick={() => onNavigate("gallery")}
                          className="ml-auto rounded-md px-2 py-1 text-xs text-zinc-400 transition duration-150 hover:bg-zinc-900 hover:text-zinc-200"
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
