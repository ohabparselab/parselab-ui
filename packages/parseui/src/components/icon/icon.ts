import type { ComponentDefinition } from "../../core/registry";
import { loadIcon } from "../../core/icons";

/**
 * `<i icon="search"></i>` renders a ParseUI icon.
 *
 *   icon           icon name, e.g. "arrow-right"
 *   size           width/height — a number (px) or any CSS length. Default 1.25em
 *                  (16px inside a button)
 *   stroke-width   default 1.8
 *   aria-label     gives the icon an accessible name; otherwise it's decorative
 *
 * The icon takes the surrounding text color (currentColor). The <svg> inside
 * the <i> is ours; on the <i> itself we only add role="img" when it has an
 * aria-label, so frameworks that render it keep control of its attributes.
 */
const SELECTOR = "i[icon]";

const css = `
  /* The <i> wraps its <svg>; the min size reserves the space while it loads. */
  ${SELECTOR} {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    min-width: var(--p-icon-size, 1.25em);
    min-height: var(--p-icon-size, 1.25em);
    vertical-align: -0.25em;
    font-style: normal;
    line-height: 1;
  }
  ${SELECTOR} > svg {
    width: var(--p-icon-size, 1.25em);
    height: var(--p-icon-size, 1.25em);
    stroke-width: var(--p-icon-stroke-width, 1.8);
  }
  /* Inside a button: the button's icon size (16px; 12px / 14px in xs / sm). */
  :is(button, input, a[view]) ${SELECTOR} {
    --p-icon-size: var(--_icon, 1rem);
  }
`;

// Latest render request per element, so a slow load can't overwrite a newer icon.
const renderToken = new WeakMap<Element, number>();
let nextToken = 0;

function lengthOf(value: string): string {
  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

async function render(el: Element): Promise<void> {
  const name = el.getAttribute("icon")?.trim();
  const token = ++nextToken;
  renderToken.set(el, token);

  const svg = name ? await loadIcon(name) : null;
  if (renderToken.get(el) !== token) return;

  el.querySelector(":scope > svg[data-parseui-icon]")?.remove();
  if (!svg) return;

  svg.setAttribute("data-parseui-icon", "");
  svg.setAttribute("focusable", "false");
  const size = el.getAttribute("size");
  if (size) {
    svg.style.width = lengthOf(size);
    svg.style.height = lengthOf(size);
  }
  const stroke = el.getAttribute("stroke-width");
  if (stroke) svg.style.strokeWidth = stroke;

  if (el.hasAttribute("aria-label")) {
    svg.removeAttribute("aria-hidden");
    if (!el.hasAttribute("role")) el.setAttribute("role", "img");
  } else {
    svg.setAttribute("aria-hidden", "true");
  }
  el.append(svg);
}

function renderTree(node: Node): void {
  if (node instanceof Element && node.matches(SELECTOR)) void render(node);
  if (node instanceof Element || node instanceof ShadowRoot) node.querySelectorAll(SELECTOR).forEach(render);
}

export const icon: ComponentDefinition = {
  name: "icon",
  css,
  setup(root) {
    renderTree(root);
    new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes") {
          if ((record.target as Element).matches(SELECTOR)) void render(record.target as Element);
        } else {
          record.addedNodes.forEach(renderTree);
        }
      }
    }).observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["icon", "size", "stroke-width", "aria-label"],
    });
  },
};
