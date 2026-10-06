import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { getPublicJson } from '../src/utils/publicJson.js';

function waitForAbort(signal) {
  return new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
  });
}

test('public JSON returns the parsed body and clears its abort timer after success', async (t) => {
  const body = { items: [{ title: 'Architecture' }] };
  let requestSignal;
  t.mock.method(globalThis, 'fetch', async (url, { signal }) => {
    assert.equal(url, '/api/services');
    requestSignal = signal;
    return { ok: true, json: async () => body };
  });
  assert.deepEqual(await getPublicJson('/api/services', 10), body);
  await delay(25);
  assert.equal(requestSignal.aborted, false);
});

test('HTTP failure rejects without reading the body and clears its timer', async (t) => {
  let requestSignal;
  let bodyRead = false;
  t.mock.method(globalThis, 'fetch', async (url, { signal }) => {
    requestSignal = signal;
    return {
      ok: false,
      status: 503,
      async json() { bodyRead = true; },
    };
  });
  await assert.rejects(getPublicJson('/api/services', 10), {
    message: 'Request failed (503)',
    status: 503,
  });
  assert.equal(bodyRead, false);
  await delay(25);
  assert.equal(requestSignal.aborted, false);
});

test('stalled response headers abort and reject within the request timeout', { timeout: 1000 }, async (t) => {
  let requestSignal;
  t.mock.method(globalThis, 'fetch', (url, { signal }) => {
    requestSignal = signal;
    return waitForAbort(signal);
  });
  await assert.rejects(getPublicJson('/api/services', 5), { name: 'AbortError' });
  assert.equal(requestSignal.aborted, true);
});

test('stalled JSON body remains subject to the request timeout', { timeout: 1000 }, async (t) => {
  let requestSignal;
  let bodyRead = false;
  t.mock.method(globalThis, 'fetch', async (url, { signal }) => {
    requestSignal = signal;
    return {
      ok: true,
      json() {
        bodyRead = true;
        return waitForAbort(signal);
      },
    };
  });
  await assert.rejects(getPublicJson('/api/services', 5), { name: 'AbortError' });
  assert.equal(bodyRead, true);
  assert.equal(requestSignal.aborted, true);
});
