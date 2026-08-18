/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Brunswick section breaks + Section Metadata.
 *
 * The homepage template defines 8 sections (page-templates.json). This inserts a
 * section break (<hr>) before each non-first section and a Section Metadata block
 * for each section that carries a `style`.
 *
 * Section boundary selectors come directly from payload.template.sections (already
 * DOM-verified during page analysis). Because a section boundary is often the exact
 * element a block parser replaces, breaks are inserted in beforeTransform (while all
 * section elements still exist) using a temporary marker <hr>, and the metadata blocks
 * are anchored to that marker in afterTransform. See generate-import-transformer.md.
 */
const SECTION_MARKER_ATTR = 'data-excat-section-id';

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no leading break / metadata needed
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match on this page — skip, never guess a replacement

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have run and may have replaced section elements. Anchor each styled
    // section's Section Metadata block to whichever still exists: the marker <hr>
    // placed above, or (first section, no marker inserted) the original element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
