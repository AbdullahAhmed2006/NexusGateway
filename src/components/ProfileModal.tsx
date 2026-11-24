"use client";

import { useRef, useState } from "react";
import { Check, Loader, Upload, User, X } from "lucide-react";
import { inputClass } from "../lib/ui";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  currentName: string;
  onUpdate: (newName: string, newAvatar?: string) => void;
};

export function ProfileModal({
  isOpen,
  onClose,
  currentEmail,
  currentName,
  onUpdate,
}: ProfileModalProps) {
  const [name, setName] = useState(currentName);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict validation for Task S1-9: PNG/JPG only & max 2MB
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Validation Error: Only validated PNG and JPG formats are accepted.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File Error: Image exceeds maximum 2 MB limit.");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let finalAvatarUrl: string | undefined = undefined;

      // Upload avatar if a new one was selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const res = await fetch("/api/user/avatar", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to upload avatar.");
        finalAvatarUrl = data.avatar_url;
      }

      onUpdate(name, finalAvatarUrl);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-200"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 mb-4 text-indigo-400">
          <User size={22} />
        </div>

        <h3 className="text-xl font-bold text-zinc-100">Profile &amp; Avatar Settings</h3>
        <p className="mt-1 text-xs text-zinc-400">
          Update your public profile details and profile picture (validated PNG or JPG).
        </p>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <Check size={14} className="text-emerald-400" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Avatar Upload Control */}
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Avatar Image (PNG / JPG, max 2MB)
            </label>
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="Avatar Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-zinc-300">
                    {(name || currentEmail || "U")[0].toUpperCase()}
                  </span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
              >
                <Upload size={13} />
                Upload New Image
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Email (Read-only)
            </label>
            <input
              type="email"
              disabled
              value={currentEmail}
              className={`${inputClass} opacity-60 cursor-not-allowed`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading && <Loader size={14} className="animate-spin" />}
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
}
