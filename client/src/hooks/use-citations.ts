import { useState, useEffect } from "react";

interface CitationData {
  [arxivId: string]: number;
}

// Extract arXiv ID from URL (e.g., "https://arxiv.org/abs/2501.09782" -> "2501.09782")
function extractArxivId(arxivUrl: string): string | null {
  const match = arxivUrl.match(/arxiv\.org\/abs\/(\d+\.\d+)/);
  return match ? match[1] : null;
}

// Fetch citation count from Semantic Scholar API
async function fetchCitationFromSemanticScholar(arxivId: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/arXiv:${arxivId}?fields=citationCount`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.citationCount ?? null;
  } catch (error) {
    console.warn(`Failed to fetch citations for arXiv:${arxivId}`, error);
    return null;
  }
}

export function useCitations(publications: Array<{ arxiv?: string; citations: number }>) {
  const [citations, setCitations] = useState<CitationData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllCitations = async () => {
      setIsLoading(true);
      const newCitations: CitationData = {};

      // Fetch citations in parallel with rate limiting
      const arxivUrls = publications
        .filter((pub) => pub.arxiv)
        .map((pub) => pub.arxiv!);

      // Process in batches to avoid rate limiting (Semantic Scholar allows ~100 requests/5 min)
      for (const arxivUrl of arxivUrls) {
        const arxivId = extractArxivId(arxivUrl);
        if (arxivId) {
          const count = await fetchCitationFromSemanticScholar(arxivId);
          if (count !== null) {
            newCitations[arxivId] = count;
          }
          // Small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      setCitations(newCitations);
      setIsLoading(false);
    };

    fetchAllCitations();
  }, [publications]);

  // Helper to get citation count for a publication
  const getCitations = (arxivUrl?: string, fallback: number = 0): number => {
    if (!arxivUrl) return fallback;
    const arxivId = extractArxivId(arxivUrl);
    if (!arxivId) return fallback;
    return citations[arxivId] ?? fallback;
  };

  return { citations, getCitations, isLoading };
}

