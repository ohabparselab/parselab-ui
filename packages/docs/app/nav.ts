export interface NavItem {
  title: string;
  /** Path within a version prefix, e.g. "/getting-started", "/components/button". Joined as `${versionPrefix}${path}`. */
  path: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    title: "Getting started",
    items: [{ title: "Setup", path: "/getting-started" }],
  },
  {
    title: "Components",
    items: [{ title: "Button", path: "/components/button" }],
  },
];
