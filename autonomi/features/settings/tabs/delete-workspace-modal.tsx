import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DeleteWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export function DeleteWorkspaceModal({ isOpen, onClose, onConfirm }: DeleteWorkspaceModalProps) {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (password) {
      onConfirm(password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-hairline)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--color-danger)]">
            <AlertTriangle size={18} />
            <h2 className="text-base font-semibold">Delete workspace</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-[var(--fg-subtle)] hover:text-[var(--fg-base)] transition-colors rounded p-1 hover:bg-[var(--bg-muted)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-[var(--fg-base)] leading-relaxed">
            This action will schedule the workspace for deletion. You will have a <span className="font-semibold">48-hour grace period</span> to cancel this request before the deletion becomes permanent.
          </p>

          <div className="bg-[var(--color-danger)]/5 border border-[var(--color-danger)]/20 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--color-danger)]">Permanent data loss includes:</h3>
            <ul className="text-sm text-[var(--color-danger)]/90 list-disc list-inside space-y-1">
              <li>All configured agents and knowledge base files</li>
              <li>Complete conversation and approvals history</li>
              <li>Workspace settings and member access</li>
            </ul>

            <div className="pt-3 border-t border-[var(--color-danger)]/10">
              <h3 className="text-sm font-semibold text-[var(--color-danger)] mb-1">Active items flagged:</h3>
              <ul className="text-sm text-[var(--color-danger)]/90 space-y-1">
                <li>• 3 pending approvals require attention</li>
                <li>• Active Pro subscription will be cancelled</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--fg-base)]">
              Enter your password to confirm
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your account password"
              className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--color-danger)] transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-hairline)] bg-[var(--bg-subtle)] flex items-center justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[var(--fg-base)] bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded hover:bg-[var(--bg-muted)] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!password}
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-danger)] rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Schedule Deletion
          </button>
        </div>

      </div>
    </div>
  );
}
