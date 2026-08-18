/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsArticleParser from './parsers/cards-article.js';
import carouselLogosParser from './parsers/carousel-logos.js';
import carouselShowcaseParser from './parsers/carousel-showcase.js';
import columnsSplitParser from './parsers/columns-split.js';
import heroBannerParser from './parsers/hero-banner.js';
import tabsGridParser from './parsers/tabs-grid.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/brunswick-cleanup.js';
import sectionsTransformer from './transformers/brunswick-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Brunswick corporate homepage with video hero, ACES innovation carousel, stock/investor + featured article columns, brands tabs directory, news cards, sustainability and careers hero banners, and awards/accolades carousel',
  urls: [
    'https://www.brunswick.com/',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: [
        '.page-banner.home-hero',
        '.module.row-home-sustainability',
        '.module.row-home-careers',
      ],
    },
    {
      name: 'carousel-showcase',
      instances: ['.aces-slider'],
    },
    {
      name: 'columns-split',
      instances: ['.row-stock-article .row'],
    },
    {
      name: 'tabs-grid',
      instances: ['.brands-view'],
    },
    {
      name: 'cards-article',
      instances: ['.news-listing'],
    },
    {
      name: 'carousel-logos',
      instances: ['.accolade-slider'],
    },
  ],
  sections: [
    {
      id: 'rc2',
      name: 'Video Hero',
      selector: '.page-banner.home-hero',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'rc3',
      name: 'ACES Innovation',
      selector: '.module.row-home-aces',
      style: 'dark',
      blocks: ['carousel-showcase'],
      defaultContent: ['.row-home-aces .text-area'],
    },
    {
      id: 'rc4',
      name: 'Stock and Featured Article',
      selector: '.module.row-stock-article',
      style: 'light',
      blocks: ['columns-split'],
      defaultContent: [],
    },
    {
      id: 'rc5',
      name: 'Brands Directory',
      selector: '.module.module-brands-tabs',
      style: 'light',
      blocks: ['tabs-grid'],
      defaultContent: ['.module-brands-tabs .module-header'],
    },
    {
      id: 'rc6',
      name: 'In the News',
      selector: '.module.row-home-news-alt',
      style: 'light',
      blocks: ['cards-article'],
      defaultContent: ['.row-home-news-alt .text.center', '.row-home-news-alt .link-wrapper.center'],
    },
    {
      id: 'rc7',
      name: 'Sustainability Banner',
      selector: '.module.row-home-sustainability',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'rc8',
      name: 'Careers Banner',
      selector: '.module.row-home-careers',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'rc9',
      name: 'Awards and Recognition',
      selector: '.module.module-careers-accolades',
      style: 'accent',
      blocks: ['carousel-logos'],
      defaultContent: ['.module-careers-accolades .module-header'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'cards-article': cardsArticleParser,
  'carousel-logos': carouselLogosParser,
  'carousel-showcase': carouselShowcaseParser,
  'columns-split': columnsSplitParser,
  'hero-banner': heroBannerParser,
  'tabs-grid': tabsGridParser,
};

// TRANSFORMER REGISTRY
// Section transformer runs after cleanup; only include when template has 2+ sections.
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform (typically document.body or main)
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    //    Skip elements already replaced by a prior parser (detached from DOM)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (full localized path without extension).
    //    Map the root/homepage URL to `/index` — a `/` pathname becomes '' after
    //    trailing-slash stripping, which crashes the bundled importer.
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
