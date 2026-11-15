import { Image as ImageIcon } from "lucide-react";
import type { Kind } from "../lib/types";

/** Placeholder thumbnail for a generated image, PDF, or slide deck. */
export function ArtifactThumb({ kind }: { kind: Kind }) {
  if (kind === "image") {
    return (
      <div
        className="flex h-full w-full items-center justify-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at 28% 30%, rgba(167,139,250,0.28), transparent 55%), radial-gradient(circle at 75% 72%, rgba(99,102,241,0.24), transparent 55%)",
        }}
      >
        <ImageIcon size={26} strokeWidth={1.5} className="text-zinc-500" />
      </div>
    );
  }
  if (kind === "pdf") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex h-[72%] w-[38%] flex-col gap-1.5 rounded border border-zinc-700 p-2.5">
          <span className="h-1 w-3/4 rounded bg-zinc-500" />
          <span className="h-1 w-full rounded bg-zinc-700" />
          <span className="h-1 w-5/6 rounded bg-zinc-700" />
          <span className="h-1 w-full rounded bg-zinc-700" />
          <span className="h-1 w-1/2 rounded bg-zinc-700" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-[52%] w-[62%] flex-col justify-center gap-1.5 rounded border border-zinc-700 px-3">
        <span className="h-1.5 w-1/2 rounded bg-zinc-500" />
        <span className="h-1 w-4/5 rounded bg-zinc-700" />
        <span className="h-1 w-2/3 rounded bg-zinc-700" />
      </div>
    </div>
  );
}
