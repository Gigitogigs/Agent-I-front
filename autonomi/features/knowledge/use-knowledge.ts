export type DocStatus = "READY" | "PROCESSING" | "FAILED";

export interface KnowledgeDocument {
  id: string;
  name: string;
  status: DocStatus;
  tags: string[];
  sizeBytes: number;
  chunks?: number;
  uploadedAt: string;
  errorReason?: string;
}

// ── Stub Data ──
export const STUB_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: "doc1",
    name: "return-policy.pdf",
    status: "READY",
    tags: ["Policy"],
    sizeBytes: 82 * 1024,
    chunks: 14,
    uploadedAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
  },
  {
    id: "doc2",
    name: "faq-billing.md",
    status: "READY",
    tags: ["Billing"],
    sizeBytes: 12 * 1024,
    chunks: 6,
    uploadedAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
  },
  {
    id: "doc3",
    name: "shipping.docx",
    status: "PROCESSING",
    tags: ["Shipping"],
    sizeBytes: 45 * 1024,
    uploadedAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
  {
    id: "doc4",
    name: "old-terms.pdf",
    status: "FAILED",
    tags: ["Policy"],
    sizeBytes: 120 * 1024,
    uploadedAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    errorReason: "Unsupported format",
  },
];

export const STATUS_OPTIONS: { id: DocStatus | "ALL"; label: string }[] = [
  { id: "ALL", label: "All statuses" },
  { id: "READY", label: "Ready" },
  { id: "PROCESSING", label: "Processing" },
  { id: "FAILED", label: "Failed" },
];

export function filterDocuments(
  docs: KnowledgeDocument[],
  status: DocStatus | "ALL",
  searchQuery: string
): KnowledgeDocument[] {
  let filtered = docs;
  
  if (status !== "ALL") {
    filtered = filtered.filter((d) => d.status === status);
  }
  
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  
  return filtered;
}

export function formatBytes(bytes: number, decimals = 0) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
