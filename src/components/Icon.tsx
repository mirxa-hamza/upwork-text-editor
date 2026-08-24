type IconProps = {
  name: string;
  className?: string;
  /** Solid/filled variant (Google's Material Symbols FILL axis), e.g. for the Copy button. */
  filled?: boolean;
};

/**
 * Thin wrapper around a Material Symbols Outlined glyph. The font itself is
 * loaded once in app/layout.tsx (Google's stylesheet ships the
 * `.material-symbols-outlined` class already, see globals.css for the
 * default variation-settings) — this component just renders the ligature
 * text Google's font substitutes for the named icon.
 */
export default function Icon({ name, className = '', filled = false }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
