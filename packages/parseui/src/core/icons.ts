/**
 * Icon store behind `<i icon="name">`. An icon comes from, in order:
 *   1. icons registered in memory with registerIcons() — e.g. the whole
 *      set from `@parseui/icons`, so npm users make no network requests;
 *   2. the icon CDN: `${iconBaseUrl}${name}.svg`, fetched once per name.
 */
let baseUrl = `https://cdn.parseui.com/icons/${__PARSEUI_ICONS_VERSION__}/`;
const registered = new Map<string, string>();
const fetched = new Map<string, Promise<SVGSVGElement | null>>();

const ROOT_ATTRS: Record<string, string> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.8",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};

/** Where `<i icon>` loads icons it doesn't have in memory from. Must end with "/". */
export function setIconBaseUrl(url: string): void {
  baseUrl = url.endsWith("/") ? url : `${url}/`;
  fetched.clear();
}

/** Makes icons available by name without a network request: `{ name: innerSvgMarkup }`. */
export function registerIcons(icons: Record<string, string>): void {
  for (const [name, body] of Object.entries(icons)) registered.set(name, body);
}

function parseSvg(markup: string): SVGSVGElement | null {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  const svg = doc.documentElement;
  if (!(svg instanceof SVGSVGElement)) return null;
  // Icons are artwork only: drop anything that could run code.
  svg.querySelectorAll("script, foreignObject").forEach((el) => el.remove());
  for (const el of [svg, ...svg.querySelectorAll("*")]) {
    for (const attr of [...el.attributes]) {
      if (/^on/i.test(attr.name) || /^\s*javascript:/i.test(attr.value)) el.removeAttribute(attr.name);
    }
  }
  return svg;
}

function fromBody(body: string): SVGSVGElement | null {
  const attrs = Object.entries(ROOT_ATTRS)
    .map(([name, value]) => `${name}="${value}"`)
    .join(" ");
  return parseSvg(`<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${body}</svg>`);
}

/** A fresh `<svg>` for `name`, or null if it doesn't exist. */
export async function loadIcon(name: string): Promise<SVGSVGElement | null> {
  const body = registered.get(name);
  let template: SVGSVGElement | null;
  if (body !== undefined) {
    template = fromBody(body);
  } else {
    let pending = fetched.get(name);
    if (!pending) {
      pending = fetch(`${baseUrl}${encodeURIComponent(name)}.svg`)
        .then((response) => (response.ok ? response.text() : Promise.reject(new Error(String(response.status)))))
        .then(parseSvg)
        .catch(() => {
          console.warn(`[parseui] icon "${name}" not found at ${baseUrl}`);
          return null;
        });
      fetched.set(name, pending);
    }
    template = await pending;
  }
  return template ? (template.cloneNode(true) as SVGSVGElement) : null;
}
