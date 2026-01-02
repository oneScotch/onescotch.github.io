import { useState, useEffect } from "react";

interface CitationData {
  [arxivId: string]: number;
}

// Extract arXiv ID from URL (e.g., "https://arxiv.org/abs/2501.09782" -> "2501.09782")
function extractArxivId(arxivUrl: string): string | null {
  const match = arxivUrl.match(/arxiv\.org\/abs\/(\d+\.\d+)/);
  return match ? match[1] : null;
}

// Front-end no-op hook: use static citation values from provided publications.
export function useCitations(publications: Array<{ arxiv?: string; citations: number }>) {
  const [citations, setCitations] = useState<CitationData>({});
  const [isLoading] = useState(false);

  useEffect(() => {
    const mapped: CitationData = {};
    for (const pub of publications) {
      if (pub.arxiv) {
        const id = extractArxivId(pub.arxiv);
        if (id) mapped[id] = pub.citations ?? 0;
      }
    }
    setCitations(mapped);
  }, [publications]);

  const getCitations = (arxivUrl?: string, fallback: number = 0): number => {
    if (!arxivUrl) return fallback;
    const arxivId = extractArxivId(arxivUrl);
    if (!arxivId) return fallback;
    return citations[arxivId] ?? fallback;
  };

  return { citations, getCitations, isLoading };
}

