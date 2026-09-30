import { Inline } from "./Inline";

export function PageHeader({
  eyebrow,
  title,
  description,
  badges = [],
}: {
  eyebrow: string;
  title: string;
  description: string;
  badges?: string[];
}) {
  return (
    <header className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lead">
        <Inline text={description} />
      </p>
      {badges.length > 0 && (
        <div className="badges">
          {badges.map((badge, index) => (
            <span key={badge} className={index === 0 ? "badge badge-success" : "badge"}>
              {badge}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
