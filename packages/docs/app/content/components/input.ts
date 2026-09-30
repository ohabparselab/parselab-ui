import type { ComponentDoc } from "../types";

export const inputDoc: ComponentDoc = {
  slug: "input",
  title: "Input",
  description:
    "A text input for forms and user data entry. ParseUI styles any native `<input>`, `<select>`, and `<textarea>` inside `<parse-ui>`; wrap one in `field` to add a label and a description.",
  badges: ["Stable", "Native <input>", "Shadow DOM"],

  usage: `<!-- An input on its own -->
<input type="email" placeholder="Email">

<!-- Field: label, input and description -->
<div field>
  <label for="email">Email</label>
  <input id="email" type="email" placeholder="name@example.com">
  <small>We'll never share your email.</small>
</div>

<!-- States: invalid, disabled, required (the label follows) -->
<input aria-invalid="true" placeholder="Invalid">
<input disabled placeholder="Disabled">
<input required placeholder="Required">

<!-- Other controls share the design -->
<input type="password" placeholder="Password">
<input type="file">
<select>
  <option>Option</option>
</select>
<textarea placeholder="Message"></textarea>

<!-- Input and button in a row -->
<div field="horizontal">
  <input type="search" placeholder="Search..." aria-label="Search">
  <button>Search</button>
</div>

<!-- Fields stacked, or side by side -->
<div field-group>
  <div field-group="horizontal">
    <div field><label for="first">First name</label><input id="first"></div>
    <div field><label for="last">Last name</label><input id="last"></div>
  </div>
</div>

<!-- A whole form: keep the form inside <parse-ui> -->
<form field-group>
  <div field><label for="name">Name</label><input id="name" required></div>
  <div field="horizontal"><button type="submit" view="primary">Submit</button></div>
</form>`,

  examples: [
    {
      id: "default",
      title: "Default",
      description:
        "Put a `<label>`, the control, and a `<small>` description in a `field`. Link the label to the input with `for` and `id`.",
      markup: `<div field>
  <label for="api-key">API Key</label>
  <input id="api-key" type="password" placeholder="sk-...">
  <small>Your API key is encrypted and stored securely.</small>
</div>`,
    },
    {
      id: "basic",
      title: "Basic",
      description: "An `<input>` on its own — no attributes needed.",
      markup: `<input type="email" placeholder="Email">`,
    },
    {
      id: "field",
      title: "Field",
      description: "A `field` stacks a label, the input, and an optional description with even spacing.",
      markup: `<div field>
  <label for="username">Username</label>
  <input id="username" placeholder="shadcn">
  <small>Choose a unique username for your account.</small>
</div>`,
    },
    {
      id: "field-group",
      title: "Field group",
      description: "A `field-group` stacks several fields to build a form. A horizontal `field` lines up its buttons.",
      markup: `<div field-group>
  <div field>
    <label for="name">Name</label>
    <input id="name" placeholder="Jordan Lee">
  </div>
  <div field>
    <label for="email">Email</label>
    <input id="email" type="email" placeholder="name@example.com">
    <small>We'll send updates to this address.</small>
  </div>
  <div field="horizontal">
    <button type="reset">Reset</button>
    <button type="submit" view="primary">Submit</button>
  </div>
</div>`,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "Add `disabled` to the input. Its label and description dim along with it.",
      markup: `<div field>
  <label for="disabled-email">Email</label>
  <input id="disabled-email" type="email" placeholder="Email" disabled>
  <small>This field is currently disabled.</small>
</div>`,
    },
    {
      id: "invalid",
      title: "Invalid",
      description:
        "Set `aria-invalid=\"true\"` to show an error. The border and ring turn red, and so does the field's label — screen readers announce the invalid state too.",
      markup: `<div field>
  <label for="invalid">Invalid Input</label>
  <input id="invalid" placeholder="Error" aria-invalid="true">
  <small>This field contains validation errors.</small>
</div>`,
    },
    {
      id: "file",
      title: "File",
      description: "`type=\"file\"` gets the same frame, with a quiet file button.",
      markup: `<div field>
  <label for="picture">Picture</label>
  <input id="picture" type="file">
  <small>Select a picture to upload.</small>
</div>`,
    },
    {
      id: "inline",
      title: "Inline",
      description: "`field=\"horizontal\"` puts the input and a button in a row.",
      markup: `<div field="horizontal">
  <input type="search" placeholder="Search..." aria-label="Search">
  <button>Search</button>
</div>`,
    },
    {
      id: "grid",
      title: "Grid",
      description: "`field-group=\"horizontal\"` places fields side by side.",
      markup: `<div field-group="horizontal">
  <div field>
    <label for="first-name">First Name</label>
    <input id="first-name" placeholder="Jordan">
  </div>
  <div field>
    <label for="last-name">Last Name</label>
    <input id="last-name" placeholder="Lee">
  </div>
</div>`,
    },
    {
      id: "required",
      title: "Required",
      description: "Add `required` and the field's label gets a red asterisk — no extra markup.",
      markup: `<div field>
  <label for="required">Required Field</label>
  <input id="required" placeholder="This field is required" required>
  <small>This field must be filled out.</small>
</div>`,
    },
    {
      id: "button-group",
      title: "Button group",
      description: "Put an input and a button in a `group` to join them into one control.",
      markup: `<div field>
  <label for="search">Search</label>
  <div group>
    <input id="search" type="search" placeholder="Type to search...">
    <button><i icon="search"></i> Search</button>
  </div>
</div>`,
    },
    {
      id: "select-textarea",
      title: "Select and textarea",
      description: "`<select>` and `<textarea>` share the same design. A textarea grows with its content where the browser supports it.",
      markup: `<div field-group>
  <div field>
    <label for="country">Country</label>
    <select id="country">
      <option>United States</option>
      <option>Bangladesh</option>
      <option>Germany</option>
    </select>
  </div>
  <div field>
    <label for="message">Message</label>
    <textarea id="message" placeholder="Type your message here."></textarea>
  </div>
</div>`,
    },
    {
      id: "form",
      title: "Form",
      description:
        "A full form. Put the whole `<form>` inside `<parse-ui>` so its inputs submit with it — a form outside can't see them.",
      markup: `<form field-group>
  <div field-group="horizontal">
    <div field>
      <label for="form-name">Name</label>
      <input id="form-name" placeholder="Jordan Lee" required>
    </div>
    <div field>
      <label for="form-phone">Phone</label>
      <input id="form-phone" type="tel" placeholder="+1 (555) 123-4567">
    </div>
  </div>
  <div field>
    <label for="form-email">Email</label>
    <input id="form-email" type="email" placeholder="name@example.com" required>
    <small>We'll never share your email with anyone.</small>
  </div>
  <div field>
    <label for="form-country">Country</label>
    <select id="form-country">
      <option>United States</option>
      <option>United Kingdom</option>
      <option>Bangladesh</option>
    </select>
  </div>
  <div field>
    <label for="form-address">Address</label>
    <input id="form-address" placeholder="123 Main St">
  </div>
  <div field="horizontal">
    <button type="button">Cancel</button>
    <button type="submit" view="primary">Submit</button>
  </div>
</form>`,
    },
  ],

  api: [
    {
      title: "Attributes",
      description:
        "Every native attribute works (`type`, `name`, `value`, `placeholder`, `pattern`…). These change how ParseUI draws the control:",
      columns: ["Attribute", "On", "Description"],
      codeColumns: [0, 1],
      rows: [
        ["aria-invalid=\"true\"", "input, select, textarea", "Red border and ring; the field's label turns red."],
        ["disabled", "input, select, textarea", "Dimmed and not editable; the field's label and description dim too."],
        ["required", "input, select, textarea", "The field's label gets a red asterisk."],
        ["field", "any wrapper", "Stacks a label, a control and a <small> description."],
        ["field=\"horizontal\"", "any wrapper", "The same, in a row — the control takes the free space."],
        ["field-group", "any wrapper, e.g. <form>", "Stacks fields 20px apart."],
        ["field-group=\"horizontal\"", "any wrapper", "Puts fields side by side, sharing the width."],
      ],
    },
    {
      title: "Design tokens",
      description: "Override on the element, e.g. `parse-ui { --p-input-radius: 6px; }`.",
      columns: ["Token", "Default", "Used for"],
      codeColumns: [0, 1],
      rows: [
        ["--p-input-border", "oklch(0.922 0 0)", "Border (rgba(255,255,255,.15) in the dark theme)."],
        ["--p-input-bg", "transparent", "Background (rgba(255,255,255,.045) in the dark theme)."],
        ["--p-input-ring", "oklch(0.708 0 0)", "Focus border, and the 3px focus ring at 50%."],
        ["--p-input-muted", "oklch(0.556 0 0)", "Placeholder and description text."],
        ["--p-input-radius", "0.625rem", "Corner radius."],
        ["--p-color-danger", "#dc3e42", "Invalid border, ring and label; the required asterisk."],
      ],
    },
  ],

  accessibility: [
    "Always pair a control with a `<label for>` — or an `aria-label` when there's no visible label, as in the inline search.",
    "Connect a description with `aria-describedby=\"<id of the small>\"` so screen readers read it with the field.",
    "`aria-invalid=\"true\"` is what screen readers announce, and the same attribute draws the error style — they can't drift apart.",
    "`<label for>` only reaches an input inside the same `<parse-ui>`.",
  ],

  keyboard: [
    ["Tab", "Moves focus to the next field."],
    ["Shift + Tab", "Moves focus to the previous field."],
    ["Enter", "Submits the form, from a text input inside it."],
  ],
};
