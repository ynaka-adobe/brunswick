/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Brunswick site-wide cleanup.
 * Removes non-authorable global chrome (nav, footer, cookie banner, skip link,
 * mobile-only duplicate hero) so the import contains only authorable page content.
 *
 * All selectors verified against migration-work/cleaned.html:
 *   - <a class="... skip-to-content"> (line 3): accessibility skip link
 *   - <nav id="header">               (line 5): global header / main nav / mobile nav / search / stock ticker
 *   - <div class="module row-mobile-header-section dark"> (line 556): mobile-only duplicate of the
 *       Video Hero text block; NOT one of the 8 mapped template sections
 *   - <footer class="has-qmod">        (line 1660): global footer + QuoteMedia attribution
 *   - <div id="onetrust-consent-sdk">  (line 1726): OneTrust cookie consent banner
 *   - <iframe class="ot-text-resize">  (line 2005): OneTrust helper iframe (inside consent sdk)
 *   - <span class="slider-counter">    (aces/accolades sliders): "N/4" / "N/3" position
 *       counters — a jQuery-slick runtime affordance; the EDS carousel blocks render
 *       their own controls, so these would otherwise land as orphaned default content.
 *   - <p class="slick-arrow">          (aces/accolades sliders): "west"/"east" prev/next
 *       arrow labels — same slick runtime chrome, not authorable content.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent overlay + slick-slider runtime chrome — remove before block
    // parsing so they can't interfere or leak into the parsed carousel blocks.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.slider-counter',
      '.slick-arrow',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome and leftover helper elements.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-to-content',
      'nav#header',
      '.module.row-mobile-header-section',
      'footer',
      'iframe',
      'noscript',
      'link',
      'style',
    ]);
  }
}
