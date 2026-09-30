import { CDN_URL } from "../code";
import type { ComponentDoc } from "../types";

export const buttonDoc: ComponentDoc = {
  slug: "button",
  title: "Button",
  description:
    "Triggers an action or event, such as submitting a form, opening a dialog, or saving changes. ParseUI styles any native `<button>`, `<input type=\"submit\">`, or `<a view>` inside `<parse-ui>` — no custom tag needed.",
  badges: ["Stable", "Native <button>", "Shadow DOM"],

  hero: `<button view="primary">Primary</button>
<button view="secondary">Secondary</button>
<button view="gray">Gray</button>
<button view="soft">Soft</button>
<button view="ghost">Ghost</button>
<button view="success">Success</button>
<button view="danger">Danger</button>
<button view="link">Link</button>`,

  installation: [
    { label: "CDN (JS)", lang: "html", code: `<script src="${CDN_URL}"></script>` },
    { label: "npm", lang: "bash", code: "npm install parseui@latest" },
  ],

  usage: `<button view="primary">Save changes</button>`,

  examples: [
    {
      id: "default",
      title: "Default",
      description:
        "A `<button>` with no attributes gets the neutral default design — dark in light mode, light in dark mode. Use it when an action doesn't need the brand color.",
      markup: `<button>Button</button>
<button icon-only aria-label="Next"><i icon="arrow-right"></i></button>`,
    },
    {
      id: "views",
      title: "Views",
      description:
        "Use `primary` for the main action on a screen, `secondary` for everything else. Keep one primary button per view.",
      markup: `<button view="primary">Primary</button>
<button view="secondary">Secondary</button>
<button view="gray">Gray</button>
<button view="soft">Soft</button>
<button view="ghost">Ghost</button>
<button view="success">Success</button>
<button view="danger">Danger</button>
<button view="link">Link</button>`,
    },
    {
      id: "status",
      title: "Success and danger",
      description:
        "`success` confirms a positive action — approve, publish, complete. `danger` marks a destructive one. Pair either with a neutral button so the risky or final action is never the only choice.",
      markup: `<button view="gray">Cancel</button>
<button view="success">Approve order</button>
<button view="danger">Delete order</button>`,
    },
    {
      id: "sizes",
      title: "Sizes",
      description: "Four sizes share the same 4px grid. `md` is the default for any `view`, and fits forms and page actions.",
      markup: `<button view="primary" size="xs">Extra small</button>
<button view="primary" size="sm">Small</button>
<button view="primary" size="md">Medium</button>
<button view="primary" size="lg">Large</button>`,
    },
    {
      id: "with-icon",
      title: "With icon",
      description:
        "Put an `<i icon=\"…\">` from the ParseUI icon set before or after the label. Inside a button, icons are 16px and take the label color. Any `<svg>` works too.",
      markup: `<button view="primary"><i icon="plus"></i> New product</button>
<button view="secondary"><i icon="download"></i> Export CSV</button>
<button view="soft">Continue <i icon="arrow-right"></i></button>`,
    },
    {
      id: "icon-only",
      title: "Icon only",
      description: "`icon-only` makes the button square. Icon-only buttons need an `aria-label` so screen readers can name them.",
      markup: `<button view="secondary" icon-only aria-label="Edit"><i icon="pen"></i></button>
<button view="ghost" icon-only aria-label="More actions"><i icon="more-horizontal"></i></button>
<button view="danger" icon-only aria-label="Delete"><i icon="trash"></i></button>`,
    },
    {
      id: "loading",
      title: "Loading",
      description:
        "While `loading`, the button keeps its width, shows a spinner, ignores clicks, and sets `aria-busy` for screen readers.",
      markup: `<button view="primary" loading>Saving</button>
<button view="secondary" loading>Loading</button>
<button loading>Default</button>`,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "Prefer explaining why an action is unavailable. When you must disable, keep the label readable.",
      markup: `<button view="primary" disabled>Primary</button>
<button view="secondary" disabled>Secondary</button>
<button view="soft" disabled>Soft</button>
<button disabled>Default</button>`,
    },
    {
      id: "full-width",
      title: "Full width",
      description: "`full-width` stretches the button to its container — useful in narrow forms and mobile layouts.",
      markup: `<button view="primary" full-width>Continue to payment</button>`,
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
<button type="reset" view="ghost">Reset</button>`,
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
        [
          "view",
          '"primary" | "secondary" | "gray" | "soft" | "ghost" | "success" | "danger" | "link"',
          "—",
          "Visual style. Without it, the button uses the neutral default design.",
        ],
        ["size", '"xs" | "sm" | "md" | "lg"', '"md"', "Height, padding, and font size."],
        ["icon-only", "boolean", "—", "Square button for a single icon. Needs an aria-label."],
        ["full-width", "boolean", "—", "Stretches to the width of its container."],
        ["loading", "boolean", "—", "Spinner, label hidden but width kept, clicks blocked, aria-busy set."],
        ["disabled", "boolean", "—", "Native disabled state, shown at 50% opacity."],
      ],
    },
    {
      title: "Design tokens",
      description: "Override on the element, e.g. `parse-ui { --p-color-primary: #16a34a; }`. Hover, soft, and focus colors are derived from it.",
      columns: ["Token", "Default", "Used for"],
      codeColumns: [0, 1],
      rows: [
        ["--p-color-primary", "#2488ff", "Primary background, soft and link label, focus ring."],
        ["--p-color-primary-foreground", "#ffffff", "Primary label."],
        ["--p-color-gray", "#e8e8ed", "Gray background."],
        ["--p-color-success", "#12915a", "Success background."],
        ["--p-color-danger", "#dc3e42", "Danger background."],
        ["--p-color-border-strong", "#d6d6dd", "Secondary border."],
        ["--p-shadow-xs", "0 1px 2px rgba(20, 20, 27, 0.05)", "Resting shadow of filled buttons."],
        ["--p-shadow-sm", "0 2px 4px rgba(20, 20, 27, 0.08), …", "Hover shadow of filled buttons."],
        ["--p-button-default-bg", "oklch(0.205 0 0)", "Default (no view) background."],
        ["--p-button-default-fg", "oklch(0.985 0 0)", "Default (no view) label."],
        ["--p-radius", "0.5rem", "Corner radius of views."],
        ["--p-button-default-radius", "0.625rem", "Corner radius of the default button."],
      ],
    },
  ],

  accessibility: [
    "Styles your own native element, so role, keyboard behavior, and form participation are the browser's.",
    "Focus shows a 2px ring offset from the button in `--p-color-primary` on every view, and a soft gray ring on the default button.",
    "`loading` sets `aria-busy=\"true\"` and blocks activation while keeping the accessible name.",
    "`<a view>` stays a link: screen readers announce it as a link, and it can open in a new tab.",
  ],

  keyboard: [
    ["Enter or Space", "Activates the button."],
    ["Tab", "Moves focus to the next focusable element."],
    ["Shift + Tab", "Moves focus to the previous focusable element."],
  ],
};
