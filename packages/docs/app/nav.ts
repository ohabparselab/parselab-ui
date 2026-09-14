export interface NavItem {
  title: string;
  /** Path within a version, e.g. "" for the version's index, "/components/button". Joined as `/docs/${version}${path}`. */
  path: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    title: "Getting started",
    items: [{ title: "Setup", path: "" }],
  },
  {
    title: "Components",
    items: [{ title: "Button", path: "/components/button" }],
  },
];
