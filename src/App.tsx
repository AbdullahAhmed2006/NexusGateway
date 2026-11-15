"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { useAgentSimulation } from "./hooks/useAgentSimulation";
import { useTimers } from "./hooks/useTimers";
import { INITIAL_ARTIFACTS, PLANS } from "./lib/data";
import type { Artifact, DownloadState, KindFilter, Plan, Range, View } from "./lib/types";
import { AnalyticsView } from "./views/AnalyticsView";
import { GalleryView } from "./views/GalleryView";
import { LoginView } from "./views/LoginView";
import { WorkspaceView } from "./views/WorkspaceView";

/**
 * Entry point. Owns authentication, the current view, and every piece of state
 * that must survive switching between views, then renders the matching view.
 */
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>("workspace");

  // Account and shell
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<Plan>("free");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [runs, setRuns] = useState(0);

  // Workspace
  const { messages, stage, send: startRun, reset: resetRun } = useAgentSimulation();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [autoRoute, setAutoRoute] = useState(true);
  const [recording, setRecording] = useState(false);

  // Analytics
  const [range, setRange] = useState<Range>("24h");

  // Gallery
  const [artifacts, setArtifacts] = useState<Artifact[]>(INITIAL_ARTIFACTS);
  const [filter, setFilter] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");
  const [downloads, setDownloads] = useState<DownloadState>({});
  const downloadTimers = useTimers();

  /* ------------------------------- Handlers ------------------------------- */

  const go = (view: View) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const signIn = () => {
    setIsAuthenticated(true);
    setCurrentView("workspace");
  };

  const signOut = () => {
    resetRun();
    downloadTimers.clear();
    setInput("");
    setFiles([]);
    setActiveChat(null);
    setSidebarOpen(false);
    setDownloads({});
    setIsAuthenticated(false);
  };

  const openThread = (chat: string | null) => {
    resetRun();
    setActiveChat(chat);
    go("workspace");
  };

  const send = () => {
    const text = input.trim();
    if (!text || stage !== 0) return;

    startRun(text, files, (id) => {
      setRuns((r) => r + 1);
      setArtifacts((list) => [
        {
          id: id + 2,
          name: `render-${String(id).slice(-4)}.png`,
          kind: "image",
          source: "FLUX.1",
          size: "1.6 MB",
          created: "Just now",
          session: activeChat ?? (text.length > 32 ? `${text.slice(0, 32)}…` : text),
        },
        ...list,
      ]);
    });
    setInput("");
    setFiles([]);
    setRecording(false);
  };

  // Dummy download: no file is saved, only the button state changes.
  const download = (id: number) => {
    if (downloads[id]) return;
    setDownloads((d) => ({ ...d, [id]: "loading" }));
    downloadTimers.schedule(() => setDownloads((d) => ({ ...d, [id]: "done" })), 900);
    downloadTimers.schedule(
      () =>
        setDownloads((d) => {
          const next = { ...d };
          delete next[id];
          return next;
        }),
      2600,
    );
  };

  /* -------------------------------- Routing ------------------------------- */

  if (!isAuthenticated) {
    return <LoginView email={email} onEmailChange={setEmail} onSignIn={signIn} />;
  }

  const used = Math.min(142 + runs * 2, PLANS[plan].rpd);
  const firstUser = messages.find((m) => m.role === "user");
  const threadTitle = activeChat ?? (firstUser && firstUser.role === "user" ? firstUser.text : "New chat");
  const title = currentView === "workspace" ? threadTitle : currentView === "analytics" ? "Analytics" : "Artifacts";

  return (
    <div className="min-h-screen bg-canvas text-zinc-100 flex font-sans relative h-screen overflow-hidden antialiased">
      <Sidebar
        currentView={currentView}
        onNavigate={go}
        onOpenThread={openThread}
        onSignOut={signOut}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeChat={activeChat}
        artifactCount={artifacts.length}
        stage={stage}
        plan={plan}
        used={used}
        email={email}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} stage={stage} onOpenSidebar={() => setSidebarOpen(true)} onNavigate={go} />

        {currentView === "workspace" && (
          <WorkspaceView
            messages={messages}
            stage={stage}
            input={input}
            setInput={setInput}
            files={files}
            setFiles={setFiles}
            recording={recording}
            setRecording={setRecording}
            autoRoute={autoRoute}
            setAutoRoute={setAutoRoute}
            plan={plan}
            onSend={send}
            onNavigate={go}
          />
        )}

        {currentView === "analytics" && (
          <AnalyticsView
            plan={plan}
            onPlanChange={setPlan}
            range={range}
            onRangeChange={setRange}
            used={used}
            runs={runs}
          />
        )}

        {currentView === "gallery" && (
          <GalleryView
            artifacts={artifacts}
            filter={filter}
            onFilterChange={setFilter}
            query={query}
            onQueryChange={setQuery}
            downloads={downloads}
            onDownload={download}
            onNavigate={go}
          />
        )}
      </div>
    </div>
  );
}
