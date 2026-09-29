import { Download, CreditCard, Smartphone, Building, Loader2 } from "lucide-react";
import { useBilling } from "../use-settings";
import { useAuth } from "@/hooks/use-auth";

export function BillingTab() {
  const { data: billing, isLoading, error } = useBilling();
  const { activeRole, activeWorkspaceId, isLoading: isAuthLoading } = useAuth();
  const canManageBilling = activeRole === "owner" || activeRole === "admin";

  if (isAuthLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--fg-muted)]" /></div>;
  }

  if (!activeWorkspaceId) {
    return <div className="p-8 text-[var(--fg-muted)] text-center">No active workspace found.</div>;
  }

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--fg-muted)]" /></div>;
  }
  
  if (error || !billing) {
    return <div className="p-8 text-[var(--color-danger)] text-center">Failed to load billing settings.</div>;
  }

  const usagePercent = Math.min(100, Math.round((billing.usage.ai_tokens_used / billing.usage.ai_tokens_limit) * 100));

  return (
    <div className="max-w-2xl space-y-10 pb-12">
      {/* Current Plan */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--fg-base)]">
            Current Plan: {billing.plan_name}
          </h3>
          <p className="text-xs text-[var(--fg-muted)] mt-1">
            Usage: {billing.usage.ai_tokens_used.toLocaleString()} / {billing.usage.ai_tokens_limit.toLocaleString()} AI Tokens
          </p>
          <p className="text-xs text-[var(--fg-muted)] mt-1">
            Active Users: {billing.usage.active_users.toLocaleString()} / {billing.usage.users_limit.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canManageBilling && (
            <>
              <button className="text-xs font-medium bg-[var(--fg-base)] text-[var(--bg-surface)] px-3 py-1.5 rounded hover:opacity-90 transition-opacity">
                Upgrade plan
              </button>
              <button className="text-xs font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 rounded hover:bg-[var(--bg-muted)] transition-colors">
                Cancel plan
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Usage Bar */}
      <div className="h-1.5 w-full bg-[var(--bg-muted)] rounded-full overflow-hidden mt-2">
        <div 
          className="h-full bg-[var(--fg-base)] rounded-full transition-all duration-500"
          style={{ width: `${usagePercent}%` }}
        />
      </div>

      {/* Payment Method (Stubbed for UI presentation) */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Payment Method</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 border border-[var(--border-hairline)] rounded-lg cursor-pointer hover:border-[var(--fg-subtle)] transition-colors">
            <div className="flex items-center gap-3">
              <input type="radio" name="payment_method" defaultChecked={true} disabled={!canManageBilling} className="mt-0.5 cursor-pointer" />
              <CreditCard size={16} className="text-[var(--fg-subtle)]" />
              <span className="text-sm font-medium text-[var(--fg-base)]">Card ending 4417</span>
            </div>
            {canManageBilling && <button className="text-xs font-medium text-[var(--fg-base)] hover:underline">Edit</button>}
          </label>
          
          <div className="space-y-3 mt-6 pt-6 border-t border-[var(--border-hairline)]">
            <h4 className="text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider mb-2">Add Payment Method</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs italic bg-[#00457C] text-white">P</span>
                <span className="text-sm font-medium text-[var(--fg-base)]">PayPal</span>
              </div>
              {canManageBilling && (
                <button className="text-xs font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 rounded hover:bg-[var(--bg-muted)] transition-colors">
                  Connect
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-[var(--color-success)] text-white">
                  <Smartphone size={14} />
                </div>
                <span className="text-sm font-medium text-[var(--fg-base)]">M-Pesa</span>
              </div>
              {canManageBilling && (
                <button className="text-xs font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 rounded hover:bg-[var(--bg-muted)] transition-colors">
                  Connect
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-[var(--fg-base)] text-[var(--bg-surface)]">
                  <Building size={14} />
                </div>
                <span className="text-sm font-medium text-[var(--fg-base)]">Bank transfer (enterprise)</span>
              </div>
              {canManageBilling && (
                <button className="text-xs font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 rounded hover:bg-[var(--bg-muted)] transition-colors">
                  Contact sales
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Billing Details (Stubbed) */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Billing Details</h3>
        <div className="space-y-4 max-w-xl">
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-sm font-medium text-[var(--fg-base)]">Billing address</label>
            <input
              type="text"
              defaultValue=""
              disabled={!canManageBilling}
              className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder=".........................."
            />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-sm font-medium text-[var(--fg-base)]">Tax ID / VAT</label>
            <input
              type="text"
              defaultValue=""
              disabled={!canManageBilling}
              className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder=".........................."
            />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-sm font-medium text-[var(--fg-base)]">Promo code</label>
            <div className="flex gap-2">
              <input
                type="text"
                disabled={!canManageBilling}
                className="flex-1 px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="......................"
              />
              {canManageBilling && (
                <button className="text-sm font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-2 rounded hover:bg-[var(--bg-muted)] transition-colors">
                  Apply
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Invoice History</h3>
        <div className="border border-[var(--border-hairline)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
          <table className="w-full text-left border-collapse">
            <tbody className="text-sm text-[var(--fg-base)] divide-y divide-[var(--border-hairline)]">
              {billing.invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[var(--bg-muted)] transition-colors group">
                  <td className="px-4 py-3 font-medium">
                    {new Date(inv.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">${inv.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-[var(--color-success)]">{inv.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-2.5 py-1 rounded hover:bg-[var(--bg-muted)] transition-colors">
                      <Download size={12} /> Download PDF
                    </button>
                  </td>
                </tr>
              ))}
              {billing.invoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--fg-muted)]">
                    No invoices yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
