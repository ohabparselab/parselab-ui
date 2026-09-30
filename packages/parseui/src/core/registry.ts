/**
 * Everything ParseUI renders comes through here: tokens, the base design,
 * and every component (Button today; more — or a separate pro package —
 * later) call `registerComponent`. Each `<parse-ui>` applies every
 * registered entry to its shadow root, including ones registered after it
 * was already on the page.
 */
export interface ComponentDefinition {
  /** Unique id, e.g. "button". Registering the same name twice is ignored. */
  name: string;
  /** CSS applied inside every `<parse-ui>` shadow root. */
  css?: string;
  /** Behavior hook, run once per `<parse-ui>` shadow root. */
  setup?: (root: ShadowRoot) => void;
}

export interface RegisteredComponent {
  definition: ComponentDefinition;
  /** Shared across all instances; undefined when constructable stylesheets are unsupported. */
  sheet?: CSSStyleSheet;
}

type Listener = (entry: RegisteredComponent) => void;

const entries: RegisteredComponent[] = [];
const listeners = new Set<Listener>();

// Safari < 16.4 lacks constructable stylesheets; <parse-ui> falls back to
// <style> elements there.
export const supportsAdoptedStyleSheets =
  typeof ShadowRoot !== "undefined" &&
  "adoptedStyleSheets" in ShadowRoot.prototype &&
  typeof CSSStyleSheet !== "undefined" &&
  "replaceSync" in CSSStyleSheet.prototype;

export function registerComponent(definition: ComponentDefinition): void {
  if (entries.some((entry) => entry.definition.name === definition.name)) {
    console.warn(`[parseui] "${definition.name}" is already registered; ignoring.`);
    return;
  }

  let sheet: CSSStyleSheet | undefined;
  if (definition.css && supportsAdoptedStyleSheets) {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(definition.css);
  }

  const entry: RegisteredComponent = { definition, sheet };
  entries.push(entry);
  listeners.forEach((listener) => listener(entry));
}

export function registeredComponents(): readonly RegisteredComponent[] {
  return entries;
}

export function onRegister(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
