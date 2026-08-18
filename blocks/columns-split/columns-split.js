export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = [...firstRow.children];
  block.classList.add(`columns-split-${cols.length}-cols`);

  cols.forEach((col) => {
    const hasHeading = col.querySelector('h1, h2, h3, h4, h5, h6');

    if (hasHeading) {
      // RIGHT cell: featured-article promo — image column + text column
      col.classList.add('columns-split-article');

      const children = [...col.children];
      const mediaP = children.find((el) => el.tagName === 'P' && el.querySelector('picture'));

      const media = document.createElement('div');
      media.className = 'columns-split-article-media';
      const body = document.createElement('div');
      body.className = 'columns-split-article-body';

      children.forEach((child) => {
        if (child === mediaP) media.append(child);
        else body.append(child);
      });

      col.append(media, body);
    } else {
      // LEFT cell: stock / investor callout
      col.classList.add('columns-split-stock');

      const children = [...col.children];
      const iconP = children.find((el) => el.tagName === 'P' && el.querySelector('picture'));

      if (iconP) {
        const tickerP = iconP.nextElementSibling;
        const head = document.createElement('div');
        head.className = 'columns-split-stock-head';
        iconP.replaceWith(head);
        head.append(iconP);
        iconP.classList.add('columns-split-stock-icon');
        if (tickerP && tickerP.tagName === 'P') {
          tickerP.classList.add('columns-split-stock-ticker');
          head.append(tickerP);
        }
      }

      // classify the remaining stat paragraphs by content
      [...col.children].forEach((el) => {
        if (el.tagName !== 'P') return;
        const t = el.textContent.trim();
        if (/^\$/.test(t)) el.classList.add('columns-split-stock-price');
        else if (/%/.test(t)) el.classList.add('columns-split-stock-change');
      });
    }
  });
}
