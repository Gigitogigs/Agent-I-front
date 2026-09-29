import { useRef, useState, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { TIMEZONES, useProfile, useUpdateProfile, type UserProfile } from "../use-settings";
import { DeleteWorkspaceModal } from "./delete-workspace-modal";
import { DeleteAccountModal } from "./delete-account-modal";

import { useAuth } from "@/hooks/use-auth";

export function ProfileTab() {
  const { data: profileOut, isLoading, error } = useProfile();
  const { isOwner, isLoading: isAuthLoading } = useAuth();
  const updateMutation = useUpdateProfile();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  // Local state for instant updates before saving
  const [localProfile, setLocalProfile] = useState<UserProfile | undefined>();

  useEffect(() => {
    if (profileOut) {
      setLocalProfile({
        name: profileOut.full_name || "",
        email: profileOut.email || "",
        avatarUrl: profileOut.avatar_url || undefined,
        timezone: "UTC", // Note: fallback timezone since it's missing from UserOut
      });
    }
  }, [profileOut]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateMutation.mutate({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
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
  
  const handleChange = (updates: Partial<UserProfile>) => {
    setLocalProfile(prev => prev ? { ...prev, ...updates } : prev);
  };
  
  const handleSaveField = (field: keyof UserProfile, value: string) => {
    updateMutation.mutate({ [field]: value });
  };

  if (isAuthLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--fg-muted)]" /></div>;
  }

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--fg-muted)]" /></div>;
  }
  
  if (error || !localProfile) {
    return <div className="p-8 text-[var(--color-danger)] text-center">Failed to load profile settings.</div>;
  }

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
            {localProfile.avatarUrl ? (
              <img src={localProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-medium text-[var(--fg-subtle)]">
                {localProfile.name.charAt(0).toUpperCase()}
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
            value={localProfile.name}
            onChange={(e) => handleChange({ name: e.target.value })}
            onBlur={(e) => handleSaveField('name', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
          />
        </div>

        {/* Email */}
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-medium text-[var(--fg-base)]">Email</label>
          <input
            type="email"
            value={localProfile.email}
            onChange={(e) => handleChange({ email: e.target.value })}
            onBlur={(e) => handleSaveField('email', e.target.value)}
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
            value={localProfile.timezone}
            onChange={(e) => {
              handleChange({ timezone: e.target.value });
              handleSaveField('timezone', e.target.value);
            }}
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
