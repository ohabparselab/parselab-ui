# CDN setup

Load ParseUI with a single script tag. No build step, no framework, no package manager.

## Add the script

Put it in your page's `<head>`. Always pin an exact version, so a new release never changes your site without you knowing:

```html
<!doctype html>
<html>
  <head>
    <script src="https://cdn.parseui.com/1.0.0/parseui.min.js"></script>
  </head>
  <body>
    <parse-ui>
      <button view="primary">Save changes</button>
    </parse-ui>
  </body>
</html>
```

The script is about 5 KB gzipped and registers `<parse-ui>` as soon as it loads.

## The `<parseui>` tag

In plain HTML you can also write `<parseui>` — ParseUI converts it to `<parse-ui>` automatically:

```html
<parseui>
  <button view="primary">Save changes</button>
</parseui>
```

Custom element names must contain a hyphen, so `<parse-ui>` is the real tag. Use `<parse-ui>` whenever a framework renders the markup.

## Handling clicks

Native event handlers work as usual:

```html
<parse-ui>
  <button view="primary" onclick="save()">Save</button>
</parse-ui>
```

To find an element with JavaScript, look inside the shadow root:

```js
const ui = document.querySelector("parse-ui");
const button = ui.shadowRoot.querySelector("button");
button.addEventListener("click", save);
```

## Theme

Light by default. Set `mode="dark"` to force dark, or `mode="auto"` to follow the visitor's OS setting:

```html
<parse-ui mode="auto">…</parse-ui>
```

## Customize

Override design tokens on the element:

```html
<style>
  parse-ui {
    --p-color-primary: #16a34a;
    --p-radius: 4px;
  }
</style>
```

Page CSS doesn't reach inside `<parse-ui>`, so put your own layout styles in a `<style>` tag inside it:

```html
<parse-ui>
  <style>
    .actions { display: flex; gap: 8px; }
  </style>
  <div class="actions">
    <button view="primary">Save</button>
    <button>Cancel</button>
  </div>
</parse-ui>
```

## Global API

The CDN build exposes `window.ParseUI`:

| Property | Description |
|---|---|
| `ParseUI.version` | The loaded version, e.g. `"1.0.0"`. |
| `ParseUI.registerComponent(definition)` | Adds a component's CSS (and optional setup) to every `<parse-ui>`. |
| `ParseUI.registerIcons(icons)` | Makes icons available by name without a network request: `{ name: innerSvgMarkup }`. |
| `ParseUI.setIconBaseUrl(url)` | Where `<i icon>` loads SVGs from. Default `https://cdn.parseui.com/icons/1.0.0/`. |
