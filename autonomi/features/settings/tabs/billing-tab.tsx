import { Download, Plus } from "lucide-react";
import type { BillingPlan } from "../use-settings";

interface BillingTabProps {
  billing: BillingPlan;
}

export function BillingTab({ billing }: BillingTabProps) {
  const usagePercent = Math.min(100, Math.round((billing.usage.conversations / billing.usage.limit) * 100));

  return (
    <div className="max-w-2xl space-y-10 pb-12">
      {/* Current Plan */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--fg-base)]">
            Current Plan: {billing.planName} &mdash; ${billing.price}/{billing.interval}
          </h3>
          <p className="text-xs text-[var(--fg-muted)] mt-1">
            Usage: {billing.usage.conversations.toLocaleString()} / {billing.usage.limit.toLocaleString()} conversations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs font-medium bg-[var(--fg-base)] text-[var(--bg-surface)] px-3 py-1.5 rounded hover:opacity-90 transition-opacity">
            Upgrade plan
          </button>
          <button className="text-xs font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 rounded hover:bg-[var(--bg-muted)] transition-colors">
            Cancel plan
          </button>
        </div>
      </div>
      
      {/* Usage Bar (optional visual helper matching the previous design) */}
      <div className="h-1.5 w-full bg-[var(--bg-muted)] rounded-full overflow-hidden mt-2">
        <div 
          className="h-full bg-[var(--fg-base)] rounded-full transition-all duration-500"
          style={{ width: `${usagePercent}%` }}
        />
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Payment Method</h3>
        <div className="space-y-3">
          {billing.paymentMethods.map((pm) => (
            <label key={pm.id} className="flex items-center justify-between p-3 border border-[var(--border-hairline)] rounded-lg cursor-pointer hover:border-[var(--fg-subtle)] transition-colors">
              <div className="flex items-center gap-3">
                <input type="radio" name="payment_method" defaultChecked={pm.isDefault} className="mt-0.5 cursor-pointer" />
                <span className="text-sm font-medium text-[var(--fg-base)]">{pm.label}</span>
              </div>
              <button className="text-xs font-medium text-[var(--fg-base)] hover:underline">Edit</button>
            </label>
          ))}
          
          <div className="space-y-2 mt-4 ml-1">
            <button className="flex items-center gap-2 text-xs font-medium text-[var(--fg-subtle)] hover:text-[var(--fg-base)] transition-colors">
              <div className="w-4 h-4 rounded-full border border-[var(--fg-subtle)] flex items-center justify-center"></div>
              Add PayPal
            </button>
            <button className="flex items-center gap-2 text-xs font-medium text-[var(--fg-subtle)] hover:text-[var(--fg-base)] transition-colors">
              <div className="w-4 h-4 rounded-full border border-[var(--fg-subtle)] flex items-center justify-center"></div>
              Add M-Pesa
            </button>
            <button className="flex items-center gap-2 text-xs font-medium text-[var(--fg-subtle)] hover:text-[var(--fg-base)] transition-colors">
              <div className="w-4 h-4 rounded-full border border-[var(--fg-subtle)] flex items-center justify-center"></div>
              Add bank transfer (enterprise)
            </button>
          </div>
        </div>
      </div>

      {/* Billing Details */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg-base)] mb-4">Billing Details</h3>
        <div className="space-y-4 max-w-xl">
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-sm font-medium text-[var(--fg-base)]">Billing address</label>
            <input
              type="text"
              defaultValue={billing.billingDetails.address}
              className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
              placeholder=".........................."
            />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-sm font-medium text-[var(--fg-base)]">Tax ID / VAT</label>
            <input
              type="text"
              defaultValue={billing.billingDetails.taxId}
              className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
              placeholder=".........................."
            />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-sm font-medium text-[var(--fg-base)]">Promo code</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded focus:outline-none focus:border-[var(--fg-base)] transition-colors"
                placeholder="......................"
              />
              <button className="text-sm font-medium text-[var(--fg-base)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-2 rounded hover:bg-[var(--bg-muted)] transition-colors">
                Apply
              </button>
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
                  <td className="px-4 py-3 font-medium">{inv.date}</td>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
