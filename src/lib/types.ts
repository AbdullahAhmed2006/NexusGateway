import type { Dispatch, SetStateAction } from "react";

/** The five pages reachable from the sidebar once signed in. */
export type View = "workspace" | "analytics" | "gallery" | "knowledge-base" | "context-migration";
export type Plan = "free" | "pro";
export type Range = "24h" | "7d" | "30d";
export type Kind = "image" | "pdf" | "pptx";
export type KindFilter = "all" | Kind;

export type Message =
  { id: number; role: "user"; text: string; files: string[] } | { id: number; role: "assistant"; prompt: string };

/** 0 idle · 1 decomposing · 2 code running · 3 both running · 4 code done */
export type Stage = 0 | 1 | 2 | 3 | 4;

export type Artifact = {
  id: number;
  name: string;
  kind: Kind;
  source: string;
  size: string;
  created: string;
  session: string;
};

export type DownloadState = Record<number, "loading" | "done">;
export type Setter<T> = Dispatch<SetStateAction<T>>;
