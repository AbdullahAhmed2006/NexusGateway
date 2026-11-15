import type { Artifact, Kind, KindFilter, Plan, Range, View } from "./types";

export const NAV: { view: View; label: string }[] = [
  { view: "workspace", label: "Workspace" },
  { view: "analytics", label: "Analytics" },
  { view: "gallery", label: "Artifacts" },
];

export const HISTORY = [
  { group: "Today", items: ["Landing page + hero art", "Refactor auth service", "Q4 pitch deck"] },
  { group: "Yesterday", items: ["Invoice PDF template", "Logo explorations"] },
];

export const SUGGESTIONS = [
  "Build a pricing section and a hero image to match",
  "Write a rate limiter in Go and diagram it",
  "Draft a launch post with a cover image",
];

export const PLANS: Record<
  Plan,
  { label: string; flashRpm: number; proRpm: number; rpd: number; tokens: number; agents: number; twoFa: boolean }
> = {
  free: { label: "Free", flashRpm: 15, proRpm: 2, rpd: 200, tokens: 1_000_000, agents: 2, twoFa: false },
  pro: { label: "Pro", flashRpm: 120, proRpm: 30, rpd: 10_000, tokens: 50_000_000, agents: 8, twoFa: true },
};

export const MODEL_USAGE: Record<Range, { name: string; color: string; value: number }[]> = {
  "24h": [
    { name: "DeepSeek-V3", color: "bg-indigo-400", value: 64 },
    { name: "Flash", color: "bg-zinc-400", value: 38 },
    { name: "FLUX.1", color: "bg-violet-400", value: 31 },
    { name: "Pro", color: "bg-zinc-600", value: 9 },
  ],
  "7d": [
    { name: "DeepSeek-V3", color: "bg-indigo-400", value: 412 },
    { name: "Flash", color: "bg-zinc-400", value: 260 },
    { name: "FLUX.1", color: "bg-violet-400", value: 188 },
    { name: "Pro", color: "bg-zinc-600", value: 57 },
  ],
  "30d": [
    { name: "DeepSeek-V3", color: "bg-indigo-400", value: 1630 },
    { name: "Flash", color: "bg-zinc-400", value: 1014 },
    { name: "FLUX.1", color: "bg-violet-400", value: 742 },
    { name: "Pro", color: "bg-zinc-600", value: 221 },
  ],
};

export const INITIAL_ARTIFACTS: Artifact[] = [
  {
    id: 1,
    name: "hero-gradient.png",
    kind: "image",
    source: "FLUX.1",
    size: "1.8 MB",
    created: "Today, 16:12",
    session: "Landing page + hero art",
  },
  {
    id: 2,
    name: "invoice-q4.pdf",
    kind: "pdf",
    source: "WeasyPrint",
    size: "240 KB",
    created: "Today, 14:40",
    session: "Invoice PDF template",
  },
  {
    id: 3,
    name: "pitch-deck.pptx",
    kind: "pptx",
    source: "python-pptx",
    size: "3.1 MB",
    created: "Today, 11:05",
    session: "Q4 pitch deck",
  },
  {
    id: 4,
    name: "logo-mark-03.png",
    kind: "image",
    source: "FLUX.1",
    size: "420 KB",
    created: "Yesterday, 19:22",
    session: "Logo explorations",
  },
  {
    id: 5,
    name: "api-report.pdf",
    kind: "pdf",
    source: "WeasyPrint",
    size: "1.1 MB",
    created: "Yesterday, 17:48",
    session: "Refactor auth service",
  },
  {
    id: 6,
    name: "dashboard-bg.png",
    kind: "image",
    source: "FLUX.1",
    size: "2.4 MB",
    created: "Yesterday, 12:30",
    session: "Landing page + hero art",
  },
  {
    id: 7,
    name: "roadmap-2027.pptx",
    kind: "pptx",
    source: "python-pptx",
    size: "2.2 MB",
    created: "12 Nov, 10:14",
    session: "Q4 pitch deck",
  },
  {
    id: 8,
    name: "logo-mark-01.png",
    kind: "image",
    source: "FLUX.1",
    size: "398 KB",
    created: "12 Nov, 09:51",
    session: "Logo explorations",
  },
];

export const KIND_META: Record<Kind, { label: string; text: string; dot: string }> = {
  image: { label: "Image", text: "text-violet-400", dot: "bg-violet-400" },
  pdf: { label: "PDF", text: "text-amber-400", dot: "bg-amber-400" },
  pptx: { label: "Slides", text: "text-amber-400", dot: "bg-amber-400" },
};

export const FILTERS: { key: KindFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "image", label: "Images" },
  { key: "pdf", label: "PDFs" },
  { key: "pptx", label: "Slides" },
];

// New platform-core nav (replaces NAV in sidebar)
export const PLATFORM_NAV: { view: View; label: string; badge?: string; badgeStyle?: string }[] = [
  { view: "workspace", label: "Workspace Chat" },
  { view: "knowledge-base", label: "Knowledge Base", badge: "32 docs", badgeStyle: "text-zinc-500" },
  { view: "context-migration", label: "Context & Migration", badge: "80% Limit", badgeStyle: "text-amber-400" },
  { view: "analytics", label: "Settings & Usage", badge: "Pro", badgeStyle: "text-indigo-400" },
  { view: "gallery", label: "Artifacts", badge: "8 files", badgeStyle: "text-zinc-500" },
];

// Enhanced sessions with model names (replaces HISTORY in sidebar)
export const SESSIONS = [
  {
    group: "Today",
    items: [
      { title: "Architecture Review & Kernel", model: "Claude 3.5 Sonnet" },
      { title: "Latency Telemetry Synthesis", model: "DeepSeek-V3" },
      { title: "Q4 Pitch Deck", model: "Gemini 1.5 Pro" },
    ],
  },
  {
    group: "Previous 7 Days",
    items: [
      { title: "Vector Indexing Pipeline", model: "Gemini 1.5 Pro" },
      { title: "FinOps Q4 Allocations", model: "Claude 3.5 Sonnet" },
    ],
  },
];

// Knowledge base indexed files
export const KB_FILES = [
  { name: "FinOps_Budget_Q4_Allocation.pdf", size: "3.8 MB", chunks: 2480, icon: "pdf" as const },
  { name: "Security_Audit_SOC2_Type2.pdf", size: "5.2 MB", chunks: 3120, icon: "shield" as const },
  { name: "API_Gateway_Specification.md", size: "140 KB", chunks: 560, icon: "code" as const },
];

// Per-model billing detail for the Settings & Usage view
export const MODEL_CONSUMPTION = [
  { name: "Claude 3.5 Sonnet", desc: "Reasoning & Synthesis", cost: 17.28, tokens: "2.4M tokens", barPct: 55, bar: "bg-indigo-500" },
  { name: "DeepSeek-V3", desc: "Auto-Routed (82%)", cost: 5.10, tokens: "18.2M tokens", barPct: 20, bar: "bg-green-500" },
  { name: "Gemini 1.5 Pro", desc: "Long-Context Vector Embeddings", cost: 42.35, tokens: "12.1M tokens", barPct: 68, bar: "bg-blue-500" },
  { name: "FLUX.1 Schnell & Tavily Grounding", desc: "Search & Multimodal", cost: 12.70, tokens: "990 ops", barPct: 25, bar: "bg-zinc-500" },
];

// Available models for the model selector
export const MODELS = [
  { id: "claude-3-5", name: "Claude 3.5 Sonnet", badge: "Reasoning" },
  { id: "deepseek-v3", name: "DeepSeek-V3", badge: "Code" },
  { id: "gemini-1-5", name: "Gemini 1.5 Pro", badge: "Long-Context" },
  { id: "flux-1", name: "FLUX.1 Schnell", badge: "Image" },
];

// Updated workspace suggestions (FYP relevant)
export const WORKSPACE_SUGGESTIONS = [
  "Analyze distributed payment p99 latency",
  "Review FastAPI connection leasing code",
  "Draft architectural diagram for board review",
];

export const SAMPLE_CODE = `export function PricingCard({ tier, price, features }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="text-sm font-medium text-zinc-400">{tier}</h3>
      <p className="mt-2 text-3xl font-semibold text-zinc-50">
        \${price}<span className="text-sm text-zinc-500">/mo</span>
      </p>
      <ul className="mt-6 space-y-2 text-sm text-zinc-300">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  );
}`;
