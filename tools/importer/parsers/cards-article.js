/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base block: cards (container).
 * Source: https://www.brunswick.com/  (section ".module.row-home-news-alt" → ".news-listing")
 * Generated: 2026-08-13
 *
 * Structure (from library-description.txt): container block, one row per card,
 *   2 cells per row → [ image | text ]. Model `card`: image (reference) + text (richtext).
 * xwalk field hints (hinting.md): field:image on image cell, field:text on text cell.
 *   imageAlt is a collapsed suffix (Alt) → no hint, alt stays on the <img>.
 *
 * Selectors validated against migration-work/block-context/cards-article/source.html:
 *   .content-box            → one per card (main-wrapper + single-wrapper)
 *   .content-box img        → card image (inside a.news-image-mobile > figure)
 *   p.date                  → date line
 *   h3.media-heading        → title (wraps the article link)
 *   a.btn                   → "Read More" CTA
 */

function fieldCell(document, entries) {
  // entries: Array<[fieldName, node|nodes]>. Emits a documentFragment with a
  // "<!-- field:name -->" comment before each field's content (hinting.md Rule 2/4).
  const frag = document.createDocumentFragment();
  entries.forEach(([name, content]) => {
    const nodes = (Array.isArray(content) ? content : [content]).filter(Boolean);
    if (!nodes.length) return;
    frag.appendChild(document.createComment(` field:${name} `));
    nodes.forEach((n) => frag.appendChild(n));
  });
  return frag;
}

export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.content-box'));
  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('img');
    const date = card.querySelector('p.date, .date');
    const heading = card.querySelector('h3.media-heading, h3, h2');
    const cta = card.querySelector('a.btn, .btn-wrapper a');

    // text cell content, in reading order: date, heading, CTA
    const textNodes = [];
    if (date) textNodes.push(date);
    if (heading) textNodes.push(heading);
    if (cta) textNodes.push(cta);

    // Skip a card that has neither image nor text (defensive)
    if (!img && !textNodes.length) return;

    const imageCell = fieldCell(document, [['image', img]]);
    const textCell = fieldCell(document, [['text', textNodes]]);
    cells.push([imageCell, textCell]);
  });

  // Empty-block guard: nothing extractable → unwrap
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
