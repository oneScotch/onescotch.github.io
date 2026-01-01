// Node.js script to update citation counts in client/src/lib/data.ts using Semantic Scholar API
// Usage: node scripts/update_citations.js

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, '../client/src/lib/data.ts');

function extractArxivId(url) {
  const match = url.match(/arxiv\.org\/abs\/([^\s\/]+)(v\d+)?/);
  return match ? match[1] : null;
}

async function getCitationCount(arxivId) {
  const url = `https://api.semanticscholar.org/graph/v1/paper/arXiv:${arxivId}?fields=citationCount`;
  try {
    const response = await axios.get(url, {
      headers: process.env.SEMANTIC_SCHOLAR_API_KEY
        ? { 'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY }
        : undefined,
    });
    return { count: response.data.citationCount || 0 };
  } catch (e) {
    const status = e.response?.status || null;
    return { count: null, status, error: e.message || String(e) };
  }
}

async function getCitationCountByTitle(title) {
  const q = encodeURIComponent(title);
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${q}&limit=5&fields=title,externalIds,citationCount`;
  try {
    const response = await axios.get(url, {
      headers: process.env.SEMANTIC_SCHOLAR_API_KEY
        ? { 'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY }
        : undefined,
    });
    const results = response.data.data || [];
    if (!results.length) return null;
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const target = normalize(title);
    // Try to find exact/close match
    for (const r of results) {
      if (!r.title) continue;
      if (normalize(r.title) === target || normalize(r.title).startsWith(target) || target.startsWith(normalize(r.title))) {
        return r.citationCount || 0;
      }
    }
    // fallback to first result
    return { count: results[0].citationCount || 0 };
  } catch (e) {
    const status = e.response?.status || null;
    return { count: null, status, error: e.message || String(e) };
  }
}

async function main() {
  if (!process.env.SEMANTIC_SCHOLAR_API_KEY) {
    console.warn('Warning: SEMANTIC_SCHOLAR_API_KEY not set — requests may be rate-limited.');
  }
  let data = await fs.promises.readFile(DATA_PATH, 'utf8');
  const pubArrayMatch = data.match(/export const publications = \[([\s\S]*?)\n\];/);
  if (!pubArrayMatch) throw new Error('Publications array not found');
  let publicationsStr = pubArrayMatch[1];

  const pubRegex = /{([\s\S]*?)\}\s*,?/g;
  let match;
  const blocks = [];
  while ((match = pubRegex.exec(publicationsStr)) !== null) {
    const fullBlock = match[0].endsWith(',') ? match[0].slice(0, -1) : match[0];
    const blockBody = match[1];
    const titleMatch = blockBody.match(/title:\s*"([^"]+)"/);
    const arxivMatch = blockBody.match(/arxiv:\s*"([^"]+)"/);
    const idMatch = blockBody.match(/id:\s*(\d+)/);
    const citationsMatch = blockBody.match(/citations:\s*(\d+)/);
    const title = titleMatch ? titleMatch[1] : null;
    const arxivUrl = arxivMatch ? arxivMatch[1] : null;
    const arxivId = arxivUrl ? extractArxivId(arxivUrl) : null;
    const id = idMatch ? Number(idMatch[1]) : null;
    const oldCitations = citationsMatch ? Number(citationsMatch[1]) : null;
    blocks.push({ fullBlock, title, arxivId, id, oldCitations });
  }

  // Delay between API requests to avoid rate limiting.
  const DELAY_MS = Number(process.env.SEMANTIC_SCHOLAR_DELAY_MS) || 1000;
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const statuses = [];
  let updated = 0, skipped = 0, failed = 0, rateLimited = 0;
  for (const b of blocks) {
    let res = { count: null, status: null, error: null };
    let method = b.arxivId ? 'arXiv' : (b.title ? 'title' : 'none');
    if (b.arxivId) {
      res = await getCitationCount(b.arxivId);
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
      await sleep(DELAY_MS);
      continue;
    }
    const newBlock = b.fullBlock.replace(/citations:\s*\d+/, `citations: ${res.count}`);
    publicationsStr = publicationsStr.replace(b.fullBlock, newBlock);
    const entry = { id: b.id, title: b.title, method, old: b.oldCitations, new: res.count, status: 'updated', statusCode: null, time: timestamp };
    statuses.push(entry);
    updated += 1;
    console.log(`UPDATED [${entry.id ?? '-'}] ${entry.title ?? '<no title>'} via ${entry.method}: ${entry.old ?? 0} -> ${entry.new}`);
    await sleep(DELAY_MS);
  }

  // write status file
  try {
    const STATUS_PATH = path.join(__dirname, 'citation_status.json');
    await fs.promises.writeFile(STATUS_PATH, JSON.stringify({ updated, failed, rateLimited, items: statuses }, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write status file:', e.message || e);
  }

  const newData = data.replace(/export const publications = \[[\s\S]*?\n\];/, `export const publications = [${publicationsStr}\n];`);
  await fs.promises.writeFile(DATA_PATH, newData, 'utf8');
  console.log('Updated citation counts.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
