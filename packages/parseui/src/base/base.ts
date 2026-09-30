import type { ComponentDefinition } from "../core/registry";

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

  /* Forms — text inputs, select, textarea and fields are components/input. */
  label {
    display: inline-block;
    margin-bottom: 0.25rem;
    font-weight: var(--p-font-weight-medium);
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
