"use client";

import { useState } from "react";
import { Play, Search } from "lucide-react";

interface RetrievalResult {
  docName: string;
  chunk: number;
  score: number;
  excerpt: string;
}

export function RetrievalTester() {
  const [query, setQuery] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<RetrievalResult[] | null>(null);

  function handleTest(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setIsTesting(true);
    // Simulate API call
    setTimeout(() => {
      setResults([
        {
          docName: "return-policy.pdf",
          chunk: 3,
          score: 0.91,
          excerpt: "Items may be returned within 30 days of receipt. Products must be in original condition.",
        },
        {
          docName: "faq-billing.md",
          chunk: 1,
          score: 0.74,
          excerpt: "Refunds typically take 3-5 business days to process and appear on your statement.",
        },
      ]);
      setIsTesting(false);
    }, 600);
  }

  return (
    <div className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] rounded-lg overflow-hidden mt-6">
      <div className="px-4 py-3 border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] flex items-center gap-2">
        <Search size={16} className="text-[var(--fg-base)]" />
        <h3 className="text-sm font-semibold text-[var(--fg-base)]">Test Retrieval</h3>
      </div>
      
      <div className="p-4 space-y-4">
        <form onSubmit={handleTest} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a question to test against your knowledge base..."
            className="flex-1 px-3 py-2 text-sm bg-[var(--bg-subtle)] text-[var(--fg-base)] border border-[var(--border-hairline)] rounded placeholder:text-[var(--fg-subtle)] focus:outline-none focus:border-[var(--fg-base)] transition-colors"
          />
          <button
            type="submit"
            disabled={!query.trim() || isTesting}
            className="px-4 py-2 text-sm font-medium bg-[var(--fg-base)] text-[var(--bg-surface)] rounded hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
          >
            {isTesting ? <span className="animate-pulse">Running...</span> : <><Play size={14} /> Run</>}
          </button>
        </form>

        {results && (
          <div className="bg-[var(--bg-subtle)] border border-[var(--border-hairline)] rounded p-4 space-y-3">
            <h4 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Results:</h4>
            <div className="space-y-3">
              {results.map((r, i) => (
                <div key={i} className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[var(--fg-base)]">{i + 1}. {r.docName}</span>
                    <span className="text-xs text-[var(--fg-muted)]">(chunk {r.chunk})</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--border-hairline)] text-[var(--fg-base)] ml-auto">
                      score {r.score.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[var(--fg-muted)] pl-4 border-l-2 border-[var(--border-hairline)] italic text-xs">
                    "{r.excerpt}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
