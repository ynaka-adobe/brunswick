/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base block: hero.
 * Source: https://www.brunswick.com/  — 3 instances:
 *   ".page-banner.home-hero"          (video hero: bg img + video, h2 title, p, CTA)
 *   ".module.row-home-sustainability" (bg img, h2 title, p's, no CTA)
 *   ".module.row-home-careers"        (bg img, h2 title, p, CTA)
 * Generated: 2026-08-13
 *
 * Structure (from library-description.txt): 1 column, exactly 3 rows —
 *   row 1 = block name, row 2 = Background Image (optional), row 3 = text
 *   (Title + Subheading + optional CTA). Never more than 3 rows.
 * Model `hero-banner`: image (richtext), imageAlt (collapsed Alt → no hint), text (richtext).
 * xwalk field hints (hinting.md): field:image on the image row, field:text on the text row.
 *   imageAlt is a collapsed suffix → alt stays on the <img>, no separate hint.
 *
 * Selectors validated against the three source instances (block-context + cleaned.html)
 * and the live DOM (via Playwright):
 *   :scope > img                         → background image in scraped cleaned.html
 *   inline style="background: url(...)"  → background image on the LIVE DOM (the <img> is
 *                                          only materialized by the scraper; at import time
 *                                          the bg is an inline-style url). Both are handled.
 *   .text, .content-inner, .wrapper.text → text container holding headings/paras/CTA
 *   h1:not(.sr-only), h2, h3             → title (h1.sr-only in home-hero is screen-reader
 *                                          only; the visible headline is the <h2>)
 *   p (non-empty, not .hero-scroll)      → subheading paragraphs
 *   a.btn, .btn-wrapper a                → CTA (optional)
 */

// Pull the first url(...) from an inline background/background-image style.
function bgUrlFromStyle(el) {
  if (!el) return null;
  const style = el.getAttribute('style') || '';
  const m = style.match(/background(?:-image)?\s*:[^;]*url\((['"]?)([^'")]+)\1\)/i);
  return m ? m[2].trim() : null;
}

function fieldRow(document, name, nodes) {
  const list = (Array.isArray(nodes) ? nodes : [nodes]).filter(Boolean);
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(` field:${name} `));
  list.forEach((n) => frag.appendChild(n));
  return frag;
}

export default function parse(element, { document }) {
  // Background image. In the scraped cleaned.html it is a direct <img> child; on the
  // LIVE DOM (import time) it is an inline "background: url(...)" style. Handle both.
  let bgImage = element.querySelector(':scope > img')
    || element.querySelector('.fullscreen-bg img, .background img');
  if (!bgImage) {
    const bgUrl = bgUrlFromStyle(element);
    if (bgUrl) {
      bgImage = document.createElement('img');
      bgImage.setAttribute('src', bgUrl);
      bgImage.setAttribute('alt', '');
    }
  }

  // Text container — prefer the specific inner wrapper, fall back progressively.
  const textContainer = element.querySelector('.text .media, .wrapper.text, .content-inner, .text-area, .text')
    || element;

  // Title: visible headline. In home-hero the <h1> is .sr-only, so skip it.
  const heading = textContainer.querySelector('h1:not(.sr-only), h2, h3')
    || textContainer.querySelector('h1, h2, h3');

  // Subheading paragraphs (exclude the scroll-indicator paragraph).
  const paras = Array.from(textContainer.querySelectorAll('p'))
    .filter((p) => !p.classList.contains('hero-scroll') && p.textContent.trim().length);

  // CTA link(s) — optional.
  const ctaLinks = Array.from(textContainer.querySelectorAll('a.btn, .btn-wrapper a'))
    .filter((a) => (a.getAttribute('href') || '').trim()
      && !/javascript:void/i.test(a.getAttribute('href') || ''));

  // Empty-block guard.
  if (!heading && !paras.length && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const textNodes = [];
  if (heading) textNodes.push(heading);
  paras.forEach((p) => textNodes.push(p));
  ctaLinks.forEach((a) => textNodes.push(a));

  // Exactly 3 rows (never more): name row is added by createBlock; here we push
  // the image row (always present so the table stays a fixed 3-row shape) and the
  // text row. If no bg image, emit an empty image cell rather than dropping the row.
  const cells = [];
  cells.push([bgImage ? fieldRow(document, 'image', bgImage) : '']);
  cells.push([fieldRow(document, 'text', textNodes)]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
