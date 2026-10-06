const TYPES = ['general', 'service', 'product', 'webinar'];

export function enquiryUrl(type, topic, sourcePage, base = '/') {
  const params = new URLSearchParams({ enquiry: type, topic, source: sourcePage });
  return `${base}?${params}#contact`;
}

export function enquiryContext(search, pathname, serviceKey) {
  const params = new URLSearchParams(search);
  const serviceNames = {
    architecture: 'Architecture and Engineering',
    data: 'Data Science and Analytics',
    software: 'Software Development',
  };
  const requestedType = params.get('enquiry');
  const type = TYPES.includes(requestedType) ? requestedType : (serviceKey ? 'service' : 'general');
  const topic = (params.get('topic') || serviceNames[serviceKey] || '').replace(/[\r\n]/g, ' ').slice(0, 200);
  const source = params.get('source') || pathname;
  const sourcePage = source.startsWith('/') && !source.startsWith('//') && !/[\r\n]/.test(source)
    ? source.slice(0, 500)
    : pathname;
  return { type, topic, sourcePage };
}
