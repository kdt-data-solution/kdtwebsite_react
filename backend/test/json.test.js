import test from 'node:test';
import assert from 'node:assert/strict';

import { parseJsonList } from '../src/utils/json.js';

test('parseJsonList unwraps repeatedly encoded product JSON', () => {
  const items = [{ label: 'Request a Demo', href: '#contact' }];
  const repeatedlyEncoded = JSON.stringify(JSON.stringify(JSON.stringify(items)));

  assert.deepEqual(parseJsonList(repeatedlyEncoded), items);
});

test('parseJsonList rejects non-list JSON values', () => {
  assert.deepEqual(parseJsonList('{"label":"not a list"}'), []);
  assert.deepEqual(parseJsonList('not json'), []);
});
