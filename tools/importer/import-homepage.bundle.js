/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/cards-article.js
  function fieldCell(document2, entries) {
    const frag = document2.createDocumentFragment();
    entries.forEach(([name, content]) => {
      const nodes = (Array.isArray(content) ? content : [content]).filter(Boolean);
      if (!nodes.length) return;
      frag.appendChild(document2.createComment(` field:${name} `));
      nodes.forEach((n) => frag.appendChild(n));
    });
    return frag;
  }
  function parse(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll(".content-box"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img");
      const date = card.querySelector("p.date, .date");
      const heading = card.querySelector("h3.media-heading, h3, h2");
      const cta = card.querySelector("a.btn, .btn-wrapper a");
      const textNodes = [];
      if (date) textNodes.push(date);
      if (heading) textNodes.push(heading);
      if (cta) textNodes.push(cta);
      if (!img && !textNodes.length) return;
      const imageCell = fieldCell(document2, [["image", img]]);
      const textCell = fieldCell(document2, [["text", textNodes]]);
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-logos.js
  function fieldCell2(document2, entries) {
    const frag = document2.createDocumentFragment();
    entries.forEach(([name, content]) => {
      const nodes = (Array.isArray(content) ? content : [content]).filter(Boolean);
      if (!nodes.length) return;
      frag.appendChild(document2.createComment(` field:${name} `));
      nodes.forEach((n) => frag.appendChild(n));
    });
    return frag;
  }
  function parse2(element, { document: document2 }) {
    let slides = Array.from(element.querySelectorAll(".slick-slide:not(.slick-cloned) .accolade-slide"));
    if (!slides.length) slides = Array.from(element.querySelectorAll(".accolade-slide"));
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    slides.forEach((slide) => {
      const link = slide.querySelector("a[href]");
      const img = slide.querySelector("img");
      const caption = slide.querySelector("p");
      const src = img && img.getAttribute("src");
      if (src && seen.has(src)) return;
      if (src) seen.add(src);
      if (!img && !caption) return;
      const textNodes = [];
      if (link && (caption || !img)) {
        const a = document2.createElement("a");
        a.setAttribute("href", link.getAttribute("href") || "");
        if (caption) a.appendChild(caption);
        else a.textContent = (link.textContent || "").trim();
        textNodes.push(a);
      } else if (caption) {
        textNodes.push(caption);
      }
      const imageCell = fieldCell2(document2, [["media_image", img]]);
      const textCell = fieldCell2(document2, [["content_text", textNodes]]);
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-logos", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-showcase.js
  function fieldCell3(document2, entries) {
    const frag = document2.createDocumentFragment();
    entries.forEach(([name, content]) => {
      const nodes = (Array.isArray(content) ? content : [content]).filter(Boolean);
      if (!nodes.length) return;
      frag.appendChild(document2.createComment(` field:${name} `));
      nodes.forEach((n) => frag.appendChild(n));
    });
    return frag;
  }
  function parse3(element, { document: document2 }) {
    let slides = Array.from(element.querySelectorAll(".slick-slide:not(.slick-cloned) .content-inner"));
    if (!slides.length) slides = Array.from(element.querySelectorAll(".content-inner"));
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      const heading = slide.querySelector("h3, h2, h4");
      const desc = slide.querySelector("p");
      const key = heading && heading.textContent.trim() || img && img.getAttribute("src") || "";
      if (key && seen.has(key)) return;
      if (key) seen.add(key);
      if (!img && !heading && !desc) return;
      const textNodes = [];
      if (heading) textNodes.push(heading);
      if (desc) textNodes.push(desc);
      const imageCell = fieldCell3(document2, [["media_image", img]]);
      const textCell = fieldCell3(document2, [["content_text", textNodes]]);
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-showcase", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-split.js
  function parse4(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(':scope > [class*="col-"]'));
    let leftPanel = element.querySelector(".stock-info");
    let rightPanel = element.querySelector(".news-block");
    if (!leftPanel && columns[0]) leftPanel = columns[0];
    if (!rightPanel && columns[1]) rightPanel = columns[1];
    if (!leftPanel && !rightPanel) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leftCell = leftPanel || document2.createElement("div");
    const rightCell = rightPanel || document2.createElement("div");
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function bgUrlFromStyle(el) {
    if (!el) return null;
    const style = el.getAttribute("style") || "";
    const m = style.match(/background(?:-image)?\s*:[^;]*url\((['"]?)([^'")]+)\1\)/i);
    return m ? m[2].trim() : null;
  }
  function fieldRow(document2, name, nodes) {
    const list = (Array.isArray(nodes) ? nodes : [nodes]).filter(Boolean);
    const frag = document2.createDocumentFragment();
    frag.appendChild(document2.createComment(` field:${name} `));
    list.forEach((n) => frag.appendChild(n));
    return frag;
  }
  function parse5(element, { document: document2 }) {
    let bgImage = element.querySelector(":scope > img") || element.querySelector(".fullscreen-bg img, .background img");
    if (!bgImage) {
      const bgUrl = bgUrlFromStyle(element);
      if (bgUrl) {
        bgImage = document2.createElement("img");
        bgImage.setAttribute("src", bgUrl);
        bgImage.setAttribute("alt", "");
      }
    }
    const textContainer = element.querySelector(".text .media, .wrapper.text, .content-inner, .text-area, .text") || element;
    const heading = textContainer.querySelector("h1:not(.sr-only), h2, h3") || textContainer.querySelector("h1, h2, h3");
    const paras = Array.from(textContainer.querySelectorAll("p")).filter((p) => !p.classList.contains("hero-scroll") && p.textContent.trim().length);
    const ctaLinks = Array.from(textContainer.querySelectorAll("a.btn, .btn-wrapper a")).filter((a) => (a.getAttribute("href") || "").trim() && !/javascript:void/i.test(a.getAttribute("href") || ""));
    if (!heading && !paras.length && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textNodes = [];
    if (heading) textNodes.push(heading);
    paras.forEach((p) => textNodes.push(p));
    ctaLinks.forEach((a) => textNodes.push(a));
    const cells = [];
    cells.push([bgImage ? fieldRow(document2, "image", bgImage) : ""]);
    cells.push([fieldRow(document2, "text", textNodes)]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-grid.js
  function fieldCell4(document2, entries) {
    const frag = document2.createDocumentFragment();
    entries.forEach(([name, content]) => {
      const nodes = (Array.isArray(content) ? content : [content]).filter(Boolean);
      if (!nodes.length) return;
      frag.appendChild(document2.createComment(` field:${name} `));
      nodes.forEach((n) => frag.appendChild(n));
    });
    return frag;
  }
  function parse6(element, { document: document2 }) {
    const labels = Array.from(element.querySelectorAll("ul.nav-tabs > li.brand-tab"));
    const panes = Array.from(
      element.querySelectorAll(".brands-view__main-tabs-content > .tab-pane")
    );
    const cells = [];
    labels.forEach((li, idx) => {
      const labelText = (li.querySelector(".text-wrapper") || li).textContent.trim();
      const pane = panes[idx];
      if (!pane) return;
      const paneClone = pane.cloneNode(true);
      paneClone.querySelectorAll("span.icon, span.glyphicon, .icon--external-link").forEach((s) => s.remove());
      const contentNodes = Array.from(paneClone.childNodes);
      if (!labelText && !contentNodes.length) return;
      const labelNode = document2.createElement("p");
      labelNode.textContent = labelText;
      const labelCell = fieldCell4(document2, [["title", labelNode]]);
      const contentCell = fieldCell4(document2, [["content_richtext", contentNodes]]);
      cells.push([labelCell, contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-grid", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/brunswick-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".slider-counter",
        ".slick-arrow"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-to-content",
        "nav#header",
        ".module.row-mobile-header-section",
        "footer",
        "iframe",
        "noscript",
        "link",
        "style"
      ]);
    }
  }

  // tools/importer/transformers/brunswick-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Brunswick corporate homepage with video hero, ACES innovation carousel, stock/investor + featured article columns, brands tabs directory, news cards, sustainability and careers hero banners, and awards/accolades carousel",
    urls: [
      "https://www.brunswick.com/"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [
          ".page-banner.home-hero",
          ".module.row-home-sustainability",
          ".module.row-home-careers"
        ]
      },
      {
        name: "carousel-showcase",
        instances: [".aces-slider"]
      },
      {
        name: "columns-split",
        instances: [".row-stock-article .row"]
      },
      {
        name: "tabs-grid",
        instances: [".brands-view"]
      },
      {
        name: "cards-article",
        instances: [".news-listing"]
      },
      {
        name: "carousel-logos",
        instances: [".accolade-slider"]
      }
    ],
    sections: [
      {
        id: "rc2",
        name: "Video Hero",
        selector: ".page-banner.home-hero",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "ACES Innovation",
        selector: ".module.row-home-aces",
        style: "dark",
        blocks: ["carousel-showcase"],
        defaultContent: [".row-home-aces .text-area"]
      },
      {
        id: "rc4",
        name: "Stock and Featured Article",
        selector: ".module.row-stock-article",
        style: "light",
        blocks: ["columns-split"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "Brands Directory",
        selector: ".module.module-brands-tabs",
        style: "light",
        blocks: ["tabs-grid"],
        defaultContent: [".module-brands-tabs .module-header"]
      },
      {
        id: "rc6",
        name: "In the News",
        selector: ".module.row-home-news-alt",
        style: "light",
        blocks: ["cards-article"],
        defaultContent: [".row-home-news-alt .text.center", ".row-home-news-alt .link-wrapper.center"]
      },
      {
        id: "rc7",
        name: "Sustainability Banner",
        selector: ".module.row-home-sustainability",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "rc8",
        name: "Careers Banner",
        selector: ".module.row-home-careers",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "rc9",
        name: "Awards and Recognition",
        selector: ".module.module-careers-accolades",
        style: "accent",
        blocks: ["carousel-logos"],
        defaultContent: [".module-careers-accolades .module-header"]
      }
    ]
  };
  var parsers = {
    "cards-article": parse,
    "carousel-logos": parse2,
    "carousel-showcase": parse3,
    "columns-split": parse4,
    "hero-banner": parse5,
    "tabs-grid": parse6
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
