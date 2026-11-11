// Node.js script to update citation counts in client/src/lib/data.ts using Semantic Scholar API
// Usage: node scripts/update_citations.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createSemanticScholarRequest } from './semantic_scholar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, '../client/src/lib/data.ts');
const semanticScholarRequest = createSemanticScholarRequest();

function extractArxivId(url) {
  const match = url.match(/arxiv\.org\/abs\/([^/?#\s]+)/);
  return match ? match[1].replace(/v\d+$/, '') : null;
}

async function getCitationCounts(arxivIds) {
  const url = 'https://api.semanticscholar.org/graph/v1/paper/batch?fields=citationCount';
  try {
    const response = await semanticScholarRequest({
      method: 'post',
      url,
      data: { ids: arxivIds.map((id) => `ARXIV:${id}`) },
    });
    return arxivIds.map((_, index) => {
      const paper = response.data[index];
      return paper
        ? { count: paper.citationCount ?? 0 }
        : { count: null, status: 404, error: 'Paper not found by arXiv ID' };
    });
  } catch (e) {
    const status = e.response?.status || null;
    return arxivIds.map(() => ({ count: null, status, error: e.message || String(e) }));
  }
}

async function getCitationCountByTitle(title) {
  const q = encodeURIComponent(title);
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${q}&limit=5&fields=title,externalIds,citationCount`;
  try {
    const response = await semanticScholarRequest({ method: 'get', url });
    const results = response.data.data || [];
    if (!results.length) {
      return { count: null, status: 404, error: 'No Semantic Scholar results found' };
    }
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const target = normalize(title);
    // Try to find exact/close match
    for (const r of results) {
      if (!r.title) continue;
      if (normalize(r.title) === target || normalize(r.title).startsWith(target) || target.startsWith(normalize(r.title))) {
        return { count: r.citationCount ?? 0 };
      }
    }
    // fallback to first result
    return { count: results[0].citationCount ?? 0 };
  } catch (e) {
    const status = e.response?.status || null;
    return { count: null, status, error: e.message || String(e) };
  }
}

async function main() {
  if (!process.env.SEMANTIC_SCHOLAR_API_KEY?.trim()) {
    console.log('No Semantic Scholar API key configured; using the public API with rate-limit retries.');
  }
  let data = await fs.promises.readFile(DATA_PATH, 'utf8');
  const pubArrayMatch = data.match(/export const publications = \[([\s\S]*?)\r?\n\];/);
  if (!pubArrayMatch) throw new Error('Publications array not found');
  let publicationsStr = pubArrayMatch[1];

  // Publication entries are indented by two spaces. Anchoring both braces at
  // that level avoids stopping at nested objects such as author entries.
  const pubRegex = /^  \{[\s\S]*?^  \}(?=,?\r?$)/gm;
  let match;
  const blocks = [];
  while ((match = pubRegex.exec(publicationsStr)) !== null) {
    const fullBlock = match[0];
    const blockBody = fullBlock;
    const titleMatch = blockBody.match(/title:\s*"([^"]+)"/);
    const arxivMatch = blockBody.match(/arxiv:\s*"([^"]+)"/);
    const idMatch = blockBody.match(/id:\s*(\d+)/);
    const citationsMatch = blockBody.match(/citations:\s*(\d+)/);
    const title = titleMatch ? titleMatch[1] : null;
    const arxivUrl = arxivMatch ? arxivMatch[1] : null;
    const arxivId = arxivUrl ? extractArxivId(arxivUrl) : null;
    const id = idMatch ? Number(idMatch[1]) : null;
    const oldCitations = citationsMatch ? Number(citationsMatch[1]) : null;
    if (id === null || oldCitations === null || (!arxivId && !title)) {
      throw new Error(`Invalid publication entry near id ${id ?? '<unknown>'}`);
    }
    blocks.push({ fullBlock, title, arxivId, id, oldCitations });
  }
  if (!blocks.length) throw new Error('No publication entries found');

  const statuses = [];
  let updated = 0, failed = 0, rateLimited = 0;
  const arxivBlocks = blocks.filter((block) => block.arxivId);
  const arxivResults = await getCitationCounts(arxivBlocks.map((block) => block.arxivId));
  const resultByArxivId = new Map(
    arxivBlocks.map((block, index) => [block.arxivId, arxivResults[index]]),
  );

  for (const b of blocks) {
    let res = { count: null, status: null, error: null };
    let method = b.arxivId ? 'arXiv' : (b.title ? 'title' : 'none');
    if (b.arxivId) {
      res = resultByArxivId.get(b.arxivId);
    } else if (b.title) {
      res = await getCitationCountByTitle(b.title);
    }
    const timestamp = new Date().toISOString();
    if (res.count === null) {
      failed += 1;
      if (res.status === 429) rateLimited += 1;
      const entry = { id: b.id, title: b.title, method, old: b.oldCitations, new: null, status: 'failed', statusCode: res.status || null, error: res.error || null, time: timestamp };
      statuses.push(entry);
      console.log(`FAILED [${entry.id ?? '-'}] ${entry.title ?? '<no title>'} via ${entry.method}: status=${entry.statusCode ?? 'unknown'} error=${entry.error ?? 'none'}`);
      continue;
    }
    const newBlock = b.fullBlock.replace(/citations:\s*\d+/, `citations: ${res.count}`);
    publicationsStr = publicationsStr.replace(b.fullBlock, newBlock);
    const entry = { id: b.id, title: b.title, method, old: b.oldCitations, new: res.count, status: 'updated', statusCode: null, time: timestamp };
    statuses.push(entry);
    updated += 1;
    console.log(`UPDATED [${entry.id ?? '-'}] ${entry.title ?? '<no title>'} via ${entry.method}: ${entry.old ?? 0} -> ${entry.new}`);
  }

  console.log(`Citation update summary: ${updated} updated, ${failed} failed (${rateLimited} rate-limited).`);

  // write status file
  try {
    const STATUS_PATH = path.join(__dirname, 'citation_status.json');
    await fs.promises.writeFile(STATUS_PATH, JSON.stringify({ updated, failed, rateLimited, items: statuses }, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write status file:', e.message || e);
  }

  const newData = data.replace(/export const publications = \[[\s\S]*?\r?\n\];/, `export const publications = [${publicationsStr}\n];`);
  await fs.promises.writeFile(DATA_PATH, newData, 'utf8');

  if (updated === 0 && failed > 0) {
    throw new Error(`Citation update failed: all ${failed} lookups failed; no citation data was changed.`);
  }
  if (failed > 0) {
    console.warn(`::warning title=Partial citation update::${failed} citation lookups failed; successful counts were still updated.`);
  }
  console.log('Updated citation counts.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
