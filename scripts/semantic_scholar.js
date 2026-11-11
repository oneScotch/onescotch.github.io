import axios from 'axios';

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_REQUEST_ATTEMPTS = 5;
const MAX_RETRY_DELAY_MS = 120_000;

function retryAfterMs(value, now) {
  if (value === undefined || value === null || value === '') return 0;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - now) : 0;
}

// One client is shared by batch requests and title lookups, including retries.
export function createSemanticScholarRequest({
  apiKey = process.env.SEMANTIC_SCHOLAR_API_KEY,
  delayMs = process.env.SEMANTIC_SCHOLAR_DELAY_MS,
  request = axios,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  now = Date.now,
  warn = console.warn,
} = {}) {
  let activeKey = apiKey?.trim() || undefined;
  const configuredDelay = Number(delayMs);
  const minimumDelay = delayMs !== undefined && delayMs !== ''
    && Number.isFinite(configuredDelay) && configuredDelay >= 0
    ? configuredDelay
    : 1500;
  let nextRequestAt = 0;
  let deferredError;

  return async function semanticScholarRequest(config) {
    if (deferredError) throw deferredError;
    for (let attempt = 1; attempt <= MAX_REQUEST_ATTEMPTS; attempt += 1) {
      const wait = Math.max(0, nextRequestAt - now());
      if (wait > 0) await sleep(wait);

      try {
        return await request({
          ...config,
          headers: activeKey ? { 'x-api-key': activeKey } : undefined,
          timeout: REQUEST_TIMEOUT_MS,
        });
      } catch (error) {
        const status = error.response?.status ?? null;
        if ((status === 401 || status === 403) && activeKey) {
          activeKey = undefined;
          attempt -= 1;
          warn('::warning title=Semantic Scholar API key rejected::Retrying without the configured API key. Replace or remove the SEMANTIC_SCHOLAR_API_KEY secret.');
          continue;
        }

        const retryable = status === null || status === 429 || status >= 500;
        if (!retryable || attempt === MAX_REQUEST_ATTEMPTS) throw error;

        // The public pool is shared, so 429s need a longer recovery window.
        const backoff = (status === 429 ? 15_000 : 2000) * (2 ** (attempt - 1));
        const retryDelay = Math.max(backoff, retryAfterMs(error.response?.headers?.['retry-after'], now()));
        if (retryDelay > MAX_RETRY_DELAY_MS) {
          // Never shorten a server-requested delay and retry too early.
          warn(`Semantic Scholar requested a ${retryDelay}ms retry delay; stopping further requests for this run instead of retrying before that time.`);
          deferredError = error;
          throw error;
        }
        warn(`Semantic Scholar request failed (${status ?? error.code ?? 'network error'}); retrying in ${retryDelay}ms (attempt ${attempt + 1}/${MAX_REQUEST_ATTEMPTS}).`);
        nextRequestAt = now() + retryDelay;
      } finally {
        nextRequestAt = Math.max(nextRequestAt, now() + minimumDelay);
      }
    }
  };
}
