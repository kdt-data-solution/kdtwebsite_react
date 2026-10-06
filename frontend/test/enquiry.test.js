import test from 'node:test';
import assert from 'node:assert/strict';
import { enquiryContext, enquiryUrl } from '../src/utils/enquiry.js';

test('product links preserve names and origin pages across navigation', () => {
  const url = new URL(enquiryUrl('product', 'Axis & team', '/product-construct.html'), 'https://example.test');
  assert.equal(url.hash, '#contact');
  assert.deepEqual(enquiryContext(url.search, url.pathname), {
    type: 'product', topic: 'Axis & team', sourcePage: '/product-construct.html',
  });
});

test('service pages identify their enquiry without query parameters', () => {
  assert.deepEqual(enquiryContext('', '/services-data.html', 'data'), {
    type: 'service', topic: 'Data Science and Analytics', sourcePage: '/services-data.html',
  });
});

test('webinar links override a service page default', () => {
  assert.deepEqual(enquiryContext('?enquiry=webinar&topic=KDT+webinar&source=%2F', '/services.html', 'architecture'), {
    type: 'webinar', topic: 'KDT webinar', sourcePage: '/',
  });
});

test('invalid link context falls back to the page and stays within API field limits', () => {
  const search = new URLSearchParams({ enquiry: 'unknown', topic: 'x'.repeat(250) + '\n', source: '//example.test' });
  const context = enquiryContext(`?${search}`, '/');
  assert.equal(context.type, 'general');
  assert.equal(context.topic.length, 200);
  assert.equal(context.sourcePage, '/');
});
