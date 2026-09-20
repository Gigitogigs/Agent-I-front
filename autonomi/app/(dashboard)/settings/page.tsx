"use client";

import { useState } from "react";
import { RailTabsLayout } from "@/components/templates/rail-tabs/rail-tabs-layout";
import { RailItem } from "@/components/templates/rail-tabs/rail";
import { SaveChangesFooter } from "@/components/shared/save-changes-footer";
import { ProfileTab } from "@/features/settings/tabs/profile-tab";
import { NotificationsTab } from "@/features/settings/tabs/notifications-tab";
import { BillingTab } from "@/features/settings/tabs/billing-tab";
import { IntegrationsTab } from "@/features/settings/tabs/integrations-tab";
import {
  STUB_SETTINGS,
  type SettingsRailItem,
  type SettingsData,
  type UserProfile,
  type NotificationSettings,
} from "@/features/settings/use-settings";

const RAIL_ITEMS = [
  { id: "profile", label: "Profile" },
  { id: "notifications", label: "Notifications" },
  { id: "billing", label: "Billing" },
  { id: "integrations", label: "Integrations" },
];

export default function SettingsPage() {
  const [activeRail, setActiveRail] = useState<SettingsRailItem>("profile");
  const [settings, setSettings] = useState<SettingsData>(STUB_SETTINGS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleProfileChange = (updates: Partial<UserProfile>) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
    setHasUnsavedChanges(true);
  };

  const handleNotificationsChange = (updates: Partial<NotificationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Simulate API save
    setTimeout(() => {
      setHasUnsavedChanges(false);
    }, 500);
  };

  const handleDiscard = () => {
    setSettings(STUB_SETTINGS);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-4 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]">
        <h1 className="text-lg font-semibold text-[var(--fg-base)]">Settings</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Manage your account, workspace preferences, billing, and integrations.
        </p>
      </div>

      {/* ── Main Layout ───────────────────────────────────────────── */}
      <RailTabsLayout
        rail={
          <div className="py-4">
            {RAIL_ITEMS.map((item) => (
              <RailItem
                key={item.id}
                label={item.label}
                active={activeRail === item.id}
                onClick={() => setActiveRail(item.id as SettingsRailItem)}
              />
            ))}
          </div>
        }
        tabs={
          <div className="px-6 py-3 border-b border-transparent">
            {/* 
              No horizontal tabs for Settings. 
              The layout component renders this block above the content.
              We just put a subtle section title or leave it blank to maintain spacing.
            */}
            <h2 className="text-base font-semibold text-[var(--fg-base)] capitalize">
              {activeRail}
            </h2>
          </div>
        }
        content={
          <div className="h-full relative pb-20">
            {activeRail === "profile" && (
              <ProfileTab profile={settings.profile} onChange={handleProfileChange} />
            )}
            {activeRail === "notifications" && (
              <NotificationsTab settings={settings.notifications} onChange={handleNotificationsChange} />
            )}
            {activeRail === "billing" && (
              <BillingTab billing={settings.billing} />
            )}
            {activeRail === "integrations" && (
              <IntegrationsTab 
                connected={settings.integrations.connected} 
                available={settings.integrations.available} 
              />
            )}
          </div>
        }
      />

      {/* ── Save Footer ───────────────────────────────────────────── */}
      {/* 
        Billing and Integrations typically save instantly/externally,
        but Profile and Notifications use the explicit save pattern 
        as specified for consistency.
      */}
      <SaveChangesFooter
        isDirty={hasUnsavedChanges}
        onSave={handleSave}
        onDiscard={handleDiscard}
        className="px-6 pb-4 pt-0 mt-0 border-t-0"
      />
    </div>
  );
}
