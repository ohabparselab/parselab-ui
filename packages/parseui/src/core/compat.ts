import { TAG_NAME } from "./parse-ui";

/**
 * `<parseui>` can't be a real custom element — custom element names need a
 * hyphen, and `attachShadow()` isn't allowed on unknown tags — so in plain
 * HTML we swap each `<parseui>` for a `<parse-ui>`. Not for framework-rendered
 * markup (React/Vue would lose track of the replaced node): write
 * `<parse-ui>` there.
 */
const LEGACY_TAG = "parseui";

function upgrade(legacy: Element): void {
  const element = document.createElement(TAG_NAME);
  for (const { name, value } of Array.from(legacy.attributes)) {
    element.setAttribute(name, value);
  }

  const moveChildren = () => {
    while (legacy.firstChild) element.appendChild(legacy.firstChild);
  };
  moveChildren();
  legacy.replaceWith(element);

  // While the page is still loading, the HTML parser keeps appending the
  // rest of this tag's children to the original (now detached) element —
  // keep forwarding them until parsing finishes.
  if (document.readyState === "loading") {
    const observer = new MutationObserver(moveChildren);
    observer.observe(legacy, { childList: true });
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        moveChildren();
        observer.disconnect();
      },
      { once: true },
    );
  }
}

function upgradeWithin(node: Node): void {
  if (!(node instanceof Element)) return;
  if (node.localName === LEGACY_TAG) {
    upgrade(node);
    return;
  }
  node.querySelectorAll(LEGACY_TAG).forEach(upgrade);
}

export function startLegacyTagCompat(): void {
  upgradeWithin(document.documentElement);

  new MutationObserver((records) => {
    for (const record of records) record.addedNodes.forEach(upgradeWithin);
  }).observe(document.documentElement, { childList: true, subtree: true });
}
