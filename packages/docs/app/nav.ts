export interface NavItem {
  title: string;
  /** Path within a version prefix, e.g. "/introduction". Joined as `${versionPrefix}${path}`. */
  path: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    title: "Getting started",
    items: [
      { title: "Introduction", path: "/introduction" },
      { title: "Installation", path: "/installation" },
      { title: "CDN (JS)", path: "/cdn" },
      { title: "npm", path: "/npm" },
    ],
  },
  {
    title: "Foundations",
    items: [{ title: "Icons", path: "/icons" }],
  },
  {
    title: "Components",
    items: [
      { title: "Button", path: "/components/button" },
      { title: "Button group", path: "/components/button-group" },
    ],
  },
];

/** All pages in reading order — drives the Previous/Next links. */
export const FLAT_NAV: (NavItem & { section: string })[] = NAV.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.title })),
);

/** Markdown-backed pages (docs/<slug>.md). */
export const GUIDE_SLUGS: string[] = NAV[0].items.map((item) => item.path.slice(1));

export function sectionOf(path: string): string | undefined {
  return FLAT_NAV.find((item) => item.path === path)?.section;
}
