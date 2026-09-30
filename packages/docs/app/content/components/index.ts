import type { ComponentDoc } from "../types";
import { buttonDoc } from "./button";

/** Adding a component page = one data file here + one entry in nav.ts. */
export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  button: buttonDoc,
};
