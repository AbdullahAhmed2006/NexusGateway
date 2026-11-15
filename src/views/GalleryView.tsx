import { useState } from "react";
import { Check, Download, FileText, Loader, Search, X } from "lucide-react";
import { ArtifactThumb } from "../components/ArtifactThumb";
import { FILTERS, KIND_META } from "../lib/data";
import type { Artifact, DownloadState, KindFilter, View } from "../lib/types";
import { inputClass } from "../lib/ui";

type GalleryViewProps = {
  artifacts: Artifact[];
  filter: KindFilter;
  onFilterChange: (filter: KindFilter) => void;
  query: string;
  onQueryChange: (query: string) => void;
  downloads: DownloadState;
  onDownload: (id: number) => void;
  onNavigate: (view: View) => void;
};

/** Artifacts grid with type filters, search, dummy downloads, and a preview modal. */
export function GalleryView({
  artifacts,
  filter,
  onFilterChange,
  query,
  onQueryChange,
  downloads,
  onDownload,
  onNavigate,
}: GalleryViewProps) {
  const [preview, setPreview] = useState<Artifact | null>(null);

  const q = query.trim().toLowerCase();
  const visible = artifacts.filter(
    (a) => (filter === "all" || a.kind === filter) && (!q || a.name.toLowerCase().includes(q)),
  );

  const downloadLabel = (id: number) =>
    downloads[id] === "loading" ? "Preparing…" : downloads[id] === "done" ? "Saved" : "Download";
  const downloadIcon = (id: number, size: number) =>
    downloads[id] === "loading" ? (
      <Loader size={size} className="animate-spin" />
    ) : downloads[id] === "done" ? (
      <Check size={size} className="text-green-600" />
    ) : (
      <Download size={size} />
    );

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1120px] px-6 py-8 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.01em]">Artifacts</h2>
              <p className="mt-1 text-sm text-zinc-500">{artifacts.length} files generated in your sessions</p>
            </div>
            <label className="relative block w-full sm:w-64">
              <span className="sr-only">Search files</span>
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search files"
                className={`${inputClass} !h-9 pl-9 !text-[13px]`}
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="File type">
            {FILTERS.map((f) => {
              const count = f.key === "all" ? artifacts.length : artifacts.filter((a) => a.kind === f.key).length;
              return (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={filter === f.key}
                  onClick={() => onFilterChange(f.key)}
                  className={`flex h-8 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium transition duration-150 ${
                    filter === f.key
                      ? "bg-zinc-100 text-black"
                      : "border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {f.label}
                  <span className={`font-mono text-[11px] ${filter === f.key ? "text-zinc-500" : "text-zinc-600"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <div className="mt-16 flex flex-col items-center text-center">
              <FileText size={28} strokeWidth={1.5} className="text-zinc-600" />
              <p className="mt-4 text-sm font-medium">No files match</p>
              <p className="mt-1 text-[13px] text-zinc-500">Try another name or file type.</p>
              <button
                onClick={() => {
                  onQueryChange("");
                  onFilterChange("all");
                }}
                className="mt-5 h-9 rounded-lg border border-zinc-800 bg-zinc-900 px-4 text-[13px] font-medium text-zinc-200 transition duration-150 hover:border-zinc-700"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((a) => (
                <div
                  key={a.id}
                  className="group overflow-hidden rounded-xl border border-zinc-800/50 bg-surface transition duration-150 hover:-translate-y-0.5 hover:border-zinc-700"
                >
                  <button
                    onClick={() => setPreview(a)}
                    aria-label={`Preview ${a.name}`}
                    className="relative block aspect-[4/3] w-full bg-zinc-950"
                  >
                    <ArtifactThumb kind={a.kind} />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[13px] font-medium text-zinc-50 opacity-0 transition duration-150 group-hover:opacity-100">
                      Preview
                    </span>
                  </button>
                  <div className="p-3">
                    <p className="truncate text-[13px] font-medium">{a.name}</p>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className={KIND_META[a.kind].text}>
                        {KIND_META[a.kind].label} · {a.source}
                      </span>
                      <span className="font-mono text-zinc-500">{a.size}</span>
                    </div>
                    <button
                      onClick={() => onDownload(a.id)}
                      className="mt-3 flex h-8 w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-200 transition duration-150 hover:border-zinc-700 hover:bg-zinc-800 active:scale-[0.98]"
                    >
                      {downloadIcon(a.id, 13)}
                      {downloadLabel(a.id)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {preview && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-6">
          <button
            aria-label="Close preview"
            onClick={() => setPreview(null)}
            className="absolute inset-0 bg-black/80"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={preview.name}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/80 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-3.5">
              <span className={`h-2 w-2 rounded-full ${KIND_META[preview.kind].dot}`} />
              <p className="min-w-0 flex-1 truncate text-sm font-medium">{preview.name}</p>
              <button
                aria-label="Close preview"
                onClick={() => setPreview(null)}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <X size={16} />
              </button>
            </div>
            <div className="aspect-[16/9] bg-zinc-950">
              <ArtifactThumb kind={preview.kind} />
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 px-5 py-4 text-[13px]">
              {[
                ["Type", KIND_META[preview.kind].label],
                ["Generated by", preview.source],
                ["Size", preview.size],
                ["Created", preview.created],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-zinc-500">{k}</dt>
                  <dd className="mt-0.5 text-zinc-200">{v}</dd>
                </div>
              ))}
              <div className="col-span-2">
                <dt className="text-xs text-zinc-500">Session</dt>
                <dd className="mt-0.5 truncate text-zinc-200">{preview.session}</dd>
              </div>
            </dl>
            <div className="flex gap-3 border-t border-zinc-800 px-5 py-4">
              <button
                onClick={() => onDownload(preview.id)}
                className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-100 text-[13px] font-medium text-black transition duration-150 hover:bg-white active:scale-[0.98]"
              >
                {downloadIcon(preview.id, 14)}
                {downloadLabel(preview.id)}
              </button>
              <button
                onClick={() => onNavigate("workspace")}
                className="h-9 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 text-[13px] font-medium text-zinc-200 transition duration-150 hover:border-zinc-700 active:scale-[0.98]"
              >
                Open in chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
