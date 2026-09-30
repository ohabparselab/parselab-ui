import type { ComponentDefinition } from "../../core/registry";

/**
 * Text inputs, `<select>`, `<textarea>` and file inputs — shadcn/ui's input
 * design — plus fields that lay out a label, a control and a description.
 *
 *   <div field>                    label, control and <small> description, stacked
 *   <div field="horizontal">       the same in a row (e.g. an input and a button)
 *   <div field-group>              stacks fields, as in a form
 *   <div field-group="horizontal"> fields side by side (first name / last name)
 *
 * States come from the native control, so there's nothing to keep in sync:
 *   aria-invalid="true"  red border and ring; the field's label turns red
 *   disabled             dimmed; the field's label dims too
 *   required             the field's label gets a red asterisk
 */
export const TEXT_CONTROL: string =
  'input:not([type="checkbox"], [type="radio"], [type="range"], [type="color"], [type="file"], [type="button"], [type="submit"], [type="reset"], [type="image"], [type="hidden"]), select, textarea';

const control = `:is(${TEXT_CONTROL}, input[type="file"])`;
const invalid = '[aria-invalid="true"]';

const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath d='M4.5 6.5 8 10l3.5-3.5' fill='none' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";

const css = `
  /* --- controls --- */
  ${control} {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: 2rem;
    margin: 0;
    padding: 0.25rem 0.625rem;
    border: 1px solid var(--p-input-border);
    border-radius: var(--p-input-radius);
    background-color: var(--p-input-bg);
    color: var(--p-color-text);
    box-shadow: none;
    font: inherit;
    font-size: 0.875rem;
    line-height: 1.25rem;
    outline: none;
    transition: border-color var(--p-transition-fast), box-shadow var(--p-transition-fast),
      background-color var(--p-transition-fast);
  }
  ${control}::placeholder {
    color: var(--p-input-muted);
    opacity: 1;
  }
  ${control}:focus-visible {
    border-color: var(--p-input-ring);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--p-input-ring) 50%, transparent);
  }
  ${control}${invalid} {
    border-color: var(--p-input-invalid-border);
    box-shadow: 0 0 0 3px var(--p-input-invalid-ring);
  }
  ${control}:disabled {
    cursor: not-allowed;
    pointer-events: none;
    background-color: var(--p-input-disabled-bg);
    opacity: 0.5;
  }

  textarea {
    height: auto;
    min-height: 4rem;
    padding-block: 0.5rem;
    resize: vertical;
    field-sizing: content;
  }

  select {
    appearance: none;
    padding-inline-end: 2rem;
    background-image: ${chevron};
    background-repeat: no-repeat;
    background-position: right 0.625rem center;
    cursor: pointer;
  }
  select[multiple] {
    height: auto;
    padding-inline-end: 0.625rem;
    background-image: none;
  }

  input[type="file"] {
    padding-block: 0.25rem;
    color: var(--p-input-muted);
    cursor: pointer;
  }
  input[type="file"]::file-selector-button {
    display: inline-flex;
    height: 1.5rem;
    margin: 0 0.5rem 0 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--p-color-text);
    font: inherit;
    font-size: 0.875rem;
    font-weight: var(--p-font-weight-medium);
    cursor: pointer;
  }

  /* --- fields --- */
  [field] {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
  [field="horizontal"] {
    flex-direction: row;
    align-items: center;
  }
  [field="horizontal"] > ${control} {
    flex: 1 1 auto;
    width: auto;
  }

  [field] > label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: fit-content;
    margin: 0;
    color: var(--p-color-text);
    font-size: 0.875rem;
    font-weight: var(--p-font-weight-medium);
    line-height: 1.375;
    user-select: none;
  }
  [field] > small {
    display: block;
    margin: 0;
    color: var(--p-input-muted);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  [field]:has(> ${control}${invalid}) > label {
    color: var(--p-color-danger);
  }
  [field]:has(> ${control}:disabled) > :is(label, small) {
    opacity: 0.5;
  }
  [field]:has(> ${control}:required) > label::after {
    content: "*";
    color: var(--p-color-danger);
  }

  [field-group] {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
  }
  [field-group="horizontal"] {
    flex-direction: row;
    gap: 1rem;
  }
  [field-group="horizontal"] > * {
    flex: 1 1 0;
    min-width: 0;
  }
`;

export const input: ComponentDefinition = { name: "input", css };
