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
    const response = await axios.get(url);
    return response.data.citationCount || 0;
  } catch (e) {
    console.error(`Failed to fetch for arXiv:${arxivId}:`, e.message || e);
    return null;
  }
}

async function getCitationCountByTitle(title) {
  const q = encodeURIComponent(title);
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${q}&limit=5&fields=title,externalIds,citationCount`;
  try {
    const response = await axios.get(url);
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
    return results[0].citationCount || 0;
  } catch (e) {
    console.error(`Search failed for title: ${title}:`, e.message || e);
    return null;
  }
}

async function main() {
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
    const title = titleMatch ? titleMatch[1] : null;
    const arxivUrl = arxivMatch ? arxivMatch[1] : null;
    const arxivId = arxivUrl ? extractArxivId(arxivUrl) : null;
    blocks.push({ fullBlock, title, arxivId });
  }

  // Delay between API requests to avoid rate limiting.
  const DELAY_MS = Number(process.env.SEMANTIC_SCHOLAR_DELAY_MS) || 1000;
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  for (const b of blocks) {
    let count = null;
    if (b.arxivId) {
      count = await getCitationCount(b.arxivId);
    } else if (b.title) {
      count = await getCitationCountByTitle(b.title);
    }
    if (count === null) {
      await sleep(DELAY_MS);
      continue;
    }
    const newBlock = b.fullBlock.replace(/citations:\s*\d+/, `citations: ${count}`);
    publicationsStr = publicationsStr.replace(b.fullBlock, newBlock);
    await sleep(DELAY_MS);
  }

  const newData = data.replace(/export const publications = \[[\s\S]*?\n\];/, `export const publications = [${publicationsStr}\n];`);
  await fs.promises.writeFile(DATA_PATH, newData, 'utf8');
  console.log('Updated citation counts.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
