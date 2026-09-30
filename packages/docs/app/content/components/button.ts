import { CDN_URL } from "../code";
import type { ComponentDoc } from "../types";

export const buttonDoc: ComponentDoc = {
  slug: "button",
  title: "Button",
  description:
    "Triggers an action, such as submitting a form or saving changes. ParseUI styles any native `<button>`, `<input type=\"submit\">`, or `<a view>` inside `<parse-ui>` — no custom tag needed.",
  badges: ["Stable", "Native <button>", "Shadow DOM"],

  hero: `<button view="primary">Primary</button>
<button>Secondary</button>
<button view="tertiary">Tertiary</button>
<button view="plain">Plain</button>
<button view="primary" tone="critical">Delete</button>`,

  installation: [
    { label: "CDN (JS)", lang: "html", code: `<script src="${CDN_URL}"></script>` },
    { label: "npm", lang: "bash", code: "npm install parseui" },
  ],

  usage: `<button view="primary">Save changes</button>`,

  examples: [
    {
      id: "views",
      title: "Views",
      description:
        "Use `primary` for the main action on a screen and `secondary` (the default) for everything else. Keep one primary button per view.",
      markup: `<button view="primary">Primary</button>
<button view="secondary">Secondary</button>
<button view="tertiary">Tertiary</button>
<button view="plain">Plain</button>`,
    },
    {
      id: "tone",
      title: "Critical tone",
      description:
        "`tone=\"critical\"` marks destructive actions. On a primary button it fills red; on other views it colors the label.",
      markup: `<button view="primary" tone="critical">Delete store</button>
<button tone="critical">Delete</button>
<button view="tertiary" tone="critical">Remove</button>
<button view="plain" tone="critical">Discard</button>`,
    },
    {
      id: "loading",
      title: "Loading",
      description:
        "While `loading`, the button keeps its width, shows a spinner, ignores clicks, and sets `aria-busy` for screen readers.",
      markup: `<button view="primary" loading>Saving</button>
<button loading>Loading</button>`,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "Prefer explaining why an action is unavailable. When you must disable, the label stays readable.",
      markup: `<button view="primary" disabled>Primary</button>
<button disabled>Secondary</button>
<button view="tertiary" disabled>Tertiary</button>`,
    },
    {
      id: "links",
      title: "Links",
      description:
        "Give an `<a>` a `view` to style it as a button while keeping link semantics — middle-click, open in a new tab, and so on.",
      markup: `<a view="primary" href="#orders">View orders</a>
<a view="secondary" href="#help">Help center</a>`,
    },
    {
      id: "forms",
      title: "Form buttons",
      description:
        "Native button types work as usual. Put the whole `<form>` inside `<parse-ui>` so its inputs submit with it.",
      markup: `<button type="submit" view="primary">Submit</button>
<button type="reset">Reset</button>`,
    },
    {
      id: "confirm",
      title: "Confirm a destructive action",
      description: "Pair a neutral cancel button with a critical confirm button, so the risky action is never the default.",
      markup: `<button>Cancel</button>
<button view="primary" tone="critical">Delete variant</button>`,
    },
  ],

  api: [
    {
      title: "Attributes",
      description:
        "Set on `<button>`, `<input type=\"button | submit | reset\">`, or `<a view>`. Every native attribute (`type`, `name`, `value`, `href`, `target`…) still works.",
      columns: ["Attribute", "Values", "Default", "Description"],
      codeColumns: [0, 1, 2],
      rows: [
        ["view", '"primary" | "secondary" | "tertiary" | "plain"', '"secondary"', "Visual weight of the button."],
        ["tone", '"critical" | "neutral"', "—", "Marks a destructive action."],
        ["loading", "boolean", "—", "Spinner, label hidden but width kept, clicks blocked, aria-busy set."],
        ["disabled", "boolean", "—", "Native disabled state."],
      ],
    },
    {
      title: "Design tokens",
      description: "Override on the element, e.g. `parse-ui { --p-color-primary: #16a34a; }`.",
      columns: ["Token", "Default", "Used for"],
      codeColumns: [0, 1],
      rows: [
        ["--p-color-primary", "#303030", "Primary background, plain label."],
        ["--p-color-critical", "#c70a24", "Primary + critical background."],
        ["--p-color-critical-text", "#8e0b21", "Critical label on other views."],
        ["--p-color-neutral", "#ffffff", "Secondary background."],
        ["--p-radius-md", "0.5rem", "Corner radius."],
        ["--p-color-focus-ring", "#005bd3", "Focus outline."],
      ],
    },
  ],

  accessibility: [
    "Styles your own native element, so role, keyboard behavior, and form participation are the browser's.",
    "Focus shows a 2px outline in `--p-color-focus-ring`, offset 1px, on every view.",
    "`loading` sets `aria-busy=\"true\"` and blocks activation while keeping the accessible name.",
    "`<a view>` stays a link: screen readers announce it as a link, and it can open in a new tab.",
  ],

  keyboard: [
    ["Enter or Space", "Activates the button."],
    ["Tab", "Moves focus to the next focusable element."],
    ["Shift + Tab", "Moves focus to the previous focusable element."],
  ],
};
