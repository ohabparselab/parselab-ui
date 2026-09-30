import type { ComponentDoc } from "../types";

export const buttonGroupDoc: ComponentDoc = {
  slug: "button-group",
  title: "Button group",
  description:
    "Joins related buttons into one control — a toolbar, a split of actions, or a segmented control that switches a view. Add `group` to any element around your buttons.",
  badges: ["Stable", "Native <button>", "Shadow DOM"],

  usage: `<!-- Joined buttons -->
<div group role="group" aria-label="Actions">
  <button>Cut</button>
  <button>Copy</button>
  <button>Paste</button>
</div>

<!-- Segmented control: mark the selected option -->
<div group role="group" aria-label="View">
  <button view="secondary" aria-pressed="true">List</button>
  <button view="secondary" aria-pressed="false">Board</button>
</div>

<!-- Any view, including outline -->
<div group role="group" aria-label="Save">
  <button view="primary">Save</button>
  <button view="primary">Save as</button>
</div>

<!-- Toolbar of icon-only buttons -->
<div group role="toolbar" aria-label="Formatting">
  <button icon-only aria-label="Bold"><i icon="bold"></i></button>
  <button icon-only aria-label="Italic"><i icon="italic"></i></button>
</div>

<!-- Stacked -->
<div group="vertical" role="group" aria-label="Settings">
  <button view="secondary">Profile</button>
  <button view="secondary">Billing</button>
</div>

<!-- An input and a button, joined -->
<div group>
  <input type="search" placeholder="Search..." aria-label="Search">
  <button>Search</button>
</div>`,

  examples: [
    {
      id: "default",
      title: "Default",
      description:
        "Buttons inside a `group` share their borders, and only the outer corners stay rounded. Give the group `role=\"group\"` and an `aria-label` so screen readers announce it as one control.",
      markup: `<div group role="group" aria-label="Pagination">
  <button>Previous</button>
  <button>1</button>
  <button>2</button>
  <button>3</button>
  <button>Next</button>
</div>`,
    },
    {
      id: "segmented",
      title: "Segmented control",
      description:
        "Mark the selected button with `aria-pressed=\"true\"` (or `aria-current`) and it shows as selected. Update the attribute from your own click handler to switch between options.",
      markup: `<div group role="group" aria-label="View">
  <button view="secondary" aria-pressed="true">List</button>
  <button view="secondary" aria-pressed="false">Board</button>
  <button view="secondary" aria-pressed="false">Calendar</button>
</div>`,
    },
    {
      id: "views",
      title: "Views",
      description: "Every view works in a group. Solid views get a hairline divider between buttons instead of a border.",
      markup: `<div group role="group" aria-label="Primary actions">
  <button view="primary">Save</button>
  <button view="primary">Save as</button>
  <button view="primary">Export</button>
</div>
<div group role="group" aria-label="Outline actions">
  <button view="primary" outline>Save</button>
  <button view="primary" outline>Save as</button>
  <button view="primary" outline>Export</button>
</div>
<div group role="group" aria-label="Gray actions">
  <button view="gray">Cut</button>
  <button view="gray">Copy</button>
  <button view="gray">Paste</button>
</div>`,
    },
    {
      id: "icons",
      title: "Toolbar",
      description: "Icon-only buttons make a compact toolbar. Each needs its own `aria-label`.",
      markup: `<div group role="toolbar" aria-label="Formatting">
  <button icon-only aria-label="Copy"><i icon="copy"></i></button>
  <button icon-only aria-label="Link"><i icon="link"></i></button>
  <button icon-only aria-label="Image"><i icon="image"></i></button>
  <button icon-only aria-label="Delete"><i icon="trash"></i></button>
</div>`,
    },
    {
      id: "sizes",
      title: "Sizes",
      description: "Set the same `size` on every button in the group.",
      markup: `<div group role="group" aria-label="Small">
  <button view="secondary" size="sm">Small</button>
  <button view="secondary" size="sm">Group</button>
</div>
<div group role="group" aria-label="Large">
  <button view="secondary" size="lg">Large</button>
  <button view="secondary" size="lg">Group</button>
</div>`,
    },
    {
      id: "vertical",
      title: "Vertical",
      description: "`group=\"vertical\"` stacks the buttons.",
      markup: `<div group="vertical" role="group" aria-label="Settings">
  <button view="secondary">Profile</button>
  <button view="secondary">Billing</button>
  <button view="secondary">Notifications</button>
</div>`,
    },
  ],

  api: [
    {
      title: "Attributes",
      description: "Put `group` on the element around the buttons — usually a `<div>`.",
      columns: ["Attribute", "Values", "Default", "Description"],
      codeColumns: [0, 1, 2],
      rows: [
        ["group", '"" | "vertical"', '""', "Joins the buttons inside; vertical stacks them."],
        ["aria-pressed", '"true" | "false"', "—", "On a button: shows it as selected (segmented control)."],
        ["aria-current", "string", "—", "On a button: shows it as the current item, e.g. the current page."],
      ],
    },
  ],

  accessibility: [
    "Add `role=\"group\"` (or `role=\"toolbar\"` for a toolbar) and an `aria-label` to the element with `group`.",
    "In a segmented control, `aria-pressed` tells screen readers which option is on — keep it in sync as the selection changes.",
    "Each button stays a native button: focusable, and announced on its own.",
  ],

  keyboard: [
    ["Tab", "Moves focus to the next button in the group."],
    ["Shift + Tab", "Moves focus to the previous button."],
    ["Enter or Space", "Activates the focused button."],
  ],
};
