import { X, AlertTriangle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setPassword("");
    onClose();
  };

  const handleTransferClick = () => {
    handleClose();
    router.push("/team");
  };

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
            <h2 className="text-base font-semibold">Delete Account</h2>
          </div>
          <button 
            onClick={handleClose}
            className="text-[var(--fg-subtle)] hover:text-[var(--fg-base)] transition-colors rounded p-1 hover:bg-[var(--bg-muted)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {step === 1 ? (
          <div className="p-6 space-y-6">
            <p className="text-sm text-[var(--fg-base)] leading-relaxed">
              Deleting your account is permanent. Because you are the Owner of multiple workspaces, deleting your account will also permanently delete those workspaces.
            </p>

            <div className="bg-[var(--bg-subtle)] border border-[var(--border-hairline)] rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-semibold text-[var(--fg-base)]">You currently own 3 workspaces.</h3>
              <p className="text-sm text-[var(--fg-muted)]">
                Would you like to transfer ownership of these workspaces to another team member before deleting your account?
              </p>
              <button 
                onClick={handleTransferClick}
                className="mt-2 text-sm font-medium text-[var(--fg-base)] hover:underline inline-flex items-center gap-1"
              >
                Transfer ownership <ArrowRight size={14} />
              </button>
            </div>
            
            <p className="text-xs text-[var(--fg-muted)]">
              Any workspaces you are only a member of will remain unaffected, but you will be removed from them.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <p className="text-sm text-[var(--fg-base)] leading-relaxed">
              This action will schedule your account and your owned workspaces for deletion. You will have a <span className="font-semibold">48-hour grace period</span> to cancel this request.
            </p>

            <div className="bg-[var(--color-danger)]/5 border border-[var(--color-danger)]/20 rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-semibold text-[var(--color-danger)]">Permanent data loss includes:</h3>
              <ul className="text-sm text-[var(--color-danger)]/90 list-disc list-inside space-y-1">
                <li>Your user profile and personal data</li>
                <li>3 workspaces that you own</li>
                <li>All agents, history, and billing data in those workspaces</li>
              </ul>
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
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-hairline)] bg-[var(--bg-subtle)] flex items-center justify-between">
          {step === 1 ? (
            <>
              <button 
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-[var(--fg-base)] bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded hover:bg-[var(--bg-muted)] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setStep(2)}
                className="px-4 py-2 text-sm font-medium text-[var(--fg-base)] bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded hover:bg-[var(--bg-muted)] transition-colors"
              >
                I understand, proceed to delete
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-medium text-[var(--fg-base)] bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded hover:bg-[var(--bg-muted)] transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleConfirm}
                disabled={!password}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-danger)] rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Deletion
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
