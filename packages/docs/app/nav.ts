export interface NavItem {
  title: string;
  /** Path within a version prefix, e.g. "/introduction". Joined as `${versionPrefix}${path}`. */
  path: string;
  /** Small label next to the title, e.g. "New" (sidebar and the components overview). */
  badge?: string;
}

/** The components overview page (lists every component). */
export const COMPONENTS_OVERVIEW = "/components";

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
      { title: "Overview", path: COMPONENTS_OVERVIEW },
      { title: "Button", path: "/components/button" },
      { title: "Button group", path: "/components/button-group", badge: "New" },
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

/** Every component page (the Components section minus its overview), in nav order. */
export const COMPONENT_NAV: NavItem[] = FLAT_NAV.filter((item) => item.path.startsWith(`${COMPONENTS_OVERVIEW}/`));
