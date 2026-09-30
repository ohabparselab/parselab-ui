import type { ComponentDefinition } from "../../core/registry";
import { BUTTON_SELECTOR, buttonCss } from "./button.css";

// Buttons we set aria-busy on, so we only ever remove our own.
const busyByUs = new WeakSet<Element>();

function syncBusy(element: Element): void {
  if (!element.matches(BUTTON_SELECTOR)) return;
  if (element.hasAttribute("loading")) {
    if (!element.hasAttribute("aria-busy")) {
      element.setAttribute("aria-busy", "true");
      busyByUs.add(element);
    }
  } else if (busyByUs.has(element)) {
    element.removeAttribute("aria-busy");
    busyByUs.delete(element);
  }
}

function syncTree(node: Node): void {
  if (node instanceof Element) syncBusy(node);
  if (node instanceof Element || node instanceof ShadowRoot) {
    node.querySelectorAll("[loading]").forEach(syncBusy);
  }
}

/**
 * The reference component: every ParseUI component is a folder that exports
 * one `ComponentDefinition` like this — CSS plus an optional `setup` hook —
 * and gets registered in src/index.ts.
 */
export const button: ComponentDefinition = {
  name: "button",
  css: buttonCss,
  setup(root) {
    // `loading` isn't a native attribute, so a loading <button> would still
    // click (and submit its form). Stop it in the capture phase, before any
    // of the page's own handlers on the button run.
    root.addEventListener(
      "click",
      (event) => {
        const target = event.target instanceof Element ? event.target.closest(BUTTON_SELECTOR) : null;
        if (target?.hasAttribute("loading")) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true,
    );

    syncTree(root);
    new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes") syncBusy(record.target as Element);
        else record.addedNodes.forEach(syncTree);
      }
    }).observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["loading"] });
  },
};
