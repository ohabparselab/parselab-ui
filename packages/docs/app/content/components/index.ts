import type { ComponentDoc } from "../types";
import { buttonDoc } from "./button";
import { buttonGroupDoc } from "./button-group";
import { inputDoc } from "./input";

/** Adding a component page = one data file here + one entry in nav.ts. */
export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  button: buttonDoc,
  "button-group": buttonGroupDoc,
  input: inputDoc,
};
