import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart2,
  ChevronRight,
  CreditCard,
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
import { HISTORY, NAV, PLANS } from "../lib/data";
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
  if (view === "analytics") return <Activity size={15} />;
  if (view === "gallery") return <LayoutGrid size={15} />;
  return <MessageSquare size={15} />;
}

type SettingsItem = {
  icon: LucideIcon;
  label: string;
  hasArrow?: boolean;
  action?: string;
};

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

/** Persistent left sidebar: logo, new chat, page navigation, history, usage, and account. */
export function Sidebar({
  currentView,
  onNavigate,
  onOpenThread,
  onSignOut,
  sidebarOpen,
  onClose,
  activeChat,
  artifactCount,
  stage,
  plan,
  used,
  email,
}: SidebarProps) {
  const limits = PLANS[plan];
  const usedPct = Math.round((used / limits.rpd) * 100);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const gearBtnRef = useRef<HTMLButtonElement>(null);

  // Close settings on outside click
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node) &&
        gearBtnRef.current &&
        !gearBtnRef.current.contains(e.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [settingsOpen]);

  const handleSettingsAction = (action?: string) => {
    if (action === "upgrade" || action === "usage" || action === "subscription") {
      onNavigate("analytics");
      setSettingsOpen(false);
    }
    // Other actions are UI-only in this prototype
  };

  return (
    <>
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => onClose()}
          className="absolute inset-0 z-20 bg-black/60 lg:hidden"
        />
      )}

      {/* Persistent sidebar */}
      <aside
        className={`absolute inset-y-0 left-0 z-30 flex w-[260px] shrink-0 flex-col border-r border-zinc-800/50 bg-canvas transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <button onClick={() => onNavigate("workspace")} className="flex items-center gap-2.5">
            <Logo size={22} />
            <span className="text-sm font-medium">Nexus</span>
          </button>
          <button
            aria-label="Close sidebar"
            onClick={() => onClose()}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-900 lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-3">
          <button
            onClick={() => onOpenThread(null)}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 text-[13px] font-medium text-black transition duration-150 hover:bg-white active:scale-[0.98]"
          >
            <Plus size={15} />
            New chat
          </button>
        </div>

        <nav className="mt-4 space-y-0.5 px-3" aria-label="Main">
          {NAV.map((item) => {
            const active = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                aria-current={active ? "page" : undefined}
                className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition duration-150 ${
                  active ? "bg-zinc-900 text-zinc-50" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                }`}
              >
                <NavIcon view={item.view} />
                {item.label}
                {item.view === "gallery" && (
                  <span className="ml-auto font-mono text-[11px] text-zinc-500">{artifactCount}</span>
                )}
                {item.view === "workspace" && stage !== 0 && (
                  <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mx-3 my-4 h-px bg-zinc-900" />

        <div className="flex-1 overflow-y-auto px-3">
          {HISTORY.map((section) => (
            <div key={section.group} className="mb-4">
              <p className="px-2 pb-1.5 text-xs text-zinc-600">{section.group}</p>
              {section.items.map((item) => (
                <button
                  key={item}
                  onClick={() => onOpenThread(item)}
                  className={`block h-8 w-full truncate rounded-md px-2 text-left text-[13px] transition duration-150 ${
                    activeChat === item && currentView === "workspace"
                      ? "bg-zinc-900 text-zinc-50"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="p-3 relative">
          {/* ── usage card ── */}
          <button
            onClick={() => onNavigate("analytics")}
            className="block w-full rounded-lg border border-zinc-800/50 bg-surface p-3 text-left transition duration-150 hover:border-zinc-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium">{limits.label} plan</span>
              <span className="text-xs font-medium text-indigo-400">{plan === "free" ? "Upgrade" : "View usage"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-zinc-500">Requests today</span>
              <span className="font-mono text-zinc-400">
                {used} / {limits.rpd.toLocaleString()}
              </span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${tone(usedPct).bar}`}
                style={{ width: `${Math.max(usedPct, 2)}%` }}
              />
            </div>
          </button>

          {/* ── settings panel (pops up above account row) ── */}
          {settingsOpen && (
            <div
              ref={settingsRef}
              className="absolute bottom-[72px] left-3 right-3 z-50 max-h-[70vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/70"
            >
              {/* panel header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-3">
                <span className="text-sm font-semibold text-zinc-100">Settings</span>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="text-zinc-500 transition hover:text-zinc-200"
                  aria-label="Close settings"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Account */}
              <div className="p-2">
                <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  Account
                </p>
                {SETTINGS_ACCOUNT.map((item) => (
                  <button
                    key={item.action}
                    onClick={() => handleSettingsAction(item.action)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50 active:scale-[0.98]"
                  >
                    <item.icon size={15} className="shrink-0 text-zinc-400" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.label === "Upgrade to Nexus Pro" && (
                      <Sparkles size={13} className="text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mx-3 h-px bg-zinc-800" />

              {/* Preferences */}
              <div className="p-2">
                <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  Preferences
                </p>
                {SETTINGS_PREFERENCES.map((item) => (
                  <button
                    key={item.action}
                    onClick={() => handleSettingsAction(item.action)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50 active:scale-[0.98]"
                  >
                    <item.icon size={15} className="shrink-0 text-zinc-400" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.hasArrow && <ChevronRight size={13} className="text-zinc-600" />}
                  </button>
                ))}
              </div>

              <div className="mx-3 h-px bg-zinc-800" />

              {/* Data & privacy */}
              <div className="p-2">
                <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  Data &amp; privacy
                </p>
                {SETTINGS_PRIVACY.map((item) => (
                  <button
                    key={item.action}
                    onClick={() => handleSettingsAction(item.action)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50 active:scale-[0.98]"
                  >
                    <item.icon size={15} className="shrink-0 text-zinc-400" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.hasArrow && <ChevronRight size={13} className="text-zinc-600" />}
                  </button>
                ))}
              </div>

              <div className="mx-3 h-px bg-zinc-800" />

              {/* Sign out */}
              <div className="p-2">
                <button
                  onClick={() => { setSettingsOpen(false); onSignOut(); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-zinc-800 hover:text-red-300 active:scale-[0.98]"
                >
                  <LogOut size={15} className="shrink-0" />
                  Sign out
                </button>
              </div>
            </div>
          )}

          {/* ── account row ── */}
          <div className="mt-3 flex items-center gap-2.5 px-1">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-xs text-zinc-400">
              {(email.trim()[0] || "U").toUpperCase()}
            </div>
            <span className="min-w-0 flex-1 truncate text-[13px] text-zinc-400">{email.trim() || "dev@acme.com"}</span>
            <button
              ref={gearBtnRef}
              aria-label="Settings"
              title="Settings"
              onClick={() => setSettingsOpen((v) => !v)}
              className={`rounded-md p-1.5 transition duration-150 hover:bg-zinc-900 ${
                settingsOpen ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <Settings size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
