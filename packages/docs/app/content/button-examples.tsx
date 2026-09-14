import type { ReactNode } from "react";
import { Button } from "@parselabllc/ui/react";

export interface ButtonExample {
  id: string;
  title: string;
  description: string;
  /** Raw HTML snippet shown (and copied) in the code card — the source of truth for both. */
  code: string;
  render: () => ReactNode;
}

// Prevents the two href examples from actually navigating away from the
// docs page when clicked in the live preview; the *displayed* code still
// shows a real-looking href, since this is a preview-only concern.
function preventNavigation(event: { preventDefault: () => void }) {
  event.preventDefault();
}

export const BUTTON_EXAMPLES: ButtonExample[] = [
  {
    id: "basic-button",
    title: "A basic button",
    description: "Create a button with a text label to trigger an action. This is the default (secondary) styling.",
    code: `<p-button>Save</p-button>`,
    render: () => <Button>Save</Button>,
  },
  {
    id: "primary-and-secondary",
    title: "Primary and secondary actions",
    description: "Pair a primary button for the main action with a secondary button for a less prominent one.",
    code: `<p-button variant="primary">Save</p-button>\n<p-button variant="secondary">Cancel</p-button>`,
    render: () => (
      <>
        <Button variant="primary">Save</Button>
        <Button variant="secondary">Cancel</Button>
      </>
    ),
  },
  {
    id: "all-variants",
    title: "Set visual emphasis with variants",
    description:
      "Use variant to establish a clear visual hierarchy between primary, secondary, tertiary, and plain actions.",
    code: `<p-button variant="primary">Primary</p-button>
<p-button variant="secondary">Secondary</p-button>
<p-button variant="tertiary">Tertiary</p-button>
<p-button variant="plain">Plain</p-button>`,
    render: () => (
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="plain">Plain</Button>
      </>
    ),
  },
  {
    id: "tones",
    title: "Communicate intent with tone",
    description:
      "Apply tone to signal an action's purpose — critical tints a button red for destructive actions, neutral keeps it understated, and the default (auto) follows the variant.",
    code: `<p-button tone="critical">Delete</p-button>
<p-button tone="neutral" variant="tertiary">Dismiss</p-button>
<p-button>Continue</p-button>`,
    render: () => (
      <>
        <Button tone="critical">Delete</Button>
        <Button tone="neutral" variant="tertiary">
          Dismiss
        </Button>
        <Button>Continue</Button>
      </>
    ),
  },
  {
    id: "loading-state",
    title: "Show loading feedback during async operations",
    description:
      "Set loading to show a spinner and block interaction while an action is in progress, without changing the button's layout width.",
    code: `<p-button loading variant="primary">Saving...</p-button>\n<p-button loading variant="secondary">Updating...</p-button>`,
    render: () => (
      <>
        <Button loading variant="primary">
          Saving...
        </Button>
        <Button loading variant="secondary">
          Updating...
        </Button>
      </>
    ),
  },
  {
    id: "disabled-and-submit",
    title: "Disable buttons and submit forms",
    description:
      'Set disabled to prevent interaction when prerequisites aren\'t met, and type="submit" to integrate with native HTML forms.',
    code: `<p-button disabled>Save draft</p-button>\n<p-button type="submit" variant="primary">Save product</p-button>`,
    render: () => (
      <>
        <Button disabled>Save draft</Button>
        <Button type="submit" variant="primary">
          Save product
        </Button>
      </>
    ),
  },
  {
    id: "link-buttons",
    title: "Use buttons for navigation",
    description:
      "Set href to render the button as a link while keeping button styling — target and download behave like their native anchor equivalents.",
    code: `<p-button href="/products">View products</p-button>\n<p-button href="/help" target="_blank">Help docs</p-button>`,
    render: () => (
      <>
        <Button href="#" onClick={preventNavigation}>
          View products
        </Button>
        <Button href="#" target="_blank" onClick={preventNavigation}>
          Help docs
        </Button>
      </>
    ),
  },
  {
    id: "confirmation-pattern",
    title: "Confirm destructive actions",
    description:
      "Pair a neutral cancel action with a critical-toned confirmation button to help avoid accidental destructive operations.",
    code: `<p-button variant="secondary">Cancel</p-button>\n<p-button variant="primary" tone="critical">Delete variant</p-button>`,
    render: () => (
      <>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary" tone="critical">
          Delete variant
        </Button>
      </>
    ),
  },
];
