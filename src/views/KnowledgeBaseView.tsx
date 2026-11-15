"use client";

import { useState } from "react";
import { ChevronDown, CloudUpload, Code, FileText, Lock, Shield, Sparkles } from "lucide-react";
import { KB_FILES } from "../lib/data";
import type { View } from "../lib/types";

type KnowledgeBaseViewProps = {
  onNavigate: (view: View) => void;
};

export function KnowledgeBaseView({ onNavigate }: KnowledgeBaseViewProps) {
  const [dragging, setDragging] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [files, setFiles] = useState(KB_FILES);

  const getIcon = (icon: string) => {
    if (icon === "shield") return <Shield size={16} className="text-amber-400" />;
    if (icon === "code") return <Code size={16} className="text-indigo-400" />;
    return <FileText size={16} className="text-blue-400" />;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[760px] px-6 py-8 lg:px-8">
        {/* Title Card */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300">
              <Sparkles size={11} />
              RAG Node Online
            </span>
            <span className="text-xs text-zinc-500">· US-East Cluster</span>
          </div>
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-zinc-100">Knowledge Base &amp; Indexing</h2>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-xl">
            Ground autonomous agents with verified contextual workspace knowledge, parsed documents, and live semantic indices.
          </p>
        </div>

        {/* Upload dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          className={`mb-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10 transition duration-150 cursor-pointer ${
            dragging ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-800 bg-surface/60 hover:border-zinc-700"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 mb-3 shadow-inner">
            <CloudUpload size={22} className="text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-zinc-200">Add knowledge to your workspace</p>
          <p className="mt-1 text-xs text-zinc-500 text-center max-w-xs">
            PDF, Markdown, or text files are securely chunked and vectorized locally
          </p>
          <button className="mt-4 flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-200 transition hover:bg-zinc-800 hover:text-white active:scale-[0.98]">
            <CloudUpload size={14} />
            Browse files
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: "Total Vectors", value: "6,160", color: "text-indigo-400" },
            { label: "Storage", value: "18.1 MB", color: "text-zinc-100" },
            { label: "Hit Rate", value: "99.4%", color: "text-emerald-400" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-zinc-800/60 bg-surface p-4 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{stat.label}</p>
              <p className={`mt-1.5 text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Indexed Documents Section */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Indexed Documents</p>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-500">
            {files.length} active files
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-3.5 rounded-xl border border-zinc-800/60 bg-surface px-4 py-3 transition hover:border-zinc-700"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
                {getIcon(file.icon)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-200">{file.name}</p>
                <p className="text-xs text-zinc-500">
                  {file.size} · {file.chunks.toLocaleString()} chunks
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-medium text-emerald-400">Indexed</span>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Vector Settings Accordion */}
        <button
          onClick={() => setAdvancedOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-zinc-800/60 bg-surface px-4 py-3 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200"
        >
          <span>Advanced vector settings</span>
          <ChevronDown size={15} className={`text-zinc-500 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
        </button>

        {advancedOpen && (
          <div className="mt-2 rounded-xl border border-zinc-800/60 bg-surface px-4 py-4 text-xs">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Chunk Size", value: "512 tokens" },
                { label: "Overlap", value: "64 tokens" },
                { label: "Embedding Model", value: "text-embedding-3-large" },
                { label: "Vector DB", value: "Local Redis Stack" },
              ].map((s) => (
                <div key={s.label} className="flex justify-between rounded-lg border border-zinc-800/60 bg-zinc-950 px-3 py-2.5">
                  <span className="text-zinc-500">{s.label}</span>
                  <span className="font-mono text-zinc-300">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800/80 pt-6">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Lock size={13} className="text-zinc-400" />
            <span>Private &amp; locally encrypted</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("workspace")}
              className="rounded-lg px-4 py-2 text-xs font-medium text-zinc-400 transition hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              onClick={() => onNavigate("workspace")}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.98]"
            >
              Done &amp; Save Namespace →
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Nexus Gateway · Autonomous Workspace Context Synapse
        </p>
      </div>
    </div>
  );
}
