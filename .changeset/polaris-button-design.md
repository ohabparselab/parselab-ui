---
"@parselabllc/ui": patch
---

Redesign `<p-button>`'s default look to match Shopify Polaris's own default button — light-mode colors, 8px radius, Inter typography, and padding are Polaris's actual `@shopify/polaris-tokens` values (primary now near-black `#303030` rather than indigo, secondary is white with a subtle border rather than filled gray, critical uses Polaris's red). Also fixes `--p-color-border`/`--p-color-text` not being visible against dark backgrounds — `variant="tertiary"`'s border and text were effectively invisible whenever the page didn't happen to match the component's light-mode fallback colors, since nothing actually loaded `@parselabllc/ui/tokens.css`. Dark-mode values (not part of Polaris, which has no official dark theme) are this package's own adaptation, and now apply for an explicit `data-theme="dark"` host attribute too, not just OS `prefers-color-scheme`.
