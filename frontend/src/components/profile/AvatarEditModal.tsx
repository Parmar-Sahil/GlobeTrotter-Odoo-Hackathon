"use client";

import React, { useState } from "react";
import { X, Image as ImageIcon, Trash2, Check, Sparkles } from "lucide-react";

interface AvatarEditModalProps {
  isOpen: boolean;
  currentAvatarUrl?: string | null;
  userInitials: string;
  onClose: () => void;
  onSaveAvatar: (avatarUrl: string) => Promise<void>;
  onRemoveAvatar: () => Promise<void>;
}

export function AvatarEditModal({
  isOpen,
  currentAvatarUrl,
  userInitials,
  onClose,
  onSaveAvatar,
  onRemoveAvatar,
}: AvatarEditModalProps) {
  const [urlInput, setUrlInput] = useState(currentAvatarUrl || "");
  const [previewError, setPreviewError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  if (!isOpen) return null;

  const presetAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsSubmitting(true);
    try {
      await onSaveAvatar(urlInput.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemoveAvatar();
      onClose();
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-orange-100 shadow-2xl w-full max-w-md p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-orange-100/70 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-50 text-[#F95724]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Update Profile Picture
              </h3>
              <p className="text-xs text-slate-500">
                Enter an image URL or choose a traveler preset
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-orange-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Avatar Preview */}
        <div className="flex flex-col items-center justify-center space-y-2 py-2">
          <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-[#F95724]/40 shadow-lg shadow-orange-950/10 relative bg-[#2A0E06]">
            {urlInput && !previewError ? (
              <img
                src={urlInput}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
                onError={() => setPreviewError(true)}
                onLoad={() => setPreviewError(false)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#7C2D12] via-[#9A3412] to-[#F95724] text-white flex items-center justify-center font-black text-2xl">
                {userInitials}
              </div>
            )}
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Live Preview
          </span>
        </div>

        {/* Preset suggestions */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Sample Avatars
          </label>
          <div className="grid grid-cols-6 gap-2">
            {presetAvatars.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUrlInput(preset);
                  setPreviewError(false);
                }}
                className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                  urlInput === preset
                    ? "border-[#F95724] ring-2 ring-orange-400/40"
                    : "border-slate-200 opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={preset}
                  alt={`Preset ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Image URL Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Custom Image URL
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setPreviewError(false);
              }}
              placeholder="https://example.com/your-photo.jpg"
              className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {currentAvatarUrl ? (
              <button
                type="button"
                disabled={isRemoving}
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isRemoving ? "Removing..." : "Remove Photo"}
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !urlInput.trim()}
                className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-[#7C2D12] hover:bg-[#9A3412] text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-all disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                {isSubmitting ? "Saving..." : "Apply Photo"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
