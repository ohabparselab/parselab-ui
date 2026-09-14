import type { ChangeEvent } from "react";
import { useLocation, useNavigate, useParams } from "@remix-run/react";
import { NEXT_VERSION } from "~/lib/version-constants";

export function VersionSwitcher({ versions }: { versions: string[] }) {
  const { version } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // No :version in the URL means "latest" — shown pre-selected as the
  // newest released version (falling back to Next if none has been cut).
  const current = version ?? versions[0] ?? NEXT_VERSION;
  const versionPrefix = version ? `/docs/${version}` : "/docs";

  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextVersion = event.target.value;
    // Everything after the current version prefix — preserved so switching
    // versions keeps you on the same page (e.g. .../components/button) when
    // possible. Picking a version always lands on its explicit /docs/<version>
    // URL, even when that version happens to be the latest one.
    const rest = location.pathname.slice(versionPrefix.length);
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
