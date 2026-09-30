import type { ComponentDoc } from "../types";

export const buttonDoc: ComponentDoc = {
  slug: "button",
  title: "Button",
  description:
    "Triggers an action or event, such as submitting a form, opening a dialog, or saving changes. ParseUI styles any native `<button>`, `<input type=\"submit\">`, or `<a view>` inside `<parse-ui>` — no custom tag needed.",
  badges: ["Stable", "Native <button>", "Shadow DOM"],

  usage: `<!-- Default: shadcn/ui's default button (near-black; light in dark mode) -->
<button>Button</button>

<!-- Views -->
<button view="outline">Outline</button>
<button view="primary">Primary</button>
<button view="secondary">Secondary</button>
<button view="gray">Gray</button>
<button view="light">Light</button>
<button view="dark">Dark</button>
<button view="soft">Soft</button>
<button view="ghost">Ghost</button>
<button view="success">Success</button>
<button view="warning">Warning</button>
<button view="info">Info</button>
<button view="danger">Danger</button>
<button view="link">Link</button>

<!-- Outline version of any view -->
<button view="primary" outline>Primary</button>

<!-- Sizes: xs 24px · sm 28px · md 32px (default) · lg 36px -->
<button view="primary" size="sm">Small</button>
<button view="primary" size="lg">Large</button>

<!-- Icons: before or after the label, or icon only (needs an aria-label) -->
<button view="primary"><i icon="plus"></i> New product</button>
<button view="secondary">Continue <i icon="arrow-right"></i></button>
<button view="outline" icon-only aria-label="Settings"><i icon="settings"></i></button>

<!-- Loading: spinner replaces the label, or sits before / after it -->
<button view="primary" loading>Saving</button>
<button view="primary" loading="start">Saving</button>
<button view="primary" loading="end">Saving</button>

<!-- Disabled and full width -->
<button view="primary" disabled>Disabled</button>
<button view="primary" full-width>Continue</button>

<!-- A link that looks like a button -->
<a view="primary" href="/orders">View orders</a>

<!-- Form buttons keep their native behavior -->
<button type="button" view="outline">Cancel</button>
<button type="submit">Submit</button>`,

  examples: [
    {
      id: "default",
      title: "Default",
      description:
        "A `<button>` with no attributes is shadcn/ui's default button: near-black with a light label (light with a dark label in dark mode), 32px tall — the same height as an input. `view=\"outline\"` is the white, bordered version.",
      markup: `<button>Button</button>
<button view="outline">Outline</button>
<button icon-only aria-label="Next"><i icon="arrow-right"></i></button>`,
    },
    {
      id: "views",
      title: "Views",
      description:
        "Use `primary` for the main action on a screen, `secondary` for everything else. Keep one primary button per view. `light` stays light in both themes — use it on dark or colored surfaces; `dark` is near-black, and turns white in the dark theme.",
      markup: `<button view="outline">Outline</button>
<button view="primary">Primary</button>
<button view="secondary">Secondary</button>
<button view="gray">Gray</button>
<button view="light">Light</button>
<button view="dark">Dark</button>
<button view="soft">Soft</button>
<button view="ghost">Ghost</button>
<button view="success">Success</button>
<button view="warning">Warning</button>
<button view="info">Info</button>
<button view="danger">Danger</button>
<button view="link">Link</button>`,
    },
    {
      id: "outline",
      title: "Outline",
      description:
        "Add `outline` to any view for a transparent button with a colored border and label. Hovering tints it with the view's color.",
      markup: `<button view="primary" outline>Primary</button>
<button view="secondary" outline>Secondary</button>
<button view="gray" outline>Gray</button>
<button view="dark" outline>Dark</button>
<button view="success" outline>Success</button>
<button view="warning" outline>Warning</button>
<button view="info" outline>Info</button>
<button view="danger" outline>Danger</button>`,
    },
    {
      id: "status",
      title: "Status colors",
      description:
        "`success` (styled after GitHub's green button) confirms a positive action, `warning` asks for care, `info` points to something neutral, and `danger` marks a destructive action. Pair them with a neutral button so the risky or final action is never the only choice.",
      markup: `<button view="outline">Cancel</button>
<button view="success">Approve order</button>
<button view="warning">Review changes</button>
<button view="info">Learn more</button>
<button view="danger">Delete order</button>`,
    },
    {
      id: "sizes",
      title: "Sizes",
      description: "Four sizes — 24, 28, 32 and 36px, shadcn/ui's scale — so buttons line up with inputs. `md` (32px) is the default.",
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
<button view="ghost" icon-only aria-label="More actions"><i icon="ellipsis"></i></button>
<button view="danger" icon-only aria-label="Delete"><i icon="trash"></i></button>`,
    },
    {
      id: "loading",
      title: "Loading",
      description:
        "While `loading`, the button keeps its width, shows a spinner in place of the label, ignores clicks, and sets `aria-busy` for screen readers.",
      markup: `<button view="primary" loading>Saving</button>
<button view="secondary" loading>Loading</button>
<button loading>Default</button>`,
    },
    {
      id: "loading-label",
      title: "Loading with label",
      description:
        "`loading=\"start\"` puts the spinner before the label and `loading=\"end\"` after it, keeping the text visible — handy when the label says what's happening. Clicks are still blocked.",
      markup: `<button view="primary" loading="start">Saving</button>
<button view="primary" loading="end">Saving</button>
<button view="secondary" loading="start">Uploading</button>
<button view="success" outline loading="end">Publishing</button>
<button loading="start">Loading</button>`,
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
          '"outline" | "primary" | "secondary" | "gray" | "light" | "dark" | "soft" | "ghost" | "success" | "warning" | "info" | "danger" | "link"',
          "—",
          "Visual style. Without it, the button is shadcn/ui's default (near-black). outline is the white, bordered version.",
        ],
        ["outline", "boolean", "—", "Outline version of the view: transparent fill, colored border and label."],
        ["size", '"xs" | "sm" | "md" | "lg"', '"md"', "24, 28, 32 or 36px tall — matching inputs at md."],
        ["icon-only", "boolean", "—", "Square button for a single icon. Needs an aria-label."],
        ["full-width", "boolean", "—", "Stretches to the width of its container."],
        ["loading", '"" | "start" | "end"', "—", "Shows a spinner, blocks clicks, sets aria-busy. Empty: spinner replaces the label (width kept). start / end: spinner before / after the visible label."],
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
        ["--p-color-light", "#f4f4f6", "Light background (same in both themes)."],
        ["--p-color-dark", "#14141b", "Dark background (#ededf2 in the dark theme)."],
        ["--p-color-success", "#1f883d", "Success background (GitHub green; #238636 in the dark theme)."],
        ["--p-color-success-border", "rgba(31, 35, 40, 0.15)", "Success border."],
        ["--p-color-warning", "#f5a524", "Warning background."],
        ["--p-color-info", "#0891b2", "Info background."],
        ["--p-color-danger", "#dc3e42", "Danger background."],
        ["--p-color-border-strong", "#d6d6dd", "Secondary border."],
        ["--p-shadow-xs", "0 1px 2px rgba(20, 20, 27, 0.05)", "Resting shadow of filled buttons."],
        ["--p-shadow-sm", "0 2px 4px rgba(20, 20, 27, 0.08), …", "Hover shadow of filled buttons."],
        ["--p-button-default-bg", "oklch(0.205 0 0)", "Default (no view) background (oklch(0.922 0 0) in dark mode)."],
        ["--p-button-default-fg", "oklch(0.985 0 0)", "Default (no view) label."],
        ["--p-button-outline-bg", "#ffffff", "Outline background."],
        ["--p-button-outline-border", "oklch(0.922 0 0)", "Outline border."],
        ["--p-button-ring", "oklch(0.708 0 0)", "Focus border and ring, every button."],
        ["--p-radius", "0.625rem", "Corner radius of every button (xs / sm use 8px)."],
      ],
    },
  ],

  accessibility: [
    "Styles your own native element, so role, keyboard behavior, and form participation are the browser's.",
    "Focus turns the border gray and adds a 3px ring — shadcn/ui's focus style — on every button.",
    "`loading` sets `aria-busy=\"true\"` and blocks activation while keeping the accessible name.",
    "`<a view>` stays a link: screen readers announce it as a link, and it can open in a new tab.",
  ],

  keyboard: [
    ["Enter or Space", "Activates the button."],
    ["Tab", "Moves focus to the next focusable element."],
    ["Shift + Tab", "Moves focus to the previous focusable element."],
  ],
};
