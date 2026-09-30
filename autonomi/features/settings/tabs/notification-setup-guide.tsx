import React, { useState } from "react";
import { ExternalLink, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

type ChannelType = "slack" | "teams" | "discord" | "email";

interface GuideProps {
  channelType: ChannelType;
}

const GUIDES: Record<
  ChannelType,
  {
    title: string;
    description: string;
    docsUrl?: string;
    steps: string[];
    examplePlaceholder: string;
  }
> = {
  slack: {
    title: "How to connect Slack",
    description: "Send alerts directly to a channel using Slack Incoming Webhooks.",
    docsUrl: "https://api.slack.com/messaging/webhooks",
    examplePlaceholder: "https://hooks.slack.com/services/T.../B.../...",
    steps: [
      "Open your app at api.slack.com/apps (or create a new one).",
      "Click 'Incoming Webhooks' in the left menu and toggle it On.",
      "Click 'Add New Webhook to Workspace' at the bottom.",
      "Choose the target channel and click 'Allow'.",
      "Copy the generated Webhook URL and paste it below.",
    ],
  },
  teams: {
    title: "How to connect Microsoft Teams",
    description: "Receive Adaptive Cards directly in your Teams channel.",
    docsUrl: "https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook",
    examplePlaceholder: "https://...webhook.office.com/...",
    steps: [
      "Right-click your channel in Teams and select 'Workflows' (or 'Connectors').",
      "Choose 'Post to a channel when a webhook request is received'.",
      "Name the workflow 'Agent-I Notifications' and select your channel.",
      "Complete the setup and copy the unique Webhook URL provided.",
    ],
  },
  discord: {
    title: "How to connect Discord",
    description: "Post rich alerts to any text channel in your Discord server.",
    docsUrl: "https://support.discord.com/hc/en-us/articles/228383668",
    examplePlaceholder: "https://discord.com/api/webhooks/.../...",
    steps: [
      "Click the Gear ⚙️ next to your target channel to open Channel Settings.",
      "Select 'Integrations' from the sidebar.",
      "Click 'Webhooks' → 'New Webhook'.",
      "Name it 'Agent-I Alerts' and click 'Copy Webhook URL'.",
    ],
  },
  email: {
    title: "How to configure Email / Amazon SES",
    description: "Deliver alerts directly to your team's email addresses via SMTP.",
    docsUrl: "https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html",
    examplePlaceholder: "email-smtp.us-east-1.amazonaws.com",
    steps: [
      "Host: Use your AWS SES endpoint (e.g., email-smtp.us-east-1.amazonaws.com).",
      "Port: Use 587 (TLS).",
      "User & Password: In AWS SES Console, go to 'SMTP Settings' → 'Create SMTP Credentials'.",
      "Sender: Must be a verified email identity or domain in your SES account.",
      "Recipient: The email address where notifications will be delivered.",
    ],
  },
};

export const NotificationSetupGuide: React.FC<GuideProps> = ({ channelType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const guide = GUIDES[channelType];

  if (!guide) return null;

  return (
    <div className="rounded border border-[var(--border-hairline)] bg-[var(--bg-subtle)] p-3 text-sm my-4">
      <div
        className="flex cursor-pointer items-center justify-between font-medium text-[var(--fg-base)] hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2 text-[13px]">
          <HelpCircle className="h-4 w-4 text-[var(--fg-muted)]" />
          <span>{guide.title}</span>
        </div>
        <button
          type="button"
          className="text-[var(--fg-muted)] hover:text-[var(--fg-base)]"
          aria-label="Toggle instructions"
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 space-y-2 border-t border-[var(--border-hairline)] pt-3 text-[var(--fg-muted)]">
          <p className="text-xs">{guide.description}</p>
          <ol className="list-decimal space-y-1 pl-4 text-[11px] leading-relaxed">
            {guide.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
          {guide.docsUrl && (
            <div className="pt-2">
              <a
                href={guide.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[var(--fg-base)] underline hover:text-[var(--color-primary)]"
              >
                View official {channelType === 'email' ? 'AWS SES' : channelType.charAt(0).toUpperCase() + channelType.slice(1)} documentation <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
