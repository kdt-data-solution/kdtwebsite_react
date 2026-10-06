import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { setupContactNavigation } from '../src/utils/contactNavigation.js';

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

function browser({ url = 'https://kdt.test/', ready = Promise.resolve(), fonts = Promise.resolve(), reducedMotion = false } = {}) {
  const win = new EventTarget();
  const doc = new EventTarget();
  const scrolls = [];
  const focus = [];
  const context = [];
  const history = [];
  const frames = [];
  win.location = new URL(url);
  win.history = {
    pushState(state, title, next) {
      history.push(String(next));
      win.location = new URL(next);
    },
  };
  win.matchMedia = () => ({ matches: reducedMotion });
  win.requestAnimationFrame = (callback) => { frames.push(callback); };
  doc.fonts = { ready: fonts };
  doc.getElementById = (id) => ({
    contact: { scrollIntoView: (options) => scrolls.push(options) },
    'contact-heading': { focus: (options) => focus.push(options) },
  }[id]);
  setupContactNavigation(win, doc, ready, (search) => context.push(search));
  return {
    win, doc, scrolls, focus, context, history, frames,
    paint() {
      for (const callback of frames.splice(0)) callback();
    },
  };
}

function click(page, href, { target = '', download = false, prevented = false, ...eventOptions } = {}) {
  const link = {
    href: new URL(href, page.win.location).href,
    target,
    hasAttribute: (name) => name === 'download' && download,
  };
  const event = new Event('click', { cancelable: true });
  Object.defineProperties(event, Object.fromEntries(Object.entries({
    target: { closest: (selector) => selector === 'a[href]' ? link : null },
    button: 0,
    ...eventOptions,
  }).map(([key, value]) => [key, { value }])));
  if (prevented) event.preventDefault();
  page.doc.dispatchEvent(event);
  return event;
}

test('initial contact anchor waits for content and fonts before scrolling', async () => {
  const ready = deferred();
  const fonts = deferred();
  const page = browser({
    url: 'https://kdt.test/?enquiry=product&topic=Demo#contact',
    ready: ready.promise,
    fonts: fonts.promise,
  });
  assert.deepEqual(page.context, ['?enquiry=product&topic=Demo']);
  assert.equal(page.frames.length, 0);
  ready.resolve();
  await settle();
  assert.equal(page.frames.length, 0);
  fonts.resolve();
  await settle();
  assert.deepEqual(page.scrolls, []);
  page.paint();
  assert.deepEqual(page.scrolls, [{ behavior: 'instant' }]);
  assert.deepEqual(page.focus, []);
  assert.deepEqual(page.history, []);
});

test('stalled font readiness still lands on contact after the font deadline', { timeout: 2000 }, async () => {
  const fonts = deferred();
  const page = browser({ url: 'https://kdt.test/#contact', fonts: fonts.promise });
  await settle();
  page.paint();
  assert.deepEqual(page.scrolls, []);
  await delay(1100);
  page.paint();
  assert.deepEqual(page.scrolls, [{ behavior: 'instant' }]);
  assert.deepEqual(page.focus, []);
});

for (const eventName of ['popstate', 'hashchange', 'pageshow']) {
  test(`${eventName} restores contact position and enquiry context`, async () => {
    const page = browser();
    page.win.location = new URL('https://kdt.test/?enquiry=webinar&topic=Training#contact');
    const event = new Event(eventName);
    if (eventName === 'pageshow') Object.defineProperty(event, 'persisted', { value: true });
    page.win.dispatchEvent(event);
    await settle();
    page.paint();
    assert.equal(page.context.at(-1), '?enquiry=webinar&topic=Training');
    assert.deepEqual(page.scrolls, [{ behavior: 'instant' }]);
    assert.deepEqual(page.focus, []);
    assert.deepEqual(page.history, []);
  });
}

test('same-page enquiry link updates history and context, scrolls, and focuses the heading', async () => {
  const page = browser();
  const event = click(page, '/?enquiry=service&topic=Architecture&source=%2Fservices#contact', { target: '_self' });
  assert.equal(event.defaultPrevented, true);
  assert.deepEqual(page.history, ['https://kdt.test/?enquiry=service&topic=Architecture&source=%2Fservices#contact']);
  assert.equal(page.context.at(-1), '?enquiry=service&topic=Architecture&source=%2Fservices');
  await settle();
  page.paint();
  assert.deepEqual(page.scrolls, [{ behavior: 'smooth' }]);
  assert.deepEqual(page.focus, [{ preventScroll: true }]);
});

test('plain fragment preserves the current query and does not duplicate history on repeated clicks', async () => {
  const page = browser({ url: 'https://kdt.test/?enquiry=product&topic=Demo' });
  assert.equal(click(page, '#contact').defaultPrevented, true);
  await settle();
  page.paint();
  assert.equal(page.context.at(-1), '?enquiry=product&topic=Demo');
  assert.deepEqual(page.history, ['https://kdt.test/?enquiry=product&topic=Demo#contact']);
  assert.equal(click(page, '#contact').defaultPrevented, true);
  await settle();
  page.paint();
  assert.equal(page.history.length, 1);
  assert.equal(page.focus.length, 2);
});

test('a plain contact URL clears previous enquiry context', async () => {
  const page = browser({ url: 'https://kdt.test/?enquiry=product&topic=Demo' });
  click(page, '/#contact');
  await settle();
  page.paint();
  assert.equal(page.context.at(-1), '');
  assert.equal(page.win.location.href, 'https://kdt.test/#contact');
  assert.equal(page.focus.length, 1);
});

const untouchedLinks = [
  ['control click', '#contact', { ctrlKey: true }],
  ['command click', '#contact', { metaKey: true }],
  ['shift click', '#contact', { shiftKey: true }],
  ['alt click', '#contact', { altKey: true }],
  ['middle click', '#contact', { button: 1 }],
  ['new tab', '#contact', { target: '_blank' }],
  ['named frame', '#contact', { target: 'other-frame' }],
  ['download', '#contact', { download: true }],
  ['external URL', 'https://other.test/#contact', {}],
  ['cross-page URL', '/products/#contact', {}],
  ['other anchor', '#services', {}],
  ['already prevented', '#contact', { prevented: true }],
];
for (const [label, href, options] of untouchedLinks) {
  test(`${label} keeps the browser's default navigation`, async () => {
    const page = browser();
    const event = click(page, href, options);
    await settle();
    page.paint();
    assert.equal(event.defaultPrevented, Boolean(options.prevented));
    assert.equal(page.win.location.href, 'https://kdt.test/');
    assert.deepEqual(page.history, []);
    assert.deepEqual(page.context, ['']);
    assert.deepEqual(page.scrolls, []);
    assert.deepEqual(page.focus, []);
  });
}

for (const [surface, eventName, key] of [
  ['win', 'wheel'], ['win', 'touchstart'], ['doc', 'pointerdown'],
  ...['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Tab'].map((key) => ['doc', 'keydown', key]),
]) {
  test(`${eventName}${key ? ` ${key}` : ''} cancels a deferred anchor jump`, async () => {
    const ready = deferred();
    const page = browser({ url: 'https://kdt.test/#contact', ready: ready.promise });
    const event = new Event(eventName);
    if (key) Object.defineProperty(event, 'key', { value: key });
    page[surface].dispatchEvent(event);
    ready.resolve();
    await settle();
    page.paint();
    assert.deepEqual(page.scrolls, []);
    assert.deepEqual(page.focus, []);
  });
}

test('interaction after the frame is queued still cancels the jump', async () => {
  const page = browser({ url: 'https://kdt.test/#contact' });
  await settle();
  page.win.dispatchEvent(new Event('wheel'));
  page.paint();
  assert.deepEqual(page.scrolls, []);
});

test('ordinary pageshow does not restart a jump cancelled during initial loading', async () => {
  const ready = deferred();
  const page = browser({ url: 'https://kdt.test/#contact', ready: ready.promise });
  page.win.dispatchEvent(new Event('wheel'));
  const event = new Event('pageshow');
  Object.defineProperty(event, 'persisted', { value: false });
  page.win.dispatchEvent(event);
  ready.resolve();
  await settle();
  page.paint();
  assert.deepEqual(page.scrolls, []);
  assert.deepEqual(page.context, ['']);
});

test('interaction cancels deferred link scrolling and focus while retaining the chosen URL', async () => {
  const ready = deferred();
  const page = browser({ ready: ready.promise });
  click(page, '/?enquiry=product&topic=Demo#contact');
  page.doc.dispatchEvent(new Event('pointerdown'));
  ready.resolve();
  await settle();
  page.paint();
  assert.equal(page.win.location.href, 'https://kdt.test/?enquiry=product&topic=Demo#contact');
  assert.equal(page.context.at(-1), '?enquiry=product&topic=Demo');
  assert.deepEqual(page.scrolls, []);
  assert.deepEqual(page.focus, []);
});

test('navigation away while loading cancels the deferred jump', async () => {
  const ready = deferred();
  const page = browser({ url: 'https://kdt.test/#contact', ready: ready.promise });
  page.win.location = new URL('https://kdt.test/#services');
  page.win.dispatchEvent(new Event('hashchange'));
  ready.resolve();
  await settle();
  page.paint();
  assert.deepEqual(page.scrolls, []);
  assert.deepEqual(page.focus, []);
});

test('reduced motion scrolls instantly while retaining link focus', async () => {
  const page = browser({ reducedMotion: true });
  click(page, '#contact');
  await settle();
  page.paint();
  assert.deepEqual(page.scrolls, [{ behavior: 'instant' }]);
  assert.deepEqual(page.focus, [{ preventScroll: true }]);
});
