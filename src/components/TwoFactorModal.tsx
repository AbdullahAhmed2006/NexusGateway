"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Key, Loader, Shield, X } from "lucide-react";
import { inputClass } from "../lib/ui";

type TwoFactorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function TwoFactorModal({ isOpen, onClose, onSuccess }: TwoFactorModalProps) {
  const [step, setStep] = useState<"setup" | "backup">("setup");
  const [secret, setSecret] = useState("");
  const [testCode, setTestCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep("setup");
      setError(null);
      setInputCode("");
      // Fetch new 2FA setup from backend
      fetch("/api/auth/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.secret) {
            setSecret(data.secret);
            setBackupCodes(data.backup_codes || []);
            setTestCode(data.current_test_code || "");
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          secret,
          code: inputCode.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Verification failed");

      // Advance to backup recovery codes screen
      setStep("backup");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const copyCodes = () => {
    try {
      navigator.clipboard.writeText(backupCodes.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-200"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 mb-4 text-indigo-400">
          <Shield size={24} />
        </div>

        {step === "setup" ? (
          <div>
            <h3 className="text-xl font-bold text-zinc-100">Set Up Two-Factor Authentication (2FA)</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Enhance account security with a Time-based One-Time Password (TOTP) authenticator.
            </p>

            <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Authenticator Secret Key
              </p>
              <div className="mt-1.5 flex items-center justify-between">
                <code className="font-mono text-sm font-semibold tracking-wider text-indigo-300">
                  {secret || "GENERATING..."}
                </code>
                {testCode && (
                  <span className="text-[11px] text-zinc-500">
                    Test Code: <strong className="text-emerald-400 font-mono">{testCode}</strong>
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleVerify} className="mt-5 space-y-4">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="123456"
                  className={`${inputClass} tracking-widest text-center text-lg font-mono`}
                />
              </div>

              <button
                type="submit"
                disabled={loading || inputCode.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
              >
                {loading && <Loader size={14} className="animate-spin" />}
                Verify &amp; Continue →
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-zinc-100">Emergency Backup Recovery Codes</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Save these 8 single-use codes in a secure vault. If you ever lose access to your authenticator, each code can be used once to regain access.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
              {backupCodes.map((code) => (
                <div key={code} className="flex items-center gap-2 rounded border border-zinc-800/80 bg-zinc-900 px-3 py-2">
                  <Key size={12} className="text-indigo-400" />
                  <span>{code}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={copyCodes}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? "Copied All Codes" : "Copy Recovery Codes"}
              </button>
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="flex flex-1 items-center justify-center rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Finish &amp; Enable 2FA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
