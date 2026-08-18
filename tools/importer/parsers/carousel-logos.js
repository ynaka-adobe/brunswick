/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-logos. Base block: carousel (container).
 * Source: https://www.brunswick.com/  (section ".module.module-careers-accolades" → ".accolade-slider")
 * Generated: 2026-08-13
 *
 * Structure (from library-description.txt): container block, one row per slide,
 *   2 cells per row → [ image | text ]. Model `carousel-logos-item`:
 *   media_image (reference) + media_imageAlt (collapsed Alt → no hint) + content_text (richtext).
 * xwalk field hints (hinting.md): field:media_image on image cell, field:content_text on text cell.
 *
 * Selectors validated against migration-work/block-context/carousel-logos/source.html:
 *   .accolade-slide          → one per slide; each holds a single <a> carrying img + caption <p>
 *   img.center-image, img    → badge/logo image
 *   p                        → caption text (e.g. "Minneapolis NMMA Award / Innovation Awards")
 *   a[href]                  → slide link (kept in text cell so the CTA/href is preserved)
 * NOTE: slick duplicates slides as ".slick-cloned"; those are excluded to avoid duplicates.
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
  // Real slides only — exclude slick clones (they duplicate content).
  let slides = Array.from(element.querySelectorAll('.slick-slide:not(.slick-cloned) .accolade-slide'));
  if (!slides.length) slides = Array.from(element.querySelectorAll('.accolade-slide'));

  const cells = [];
  const seen = new Set();

  slides.forEach((slide) => {
    const link = slide.querySelector('a[href]');
    const img = slide.querySelector('img');
    // caption paragraph(s) — kept out of the image cell
    const caption = slide.querySelector('p');

    const src = img && img.getAttribute('src');
    if (src && seen.has(src)) return; // dedupe any residual repeats
    if (src) seen.add(src);

    if (!img && !caption) return;

    // Text cell: caption wrapped in the slide's link so the href is retained.
    const textNodes = [];
    if (link && (caption || !img)) {
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href') || '');
      if (caption) a.appendChild(caption);
      else a.textContent = (link.textContent || '').trim();
      textNodes.push(a);
    } else if (caption) {
      textNodes.push(caption);
    }

    const imageCell = fieldCell(document, [['media_image', img]]);
    const textCell = fieldCell(document, [['content_text', textNodes]]);
    cells.push([imageCell, textCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-logos', cells });
  element.replaceWith(block);
}
