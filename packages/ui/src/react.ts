/**
 * React-idiomatic wrappers around every `p-*` element, built with Lit's
 * official `createComponent()` (@lit/react). Prefer importing from here
 * over the raw tags: event props (`onClick`) behave like normal React
 * event handlers instead of raw `addEventListener` wiring, and complex
 * prop values are set as JS properties rather than stringified attributes.
 *
 *   import { Button } from "@parselab/ui/react";
 *   <Button variant="primary" onClick={() => save()}>Save</Button>
 */
import "./internal/dom-shim.js";
import * as React from "react";
import { createComponent } from "@lit/react";
import { PButton } from "./components/button/button.js";

export const Button = createComponent({
  tagName: "p-button",
  elementClass: PButton,
  react: React,
  events: {
    onClick: "click",
    onFocus: "focus",
    onBlur: "blur",
  },
});

import "./jsx.js";
