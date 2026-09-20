import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import type { UserProfile } from "../use-settings";
import { TIMEZONES } from "../use-settings";
import { DeleteWorkspaceModal } from "./delete-workspace-modal";
import { DeleteAccountModal } from "./delete-account-modal";

interface ProfileTabProps {
  profile: UserProfile;
  onChange: (updates: Partial<UserProfile>) => void;
}

export function ProfileTab({ profile, onChange }: ProfileTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  // TODO: Use real user role context when available.
  // Gating this to Owner-only per architecture document.
  const isOwner = true; 

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleScheduleDeletion = (password: string) => {
    localStorage.setItem("workspace_deletion_status", "grace_period");
    setIsDeleteModalOpen(false);
    window.location.reload();
  };

  const handleScheduleAccountDeletion = (password: string) => {
    localStorage.setItem("workspace_deletion_status", "account_grace_period");
    setIsDeleteAccountModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="max-w-xl space-y-8 pb-12">
      {/* Avatar */}
      <div className="flex items-center gap-6">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />
        <div 
          className="relative group cursor-pointer"
          onClick={handlePhotoClick}
        >
          <div className="w-16 h-16 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-hairline)] overflow-hidden flex items-center justify-center">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-medium text-[var(--fg-subtle)]">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={20} className="text-white" />
          </div>
        </div>
        <div>
          <button 
            onClick={handlePhotoClick}
            className="text-sm font-medium text-[var(--fg-base)] hover:underline"
          >
            Change photo
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-6">
        {/* Name */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium text-[var(--fg-base)]">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
          />
        </div>

        {/* Email */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium text-[var(--fg-base)]">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
          />
        </div>

        {/* Password */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium text-[var(--fg-base)]">Password</label>
          <div>
            <button className="text-sm font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-2 rounded hover:bg-[var(--bg-muted)] transition-colors">
              Change password &rarr;
            </button>
          </div>
        </div>

        {/* Timezone */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium text-[var(--fg-base)]">Timezone</label>
          <select
            value={profile.timezone}
            onChange={(e) => onChange({ timezone: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Log out */}
      <div className="pt-8 border-t border-[var(--border-hairline)] flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--fg-base)]">Log Out</h3>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            Log out of your account on this device.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = "/login"}
          className="text-sm font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-2 rounded hover:bg-[var(--bg-muted)] transition-colors whitespace-nowrap"
        >
          Log out
        </button>
      </div>

      {/* Delete Workspace */}
      {isOwner && (
        <div className="pt-8 border-t border-[var(--border-hairline)] flex items-center justify-between gap-4">
          <div className="max-w-sm">
            <h3 className="text-sm font-semibold text-[var(--color-danger)]">Delete Workspace</h3>
            <p className="text-sm text-[var(--fg-muted)] mt-1 leading-relaxed">
              Deleting your workspace is permanent and cannot be undone after the 48hr grace period. All workspace data will be removed. (Owner only)
            </p>
          </div>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-sm font-medium text-[var(--color-danger)] border border-[var(--color-danger)] bg-transparent px-4 py-2 rounded hover:bg-[var(--color-danger)] hover:text-white transition-colors whitespace-nowrap"
          >
            Delete workspace
          </button>
        </div>
      )}

      {/* Delete Account */}
      {isOwner && (
        <div className="pt-8 border-t border-[var(--border-hairline)] flex items-center justify-between gap-4">
          <div className="max-w-sm">
            <h3 className="text-sm font-semibold text-[var(--color-danger)]">Delete Account</h3>
            <p className="text-sm text-[var(--fg-muted)] mt-1 leading-relaxed">
              Deleting your account is permanent. This will also schedule all workspaces you own for deletion.
            </p>
          </div>
          <button 
            onClick={() => setIsDeleteAccountModalOpen(true)}
            className="text-sm font-medium text-white bg-[var(--color-danger)] px-4 py-2 rounded hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Delete account
          </button>
        </div>
      )}

      <DeleteWorkspaceModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleScheduleDeletion}
      />

      <DeleteAccountModal 
        isOpen={isDeleteAccountModalOpen} 
        onClose={() => setIsDeleteAccountModalOpen(false)} 
        onConfirm={handleScheduleAccountDeletion}
      />
    </div>
  );
}
