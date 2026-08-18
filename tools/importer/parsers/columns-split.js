/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-split. Base block: columns.
 * Source: https://www.brunswick.com/  (section ".module.row-stock-article" → ".row-stock-article .row")
 * Generated: 2026-08-13
 *
 * Structure (from library-description.txt): Columns block. First row = block name,
 *   second row = the columns. Here: 1 content row with 2 cells →
 *   [ stock/investor panel | featured-article panel ].
 * xwalk (hinting.md Rule 4): Columns blocks do NOT use field:comment hints — only
 *   default content in the cells. No field hints are emitted.
 *
 * Selectors validated against migration-work/block-context/columns-split/source.html:
 *   :scope > .col-lg-5 .stock-info  → left panel: stock/investor box
 *   :scope > .col-lg-7 .news-block  → right panel: featured article
 * Fallback to direct column children if inner wrappers are absent.
 */
export default function parse(element, { document }) {
  const columns = Array.from(element.querySelectorAll(':scope > [class*="col-"]'));

  let leftPanel = element.querySelector('.stock-info');
  let rightPanel = element.querySelector('.news-block');

  // Fallback: use the direct column children's contents.
  if (!leftPanel && columns[0]) leftPanel = columns[0];
  if (!rightPanel && columns[1]) rightPanel = columns[1];

  // Empty-block guard.
  if (!leftPanel && !rightPanel) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Columns block: single content row with 2 cells (no field hints).
  const leftCell = leftPanel || document.createElement('div');
  const rightCell = rightPanel || document.createElement('div');
  const cells = [[leftCell, rightCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-split', cells });
  element.replaceWith(block);
}
