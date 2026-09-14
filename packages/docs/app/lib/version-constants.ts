// Shared between server (versions.server.ts) and client (VersionSwitcher) —
// deliberately NOT in a `.server.ts` file, which Remix strips from the
// client bundle entirely.
export const NEXT_VERSION = "next";
