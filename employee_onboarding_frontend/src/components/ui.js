import React from "react";

/** PUBLIC_INTERFACE */
export function Badge({ tone = "neutral", children }) {
  /** Small status/tag pill badge. */
  return <span className={`ui-badge ui-badge--${tone}`}>{children}</span>;
}

/** PUBLIC_INTERFACE */
export function IconDot({ tone = "neutral" }) {
  /** Small dot indicator used for statuses. */
  return <span className={`ui-dot ui-dot--${tone}`} aria-hidden="true" />;
}

/** PUBLIC_INTERFACE */
export function ProgressBar({ value }) {
  /** Progress bar (0..100). */
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return (
    <div className="ui-progress" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className="ui-progress__bar" style={{ width: `${clamped}%` }} />
    </div>
  );
}

/** PUBLIC_INTERFACE */
export function Card({ title, subtitle, right, children, onClick }) {
  /** Card container for lists/grids. */
  const Tag = onClick ? "button" : "div";
  return (
    <Tag className={`ui-card ${onClick ? "ui-card--clickable" : ""}`} onClick={onClick}>
      {(title || subtitle || right) && (
        <div className="ui-card__header">
          <div className="ui-card__headerText">
            {title && <div className="ui-card__title">{title}</div>}
            {subtitle && <div className="ui-card__subtitle">{subtitle}</div>}
          </div>
          {right && <div className="ui-card__right">{right}</div>}
        </div>
      )}
      <div className="ui-card__body">{children}</div>
    </Tag>
  );
}
