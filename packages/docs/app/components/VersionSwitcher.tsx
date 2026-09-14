import type { ChangeEvent } from "react";
import { useLocation, useNavigate, useParams } from "@remix-run/react";
import { NEXT_VERSION } from "~/lib/version-constants";

export function VersionSwitcher({ versions }: { versions: string[] }) {
  const { version } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const current = version ?? NEXT_VERSION;

  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextVersion = event.target.value;
    // Everything after "/docs/<version>" — preserved so switching versions
    // keeps you on the same page (e.g. .../components/button) when possible.
    const rest = location.pathname.replace(/^\/docs\/[^/]+/, "");
    navigate(`/docs/${nextVersion}${rest}`);
  }

  return (
    <select className="version-switcher" value={current} onChange={onChange} aria-label="Docs version">
      <option value={NEXT_VERSION}>Next (unreleased)</option>
      {versions.map((v) => (
        <option key={v} value={v}>
          v{v}
        </option>
      ))}
    </select>
  );
}
