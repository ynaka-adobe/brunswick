import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // label the three sections for styling: brand+social, legal links, market-data
  const sections = ['footer-brand', 'footer-legal', 'footer-disclaimer'];
  [...footer.children].forEach((section, i) => {
    if (sections[i]) section.classList.add(sections[i]);
  });

  block.append(footer);
}
