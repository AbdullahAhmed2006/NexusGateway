import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart2,
  BookOpen,
  ChevronRight,
  CreditCard,
  Database,
  Globe,
  HardDrive,
  HelpCircle,
  LayoutGrid,
  LogOut,
  MapPin,
  MessageSquare,
  Plus,
  Settings,
  Shield,
  Sparkles,
  Sun,
  User,
  X,
  Zap,
} from "lucide-react";
import { PLATFORM_NAV, PLANS, SESSIONS } from "../lib/data";
import type { Plan, Stage, View } from "../lib/types";
import { tone } from "../lib/ui";
import { Logo } from "./Logo";

type SidebarProps = {
  currentView: View;
  onNavigate: (view: View) => void;
  onOpenThread: (chat: string | null) => void;
  onSignOut: () => void;
  sidebarOpen: boolean;
  onClose: () => void;
  activeChat: string | null;
  artifactCount: number;
  stage: Stage;
  plan: Plan;
  used: number;
  email: string;
};

function NavIcon({ view }: { view: View }) {
  if (view === "analytics") return <Settings size={15} />;
  if (view === "knowledge-base") return <BookOpen size={15} />;
  if (view === "context-migration") return <Database size={15} />;
  if (view === "gallery") return <LayoutGrid size={15} />;
  return <MessageSquare size={15} />;
}

type SettingsItem = { icon: LucideIcon; label: string; hasArrow?: boolean; action?: string };

const SETTINGS_ACCOUNT: SettingsItem[] = [
  { icon: BarChart2, label: "Usage limits", action: "usage" },
  { icon: CreditCard, label: "Manage subscription", action: "subscription" },
  { icon: Zap, label: "Upgrade to Nexus Pro", action: "upgrade" },
];
const SETTINGS_PREFERENCES: SettingsItem[] = [
  { icon: User, label: "Personal Intelligence", action: "pi" },
  { icon: Sun, label: "Theme", hasArrow: true, action: "theme" },
  { icon: Globe, label: "Browser", action: "browser" },
  { icon: HardDrive, label: "Import memory to Nexus Gateway", action: "import-memory" },
];
const SETTINGS_PRIVACY: SettingsItem[] = [
  { icon: MessageSquare, label: "Send feedback", action: "feedback" },
  { icon: HelpCircle, label: "Help", hasArrow: true, action: "help" },
  { icon: MapPin, label: "Location", hasArrow: true, action: "location" },
  { icon: Activity, label: "Activity", action: "activity" },
  { icon: Shield, label: "Privacy policy", action: "privacy" },
];

export function Sidebar({
  currentView, onNavigate, onOpenThread, onSignOut,
  sidebarOpen, onClose, activeChat, artifactCount, stage, plan, used, email,
}: SidebarProps) {
  const limits = PLANS[plan];
  const usedPct = Math.round((used / limits.rpd) * 100);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const gearBtnRef = useRef<HTMLButtonElement>(null);

  // Derive display name from email
  const displayName = email
    ? email.split("@")[0].replace(/[._]/g, " ").split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Guest";
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        settingsRef.current && !settingsRef.current.contains(e.target as Node) &&
        gearBtnRef.current && !gearBtnRef.current.contains(e.target as Node)
      ) setSettingsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [settingsOpen]);

  const handleSettingsAction = (action?: string) => {
    if (action === "upgrade" || action === "usage" || action === "subscription") {
      onNavigate("analytics");
      setSettingsOpen(false);
    }
  };

  // Savings % (simulated)
  const savingsPct = 68;

  return (
    <>
      {sidebarOpen && (
        <button aria-label="Close sidebar" onClick={onClose}
          className="absolute inset-0 z-20 bg-black/60 lg:hidden" />
      )}

      <aside className={`absolute inset-y-0 left-0 z-30 flex w-[220px] shrink-0 flex-col border-r border-zinc-800/50 bg-canvas transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* ── Header ── */}
        <div className="flex h-14 items-center justify-between px-4">
          <button onClick={() => onNavigate("workspace")} className="flex items-center gap-2.5">
            <Logo size={22} />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-zinc-100">Nexus Gateway</span>
              <span className="text-[10px] text-zinc-500">v2.4 Orchestrator</span>
            </div>
          </button>
          <button aria-label="Close sidebar" onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-900 lg:hidden">
            <X size={16} />
          </button>
        </div>

        {/* ── New Unified Chat ── */}
        <div className="px-3 pb-3">
          <button onClick={() => onOpenThread(null)}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-[13px] font-medium text-white transition duration-150 hover:bg-indigo-500 active:scale-[0.98]">
            <Plus size={15} />
            New Unified Chat
          </button>
        </div>

        {/* ── Platform Core ── */}
        <div className="px-3">
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">Platform Core</p>
          <nav className="space-y-0.5" aria-label="Platform">
            {PLATFORM_NAV.map((item) => {
              const active = currentView === item.view;
              return (
                <button key={item.view} onClick={() => onNavigate(item.view)}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition duration-150 ${
                    active ? "bg-zinc-900 text-zinc-50" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}>
                  <NavIcon view={item.view} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {/* Badge */}
                  {item.view === "workspace" && stage !== 0 && (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                  )}
                  {item.view === "gallery" && (
                    <span className="font-mono text-[11px] text-zinc-500">{artifactCount}</span>
                  )}
                  {item.badge && item.view !== "gallery" && (
                    <span className={`text-[10px] font-medium ${item.badgeStyle ?? "text-zinc-500"}`}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mx-3 my-3 h-px bg-zinc-900" />

        {/* ── Recent Sessions ── */}
        <div className="flex-1 overflow-y-auto px-3">
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">Recent Sessions</p>
          {SESSIONS.map((section) => (
            <div key={section.group} className="mb-3">
              <p className="px-2 pb-1 text-[11px] text-zinc-600">{section.group}</p>
              {section.items.map((item) => (
                <button key={item.title} onClick={() => onOpenThread(item.title)}
                  className={`block w-full rounded-md px-2 py-1.5 text-left transition duration-150 ${
                    activeChat === item.title && currentView === "workspace"
                      ? "bg-zinc-900"
                      : "hover:bg-zinc-900"
                  }`}>
                  <p className={`truncate text-[13px] leading-tight ${
                    activeChat === item.title && currentView === "workspace"
                      ? "text-zinc-50"
                      : "text-zinc-400"
                  }`}>{item.title}</p>
                  <p className="mt-0.5 truncate text-[10px] text-zinc-600">{item.model}</p>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* ── Bottom area ── */}
        <div className="p-3 relative">
          {/* Settings panel */}
          {settingsOpen && (
            <div ref={settingsRef}
              className="absolute bottom-[80px] left-3 right-3 z-50 max-h-[70vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/70">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-3">
                <span className="text-sm font-semibold text-zinc-100">Settings</span>
                <button onClick={() => setSettingsOpen(false)} className="text-zinc-500 hover:text-zinc-200" aria-label="Close settings">
                  <X size={15} />
                </button>
              </div>
              {/* Account */}
              <div className="p-2">
                <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Account</p>
                {SETTINGS_ACCOUNT.map((item) => (
                  <button key={item.action} onClick={() => handleSettingsAction(item.action)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50 active:scale-[0.98]">
                    <item.icon size={15} className="shrink-0 text-zinc-400" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.label === "Upgrade to Nexus Pro" && <Sparkles size={13} className="text-indigo-400" />}
                  </button>
                ))}
              </div>
              <div className="mx-3 h-px bg-zinc-800" />
              {/* Preferences */}
              <div className="p-2">
                <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Preferences</p>
                {SETTINGS_PREFERENCES.map((item) => (
                  <button key={item.action} onClick={() => handleSettingsAction(item.action)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50 active:scale-[0.98]">
                    <item.icon size={15} className="shrink-0 text-zinc-400" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.hasArrow && <ChevronRight size={13} className="text-zinc-600" />}
                  </button>
                ))}
              </div>
              <div className="mx-3 h-px bg-zinc-800" />
              {/* Privacy */}
              <div className="p-2">
                <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Data &amp; privacy</p>
                {SETTINGS_PRIVACY.map((item) => (
                  <button key={item.action} onClick={() => handleSettingsAction(item.action)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50 active:scale-[0.98]">
                    <item.icon size={15} className="shrink-0 text-zinc-400" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.hasArrow && <ChevronRight size={13} className="text-zinc-600" />}
                  </button>
                ))}
              </div>
              <div className="mx-3 h-px bg-zinc-800" />
              <div className="p-2">
                <button onClick={() => { setSettingsOpen(false); onSignOut(); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-zinc-800 hover:text-red-300 active:scale-[0.98]">
                  <LogOut size={15} className="shrink-0" />
                  Sign out
                </button>
              </div>
            </div>
          )}

          {/* Auto-Router Active badge */}
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2">
            <Sparkles size={12} className="shrink-0 text-indigo-400" />
            <span className="text-[11px] font-medium text-indigo-300">Auto-Router Active</span>
            <span className="ml-auto text-[11px] font-bold text-indigo-300">{savingsPct}% SAVED</span>
          </div>

          {/* Account row */}
          <div className="flex items-center gap-2.5 px-1 mt-1">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${
              plan === "pro" ? "bg-indigo-600" : "bg-zinc-700"
            }`}>
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-zinc-200">{displayName}</p>
              <p className="truncate text-[10px] text-zinc-500">
                {plan === "pro" ? "Pro Tier · 2FA Active" : "Free Tier"}
              </p>
            </div>
            <button ref={gearBtnRef} aria-label="Settings" title="Settings"
              onClick={() => setSettingsOpen((v) => !v)}
              className={`rounded-md p-1.5 transition duration-150 hover:bg-zinc-900 ${settingsOpen ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-200"}`}>
              <Settings size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
