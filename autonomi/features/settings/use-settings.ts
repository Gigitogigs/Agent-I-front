export type SettingsRailItem = "profile" | "notifications" | "billing" | "integrations";

export interface UserProfile {
  name: string;
  email: string;
  timezone: string;
  avatarUrl?: string;
}

export interface ConnectedChannel {
  id: string;
  type: "slack" | "email" | "teams";
  name: string;
  destination: string;
  status: "connected" | "error";
}

export interface AvailableChannel {
  id: string;
  name: string;
  icon: string;
}

export interface NotificationSettings {
  connectedChannels: ConnectedChannel[];
  availableChannels: AvailableChannel[];
  webhookUrl: string;
  events: {
    newEscalation: boolean;
    slaBreach: boolean;
    approvalExpired: boolean;
    guardrailBlock: boolean;
  };
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending";
}

export interface BillingPlan {
  planName: string;
  price: number;
  interval: "mo" | "yr";
  usage: {
    conversations: number;
    limit: number;
  };
  paymentMethods: {
    id: string;
    type: "card" | "paypal" | "mpesa" | "bank";
    label: string;
    isDefault: boolean;
  }[];
  billingDetails: {
    address: string;
    taxId: string;
  };
  invoices: Invoice[];
}

export interface ConnectedIntegration {
  id: string;
  type: "shopify" | "in-house" | "zendesk";
  name: string;
  status: "connected" | "error" | "disconnected";
  lastSync?: string;
}

export interface AvailableIntegration {
  id: string;
  name: string;
  category: "E-commerce" | "Support/CRM" | "Other";
}

export interface SettingsData {
  profile: UserProfile;
  notifications: NotificationSettings;
  billing: BillingPlan;
  integrations: {
    connected: ConnectedIntegration[];
    available: AvailableIntegration[];
  };
}

export const STUB_SETTINGS: SettingsData = {
  profile: {
    name: "Gigito",
    email: "gigito@example.com",
    timezone: "Africa/Nairobi",
  },
  notifications: {
    connectedChannels: [
      { id: "c1", type: "slack", name: "Slack", destination: "#support-alerts", status: "connected" },
      { id: "c2", type: "email", name: "Email", destination: "ops@yourco.com", status: "connected" },
    ],
    availableChannels: [
      { id: "ac1", name: "Microsoft Teams", icon: "teams" },
      { id: "ac2", name: "Discord", icon: "discord" },
      { id: "ac3", name: "WhatsApp", icon: "whatsapp" },
      { id: "ac4", name: "Telegram", icon: "telegram" },
    ],
    webhookUrl: "https://hooks.slack.com/services/...",
    events: {
      newEscalation: true,
      slaBreach: true,
      approvalExpired: true,
      guardrailBlock: false,
    },
  },
  billing: {
    planName: "Pro",
    price: 49,
    interval: "mo",
    usage: {
      conversations: 1204,
      limit: 5000,
    },
    paymentMethods: [
      { id: "pm1", type: "card", label: "Card ending 4417", isDefault: true },
    ],
    billingDetails: {
      address: "",
      taxId: "",
    },
    invoices: [
      { id: "inv1", date: "Sep 2026", amount: 49.00, status: "Paid" },
      { id: "inv2", date: "Aug 2026", amount: 49.00, status: "Paid" },
      { id: "inv3", date: "Jul 2026", amount: 49.00, status: "Paid" },
    ],
  },
  integrations: {
    connected: [
      { id: "int_1", type: "shopify", name: "Shopify", status: "connected", lastSync: "5m ago" },
      { id: "int_2", type: "in-house", name: "Custom (in-house)", status: "connected", lastSync: "2h ago" },
    ],
    available: [
      { id: "ai1", name: "WooCommerce", category: "E-commerce" },
      { id: "ai2", name: "Magento", category: "E-commerce" },
      { id: "ai3", name: "BigCommerce", category: "E-commerce" },
      { id: "ai4", name: "Wix", category: "E-commerce" },
      { id: "ai5", name: "Zendesk", category: "Support/CRM" },
      { id: "ai6", name: "Salesforce", category: "Support/CRM" },
    ],
  },
};

export const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Africa/Nairobi",
  "Asia/Tokyo",
  "Australia/Sydney",
];
