/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-showcase. Base block: carousel (container).
 * Source: https://www.brunswick.com/  (section ".module.row-home-aces" → ".aces-slider")
 * Generated: 2026-08-13
 *
 * Structure (from library-description.txt): container block, one row per slide,
 *   2 cells per row → [ image | text ]. Model `carousel-showcase-item`:
 *   media_image (reference) + media_imageAlt (collapsed Alt → no hint) + content_text (richtext).
 * xwalk field hints (hinting.md): field:media_image on image cell, field:content_text on text cell.
 *
 * Selectors validated against migration-work/block-context/carousel-showcase/source.html:
 *   .slide-inner .content-inner → one per slide (illustration + heading + description)
 *   .content-inner img          → illustration image
 *   .content-inner h3           → slide title (e.g. "E | Electrification")
 *   .content-inner p            → description
 * NOTE: slick duplicates slides as ".slick-cloned"; excluded to avoid duplicates.
 */

function fieldCell(document, entries) {
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
  let slides = Array.from(element.querySelectorAll('.slick-slide:not(.slick-cloned) .content-inner'));
  if (!slides.length) slides = Array.from(element.querySelectorAll('.content-inner'));

  const cells = [];
  const seen = new Set();

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    const heading = slide.querySelector('h3, h2, h4');
    const desc = slide.querySelector('p');

    // dedupe by heading text in case clones slip past the selector
    const key = (heading && heading.textContent.trim()) || (img && img.getAttribute('src')) || '';
    if (key && seen.has(key)) return;
    if (key) seen.add(key);

    if (!img && !heading && !desc) return;

    const textNodes = [];
    if (heading) textNodes.push(heading);
    if (desc) textNodes.push(desc);

    const imageCell = fieldCell(document, [['media_image', img]]);
    const textCell = fieldCell(document, [['content_text', textNodes]]);
    cells.push([imageCell, textCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-showcase', cells });
  element.replaceWith(block);
}
