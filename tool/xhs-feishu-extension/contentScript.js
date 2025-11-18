const XHS_SELECTORS = [
  '[data-id]',
  '[data-note-id]',
  '[data-item-id]',
  'a[href*="goods" i]',
  'a[href*="product" i]',
];

const cache = {
  records: [],
  lastUpdated: 0,
};

function collectProducts() {
  const nodes = new Set();
  XHS_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => nodes.add(node));
  });

  const results = [];
  const seen = new Set();

  nodes.forEach((node) => {
    const result = pickFromNode(node);
    if (!result) return;
    if (seen.has(result.productId)) return;
    seen.add(result.productId);
    results.push(result);
  });

  cache.records = results;
  cache.lastUpdated = Date.now();
  return results;
}

function pickFromNode(node) {
  const productId = findProductId(node);
  if (!productId) return null;
  const cover = findCover(node);
  if (!cover) return null;
  const title = getTitle(node);
  const price = getPrice(node);
  return { productId, cover, title, price, sourceUrl: getLink(node) };
}

function findProductId(node) {
  const attrs = ['data-item-id', 'data-id', 'data-note-id', 'data-spu-id'];
  for (const attr of attrs) {
    const value = node.getAttribute?.(attr);
    if (value) return value.trim();
  }

  const dataset = node.dataset || {};
  for (const value of Object.values(dataset)) {
    if (typeof value === 'string' && /\d{6,}/.test(value)) {
      return value;
    }
  }

  if (node.href) {
    const match = node.href.match(/(product|item|goods)[^\d]*(\d{6,})/i);
    if (match) return match[2];
  }

  const closestLink = node.closest?.('a[href]');
  if (closestLink) {
    const match = closestLink.href.match(/(product|item|goods)[^\d]*(\d{6,})/i);
    if (match) return match[2];
  }

  return null;
}

function findCover(node) {
  const target = node.querySelector?.('img[src]');
  if (target?.src) {
    return normalizeImage(target.src);
  }
  if (node.src) {
    return normalizeImage(node.src);
  }
  return null;
}

function getTitle(node) {
  const titleNode =
    node.querySelector?.('[title]') ||
    node.querySelector?.('h1,h2,h3,h4,h5') ||
    node.querySelector?.('.title');
  return titleNode?.innerText?.trim() || '';
}

function getPrice(node) {
  const priceNode =
    node.querySelector?.('[class*="price" i]') ||
    node.querySelector?.('[data-price]');
  const raw = priceNode?.innerText || priceNode?.dataset?.price;
  return raw ? raw.replace(/[^\d.,]/g, '') : '';
}

function getLink(node) {
  const link = node.href || node.closest?.('a[href]')?.href;
  return link || location.href;
}

function normalizeImage(url) {
  return url.split('?')[0];
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'COLLECT_PRODUCTS') {
    const data = collectProducts();
    sendResponse({ ok: true, data });
    return true;
  }

  if (message?.type === 'READ_CACHE') {
    sendResponse({ ok: true, data: cache });
    return true;
  }

  return false;
});
