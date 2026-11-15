import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";
import {
  ArrowUp,
  ChevronRight,
  FileText,
  FlaskConical,
  Image as ImageIcon,
  Layers,
  Loader,
  Lock,
  Mic,
  Paperclip,
  Plus,
  Upload,
  X,
} from "lucide-react";
import type { Plan, Setter, Stage } from "../lib/types";

type ChatInputProps = {
  input: string;
  setInput: Setter<string>;
  files: string[];
  setFiles: Setter<string[]>;
  recording: boolean;
  setRecording: Setter<boolean>;
  autoRoute: boolean;
  setAutoRoute: Setter<boolean>;
  plan: Plan;
  stage: Stage;
  onSend: () => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
};

const MENU_SECTION_A = [
  { icon: Upload, label: "Upload files", action: "upload" },
  { icon: FlaskConical, label: "Deep research", action: "deep-research" },
  { icon: ImageIcon, label: "Image generation", action: "image" },
];
const MENU_SECTION_B = [
  { icon: Layers, label: "Create slides", action: "slides" },
  { icon: FileText, label: "Generate / Edit document", action: "document" },
];

/** Bottom multimodal composer: text area, + menu, mic, Auto-Route switch, and send. */
export function ChatInput({
  input,
  setInput,
  files,
  setFiles,
  recording,
  setRecording,
  autoRoute,
  setAutoRoute,
  plan,
  stage,
  onSend,
  textareaRef,
}: ChatInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const plusBtnRef = useRef<HTMLButtonElement>(null);
  const [plusOpen, setPlusOpen] = useState(false);
  const canSend = input.trim().length > 0 && stage === 0;
  const isPro = plan === "pro";

  // Auto-grow the composer up to roughly eight lines.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input, textareaRef]);

  // Close + menu on outside click
  useEffect(() => {
    if (!plusOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        plusBtnRef.current &&
        !plusBtnRef.current.contains(e.target as Node)
      ) {
        setPlusOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [plusOpen]);

  const onComposerKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleMenuAction = (action: string) => {
    setPlusOpen(false);
    if (action === "upload") {
      fileRef.current?.click();
    }
    // Other actions are UI-only in this prototype
  };

  return (
    <div className="shrink-0 px-6 pb-4">
      <div className="mx-auto w-full max-w-3xl relative">

        {/* ── + popup menu ── */}
        {plusOpen && (
          <div
            ref={menuRef}
            className="absolute bottom-full mb-2 left-0 z-50 w-64 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60 overflow-hidden"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <span className="text-sm font-medium text-zinc-200">Ask Nexus</span>
              <button
                onClick={() => setPlusOpen(false)}
                className="text-zinc-500 transition hover:text-zinc-200"
                aria-label="Close menu"
              >
                <X size={15} />
              </button>
            </div>

            {/* Section A */}
            <div className="p-1.5">
              {MENU_SECTION_A.map((item) => (
                <button
                  key={item.action}
                  onClick={() => handleMenuAction(item.action)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50 active:scale-[0.98]"
                >
                  <item.icon size={16} className="shrink-0 text-zinc-400" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mx-3 h-px bg-zinc-800" />

            {/* Section B */}
            <div className="p-1.5">
              {MENU_SECTION_B.map((item) => (
                <button
                  key={item.action}
                  onClick={() => handleMenuAction(item.action)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50 active:scale-[0.98]"
                >
                  <item.icon size={16} className="shrink-0 text-zinc-400" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronRight size={13} className="text-zinc-600" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── composer box ── */}
        <div className="rounded-xl border border-zinc-800/50 bg-surface transition duration-150 focus-within:border-indigo-500 focus-within:ring-[3px] focus-within:ring-indigo-500/25">
          {files.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-3 pt-3">
              {files.map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-300"
                >
                  <Paperclip size={11} />
                  <span className="max-w-[160px] truncate">{f}</span>
                  <button
                    aria-label={`Remove ${f}`}
                    onClick={() => setFiles((list) => list.filter((x) => x !== f))}
                    className="text-zinc-500 hover:text-zinc-200"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onComposerKey}
            placeholder={recording ? "Listening…" : "Ask anything, or describe a task to route"}
            className="block max-h-[200px] w-full resize-none bg-transparent px-4 pt-3.5 text-sm leading-[22px] text-zinc-50 placeholder:text-zinc-600 focus:outline-none"
          />

          <div className="flex items-center gap-2 px-3 pb-3 pt-2">
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const names = Array.from(e.target.files ?? []).map((f) => f.name);
                setFiles((list) => Array.from(new Set([...list, ...names])));
                e.target.value = "";
              }}
            />

            {/* + button */}
            <button
              ref={plusBtnRef}
              aria-label="More actions"
              title="Upload files, create images, slides, and more"
              onClick={() => setPlusOpen((v) => !v)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition duration-150 active:scale-[0.98] ${
                plusOpen
                  ? "border-indigo-500 bg-indigo-500/20 text-indigo-300"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
              }`}
            >
              <Plus size={16} />
            </button>

            {/* mic button */}
            <button
              aria-label={recording ? "Stop voice input" : "Start voice input"}
              aria-pressed={recording}
              title="Voice input"
              onClick={() => setRecording((r) => !r)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition duration-150 active:scale-[0.98] ${
                recording
                  ? "animate-pulse border-red-500/60 bg-red-500/15 text-red-400"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
              }`}
            >
              <Mic size={15} />
            </button>

            <span className="mx-1 h-5 w-px bg-zinc-800" />

            {/* Auto-Route toggle */}
            <div className="flex items-center gap-2">
              <button
                role="switch"
                aria-checked={autoRoute}
                disabled={!isPro}
                onClick={() => { if (isPro) setAutoRoute((v) => !v); }}
                title={isPro ? "Toggle Auto-Route" : "Upgrade to Pro to toggle Auto-Route"}
                className={`flex items-center gap-2 text-[13px] transition duration-150 ${
                  isPro
                    ? "cursor-pointer text-zinc-400 hover:text-zinc-200"
                    : "cursor-not-allowed text-zinc-500"
                }`}
              >
                <span
                  className={`relative h-[18px] w-8 rounded-full transition-colors duration-150 ${
                    autoRoute ? "bg-indigo-500" : "bg-zinc-700"
                  } ${!isPro ? "opacity-70" : ""}`}
                >
                  <span
                    className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-zinc-100 transition-all duration-150 ${
                      autoRoute ? "left-4" : "left-[2px]"
                    }`}
                  />
                </span>
                Auto-Route
              </button>
              {!isPro && (
                <span
                  title="Auto-Route is always on for Free users. Upgrade to Pro to control it."
                  className="flex items-center gap-1 rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400"
                >
                  <Lock size={9} />
                  Free
                </span>
              )}
            </div>

            {/* send */}
            <button
              aria-label="Send message"
              onClick={onSend}
              className={`ml-auto flex h-8 w-8 items-center justify-center rounded-lg transition duration-150 active:scale-[0.98] ${
                canSend ? "bg-zinc-100 text-black hover:bg-white" : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {stage !== 0 ? <Loader size={15} className="animate-spin" /> : <ArrowUp size={16} />}
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-zinc-600">
          {!isPro
            ? "Auto-Route is always on — upgrade to Pro to control it."
            : autoRoute
            ? "Nexus picks the best model for each task."
            : "Auto-Route is off. Tasks go to your default model."}
        </p>
      </div>
    </div>
  );
}
