# AI agents

These docs are published in formats AI coding agents read directly, so an agent can build UI in your project that follows ParseUI.

## Docs for agents

| URL | What it is |
|---|---|
| [`/llms.txt`](/llms.txt) | An index of every page, with a one-line summary each ([llmstxt.org](https://llmstxt.org) format) — start here |
| [`/llms-full.txt`](/llms-full.txt) | All docs in one Markdown file — paste it into a chat or give it to an agent as context |
| `/llms/<page>.md` | One page as Markdown, e.g. [`/llms/components/button.md`](/llms/components/button.md) |

Every docs page also has a **Copy page** button that copies it as Markdown.

## Rules for your project

Add this to your project's `AGENTS.md`, `CLAUDE.md`, or `.cursor/rules`, so agents write ParseUI the right way:

<!-- agent-rules:start -->
```md
## UI: ParseUI

This project uses ParseUI ({{site}}). Full docs for agents: {{site}}/llms-full.txt

- Wrap UI in `<parse-ui>`; everything inside renders in a shadow root with ParseUI's design. Page CSS doesn't reach inside — put layout CSS in a `<style>` inside `<parse-ui>`, or use tokens.
- Write plain HTML. There are no custom component tags: style comes from native elements and attributes.
  - Buttons: `<button>` (white outline default), `view="primary|secondary|gray|light|dark|soft|ghost|success|warning|info|danger|link"`, `outline`, `size="xs|sm|md|lg"`, `icon-only` (+ `aria-label`), `loading` / `loading="start|end"`, `full-width`, `disabled`. `<a view>` is a link styled as a button.
  - Groups: `<div group role="group" aria-label>` joins buttons and inputs; `group="vertical"`; `aria-pressed="true"` marks the selected one.
  - Forms: `<div field>` = `<label for>` + control + `<small>` description; `field="horizontal"`; `<div field-group>` stacks fields (`field-group="horizontal"` side by side). Use native `aria-invalid="true"`, `disabled`, `required` — the label follows automatically. Keep the whole `<form>` inside `<parse-ui>`.
  - Icons: `<i icon="name">` with Lucide icon names (e.g. `search`, `arrow-right`); `size`, `stroke-width`, color from CSS `color`. In React, `import { Search } from "@parseui/icons"`.
- Light/dark: `<parse-ui mode="light|dark|auto">`. Themes: `registerTheme({ name, light, dark })` + `<parse-ui theme="name">`. Customize with `--p-*` tokens, never by overriding internals.
- React: `import "parseui"` once and `import type {} from "parseui/jsx"`. Presence-only attributes take `""` (`loading=""`), `for` is `htmlFor`. React `onClick` doesn't fire on elements inside `<parse-ui>` — use `addEventListener` or native `onclick`.
- Don't add other UI libraries' classes or styles inside `<parse-ui>`; if a component doesn't exist yet, compose it from native elements.
```
<!-- agent-rules:end -->

## Tips

- Point the agent at a component's page (`/llms/components/<name>.md`) when it builds that component — each page has a **Usage** block with every supported variant.
- Ask it to copy the **Usage** lines rather than invent attributes: anything not documented isn't supported.
