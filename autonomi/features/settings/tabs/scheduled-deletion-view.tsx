import { AlertTriangle, LogOut, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

interface ScheduledDeletionViewProps {
  type: "workspace" | "account";
}

export function ScheduledDeletionView({ type }: ScheduledDeletionViewProps) {
  const [timeLeft, setTimeLeft] = useState("47 hours, 59 minutes");
  const [isOwner, setIsOwner] = useState(true); // TODO: use real context

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft("47 hours, 58 minutes"); 
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRestore = () => {
    localStorage.removeItem("workspace_deletion_status");
    window.location.reload();
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  const isAccount = type === "account";

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full">
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--color-danger)]/10 flex items-center justify-center border border-[var(--color-danger)]/20 animate-pulse">
            <AlertTriangle className="text-[var(--color-danger)]" size={32} />
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl shadow-sm p-8 text-center space-y-4">
          <h1 className="text-xl font-semibold text-[var(--fg-base)]">
            {isAccount ? "Account Scheduled for Deletion" : "Workspace Scheduled for Deletion"}
          </h1>
          
          <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
            {isAccount 
              ? "Your account and all associated workspaces were scheduled for permanent deletion. They are currently in a 48-hour grace period and cannot be accessed."
              : "This workspace was scheduled for permanent deletion by the Owner. It is currently in a 48-hour grace period and cannot be accessed."}
          </p>

          <div className="py-4 border-y border-[var(--border-hairline)] my-6">
            <p className="text-xs font-semibold text-[var(--fg-base)] uppercase tracking-wider mb-1">
              Time remaining
            </p>
            <p className="text-sm font-medium text-[var(--color-danger)]">
              {timeLeft}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            {isOwner ? (
              <>
                <p className="text-xs text-[var(--fg-muted)] mb-2">
                  {isAccount 
                    ? "You can cancel this request and restore your account immediately."
                    : "As the Owner, you can cancel this request and restore the workspace immediately."}
                </p>
                <button 
                  onClick={handleRestore}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--fg-base)] text-[var(--bg-surface)] hover:opacity-90 px-4 py-2.5 rounded font-medium text-sm transition-opacity shadow-sm"
                >
                  <RotateCcw size={16} />
                  Cancel Deletion & Restore
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-[var(--fg-subtle)] hover:text-[var(--fg-base)] px-4 py-2.5 rounded font-medium text-sm transition-colors border border-transparent hover:border-[var(--border-hairline)] hover:bg-[var(--bg-muted)]"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-[var(--fg-base)] text-[var(--bg-surface)] hover:opacity-90 px-4 py-2.5 rounded font-medium text-sm transition-opacity shadow-sm"
              >
                <LogOut size={16} />
                Log out
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
