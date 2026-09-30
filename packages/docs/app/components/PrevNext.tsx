import { Link } from "@remix-run/react";
import { FLAT_NAV } from "~/nav";

export function PrevNext({ path, versionPrefix }: { path: string; versionPrefix: string }) {
  const index = FLAT_NAV.findIndex((item) => item.path === path);
  if (index === -1) return null;
  const prev = FLAT_NAV[index - 1];
  const next = FLAT_NAV[index + 1];

  return (
    <nav className="prev-next" aria-label="Pagination">
      {prev ? (
        <Link to={`${versionPrefix}${prev.path}`} className="prev">
          <span>Previous</span>
          <strong>{prev.title}</strong>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to={`${versionPrefix}${next.path}`} className="next">
          <span>Next</span>
          <strong>{next.title}</strong>
        </Link>
      )}
    </nav>
  );
}
