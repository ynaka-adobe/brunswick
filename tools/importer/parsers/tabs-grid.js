/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-grid. Base block: tabs (container).
 * Source: https://www.brunswick.com/  (section ".module.module-brands-tabs" → ".brands-view")
 * Generated: 2026-08-13
 *
 * Structure (from library-description.txt): 2 columns, one row per tab →
 *   [ Tab Label | Tab Content ]. Model `tabs-grid-item`:
 *   title (tab label), content_heading, content_headingType (collapsed Type → no hint),
 *   content_image (reference), content_richtext (richtext).
 * xwalk field hints (hinting.md): field:title on the label cell; field:content_richtext
 *   on the content cell. content_heading/content_image are optional and unused here (the
 *   tab content is a grid of brand-logo links → all rich text/links in one content cell).
 *   Grouped content_* fields share the content cell.
 *
 * Selectors validated against migration-work/block-context/tabs-grid/source.html:
 *   ul.nav-tabs > li.brand-tab            → tab labels (Marine Propulsion, Parts &
 *                                            Accessories, Boats, Business Acceleration)
 *   li .text-wrapper                      → label text
 *   .brands-view__main-tabs-content > .tab-pane  → tab content panes (aligned to labels)
 *   a.brand-item                          → brand-logo links (each wraps the logo <img>)
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
  // Top-level tab labels (exclude nested sub-tab lists).
  const labels = Array.from(element.querySelectorAll('ul.nav-tabs > li.brand-tab'));
  // Top-level content panes, aligned to the labels by order.
  const panes = Array.from(
    element.querySelectorAll('.brands-view__main-tabs-content > .tab-pane'),
  );

  const cells = [];

  labels.forEach((li, idx) => {
    const labelText = (li.querySelector('.text-wrapper') || li).textContent.trim();
    const pane = panes[idx];
    if (!pane) return;

    // Clone the whole pane so nested sub-tab labels (e.g. "Navico Group / Parts /
    // Distribution" under Parts & Accessories) are preserved alongside the brand
    // grid. Strip only decorative helper spans (external-link icon, glyphicon) so
    // the logo images + hrefs + sub-tab labels remain.
    const paneClone = pane.cloneNode(true);
    paneClone.querySelectorAll('span.icon, span.glyphicon, .icon--external-link').forEach((s) => s.remove());
    const contentNodes = Array.from(paneClone.childNodes);

    if (!labelText && !contentNodes.length) return;

    // Label cell: the tab title (field:title).
    const labelNode = document.createElement('p');
    labelNode.textContent = labelText;
    const labelCell = fieldCell(document, [['title', labelNode]]);

    // Content cell: sub-tab labels + the grid of brand links (field:content_richtext).
    const contentCell = fieldCell(document, [['content_richtext', contentNodes]]);

    cells.push([labelCell, contentCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-grid', cells });
  element.replaceWith(block);
}
