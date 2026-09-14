/**
 * @parselabllc/ui — importing this module registers every `p-*` custom
 * element as a side effect (customElements.define(...)), so a plain
 * `import "@parselabllc/ui"` is enough to use `<p-button>` in any HTML/JSX.
 *
 * For React-idiomatic wrappers (onClick that behaves like React's own
 * synthetic events, etc.) prefer `@parselabllc/ui/react` instead.
 */
import "./internal/dom-shim.js";

export { PButton, tagName as PButtonTagName } from "./components/button/button.js";
export type { ButtonProps, ButtonJSXProps, ButtonCallbackEvent } from "./components/button/button.types.js";

import "./jsx.js"; // side effect: registers React JSX IntrinsicElements typings
