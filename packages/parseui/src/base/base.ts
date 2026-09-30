import type { ComponentDefinition } from "../core/registry";

// Text-like inputs only; checkbox/radio/range/file/color and button-type
// inputs get their own treatment (or Button's).
const textInput =
  'input:not([type="checkbox"], [type="radio"], [type="range"], [type="color"], [type="file"], [type="button"], [type="submit"], [type="reset"], [type="image"], [type="hidden"])';

const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath d='M4.5 6.5 8 10l3.5-3.5' fill='none' stroke='%238b8b98' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";

/**
 * ParseUI's default design for plain HTML inside `<parse-ui>` — the page's
 * own CSS never reaches in here, so every tag needs a considered default.
 */
const css = `
  *, *::before, *::after {
    box-sizing: border-box;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 0.5rem;
    color: var(--p-color-text);
    font-weight: var(--p-font-weight-semibold);
  }
  h1 { font-size: 1.5rem; line-height: 2rem; font-weight: var(--p-font-weight-bold); }
  h2 { font-size: 1.25rem; line-height: 1.5rem; }
  h3 { font-size: 1rem; line-height: 1.5rem; }
  h4 { font-size: 0.875rem; line-height: 1.25rem; }
  h5 { font-size: 0.8125rem; line-height: 1.25rem; }
  h6 { font-size: 0.75rem; line-height: 1rem; }

  p {
    margin: 0 0 0.75rem;
  }

  small {
    font-size: var(--p-font-size-small);
  }

  strong, b {
    font-weight: var(--p-font-weight-semibold);
  }

  a:not([view]) {
    color: var(--p-color-primary-text);
    text-decoration: underline;
    text-underline-offset: 0.125rem;
  }
  a:not([view]):hover {
    color: var(--p-color-primary-hover);
  }

  ul, ol {
    margin: 0 0 0.75rem;
    padding-inline-start: 1.25rem;
  }
  li + li {
    margin-top: 0.25rem;
  }

  code, kbd, samp {
    font-family: var(--p-font-family-mono);
    font-size: 0.8125rem;
  }
  :not(pre) > code, kbd {
    padding: 0.0625rem 0.25rem;
    border-radius: var(--p-radius-sm);
    background: var(--p-color-bg-muted);
  }
  pre {
    margin: 0 0 0.75rem;
    padding: 0.75rem;
    overflow: auto;
    border-radius: var(--p-radius);
    background: var(--p-color-bg-muted);
  }

  blockquote {
    margin: 0 0 0.75rem;
    padding-inline-start: 0.75rem;
    border-inline-start: 0.1875rem solid var(--p-color-border);
    color: var(--p-color-text-secondary);
  }

  hr {
    margin: 1rem 0;
    border: 0;
    border-top: 0.0625rem solid var(--p-color-border);
  }

  img, svg, video, canvas {
    max-width: 100%;
  }

  /* Tables */
  table {
    width: 100%;
    margin: 0 0 0.75rem;
    border-collapse: collapse;
  }
  th, td {
    padding: 0.5rem 0.75rem;
    border-bottom: 0.0625rem solid var(--p-color-border);
    text-align: start;
  }
  th {
    font-weight: var(--p-font-weight-semibold);
    background: var(--p-color-bg-muted);
  }

  /* Forms */
  label {
    display: inline-block;
    margin-bottom: 0.25rem;
    font-weight: var(--p-font-weight-medium);
  }

  ${textInput}, select, textarea {
    display: block;
    width: 100%;
    min-height: 2.25rem;
    margin: 0;
    padding: 0.4375rem 0.75rem;
    font: inherit;
    line-height: 1.25rem;
    color: var(--p-color-text);
    background-color: var(--p-color-bg);
    border: 0.0625rem solid var(--p-color-border-strong);
    border-radius: var(--p-radius);
    box-shadow: var(--p-shadow-xs);
    transition: border-color var(--p-transition-fast), box-shadow var(--p-transition-fast);
  }
  :is(${textInput}, select, textarea):hover:not(:disabled) {
    border-color: var(--p-color-text-tertiary);
  }
  :is(${textInput}, select, textarea):focus-visible {
    outline: none;
    border-color: var(--p-color-primary);
    box-shadow: 0 0 0 3px var(--p-color-ring);
  }
  :is(${textInput}, select, textarea):disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  ::placeholder {
    color: var(--p-color-text-tertiary);
    opacity: 1;
  }

  textarea {
    min-height: 4rem;
    resize: vertical;
  }

  select {
    appearance: none;
    padding-inline-end: 2rem;
    background-image: ${chevron};
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
  }

  input[type="checkbox"], input[type="radio"] {
    width: 1rem;
    height: 1rem;
    margin: 0 0.375rem 0 0;
    vertical-align: -0.1875rem;
    accent-color: var(--p-color-primary);
  }
  input[type="range"] {
    accent-color: var(--p-color-primary);
  }

  fieldset {
    margin: 0 0 0.75rem;
    padding: 0.75rem;
    border: 0.0625rem solid var(--p-color-border);
    border-radius: var(--p-radius-lg);
  }
  legend {
    padding: 0 0.25rem;
    font-weight: var(--p-font-weight-semibold);
  }
`;

export const base: ComponentDefinition = { name: "base", css };
