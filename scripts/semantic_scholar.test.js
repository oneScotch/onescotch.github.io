import test from 'node:test';
import assert from 'node:assert/strict';
import { createSemanticScholarRequest } from './semantic_scholar.js';

function httpError(status, retryAfter) {
  return Object.assign(new Error(`HTTP ${status}`), {
    response: { status, headers: { 'retry-after': retryAfter } },
  });
}

function clientWithResponses(responses, options = {}) {
  let clock = Date.UTC(2026, 0, 1);
  const calls = [], delays = [], warnings = [];
  const request = createSemanticScholarRequest({
    apiKey: '',
    delayMs: 0,
    ...options,
    now: () => clock,
    sleep: async (ms) => { delays.push(ms); clock += ms; },
    warn: (message) => warnings.push(message),
    request: async (config) => {
      calls.push(config);
      assert.ok(responses.length, 'Unexpected extra API request');
      const result = responses.shift();
      if (result instanceof Error) throw result;
      return result;
    },
  });
  return { request, calls, delays, warnings };
}

for (const status of [401, 403]) {
  test(`rejected key (${status}) is removed for retries and later requests`, async () => {
    const client = clientWithResponses([
      httpError(status), httpError(429), { data: [17] }, { data: [18] },
    ], { apiKey: ' invalid-key ', delayMs: 1500 });

    assert.deepEqual(await client.request({ method: 'post', data: { ids: ['ARXIV:2603.16870'] } }), { data: [17] });
    assert.deepEqual(await client.request({ method: 'get' }), { data: [18] });
    assert.equal(client.calls[0].headers['x-api-key'], 'invalid-key');
    assert.ok(client.calls.slice(1).every((call) => call.headers === undefined));
    assert.deepEqual(client.delays, [1500, 15_000, 1500]);
    assert.ok(client.warnings.every((warning) => !warning.includes('invalid-key')));
  });
}

test('honors Retry-After seconds instead of truncating them to 30 seconds', async () => {
  const client = clientWithResponses([httpError(429, '60'), { data: [] }]);
  await client.request({});
  assert.deepEqual(client.delays, [60_000]);
});

test('honors an HTTP-date Retry-After header', async () => {
  const client = clientWithResponses([
    httpError(503, 'Thu, 01 Jan 2026 00:01:30 GMT'), { data: [] },
  ]);
  await client.request({});
  assert.deepEqual(client.delays, [90_000]);
});

test('persistent rate limits exhaust bounded retries and still fail', async () => {
  const error = httpError(429);
  const client = clientWithResponses(Array(5).fill(error));
  await assert.rejects(client.request({}), (actual) => actual === error);
  assert.equal(client.calls.length, 5);
  assert.deepEqual(client.delays, [15_000, 30_000, 60_000, 120_000]);
});

test('does not retry too early when Retry-After exceeds the wait budget', async () => {
  const error = httpError(429, '180');
  const client = clientWithResponses([error]);
  await assert.rejects(client.request({}), (actual) => actual === error);
  await assert.rejects(client.request({ url: '/paper/search' }), (actual) => actual === error);
  assert.equal(client.calls.length, 1);
  assert.deepEqual(client.delays, []);
});

test('retries network errors and server errors', async () => {
  const client = clientWithResponses([
    Object.assign(new Error('Connection reset'), { code: 'ECONNRESET' }),
    httpError(503), { data: [] },
  ]);
  await client.request({});
  assert.deepEqual(client.delays, [2000, 4000]);
});

test('does not retry a permanent client error', async () => {
  const error = httpError(404);
  const client = clientWithResponses([error]);
  await assert.rejects(client.request({}), (actual) => actual === error);
  assert.equal(client.calls.length, 1);
  assert.deepEqual(client.delays, []);
});

test('paces batch and title requests through the same client', async () => {
  const client = clientWithResponses([{ data: [] }, { data: [] }], { delayMs: '1500' });
  await client.request({ method: 'post', url: '/paper/batch' });
  await client.request({ method: 'get', url: '/paper/search' });
  assert.deepEqual(client.delays, [1500]);
});
