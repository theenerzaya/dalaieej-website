import type { ReactNode } from "react";

export interface PageShellProps {
  /**
   * When true (default), the shell reserves top padding equal to the fixed
   * navbar height. Set to false for pages that use their own full-viewport
   * hero (the navbar floats over the hero and the hero owns the top band).
   */
  offsetNavbar?: boolean;
  /** Optional extra classes applied to <main>. */
  className?: string;
  children: ReactNode;
}

/**
 * Canonical wrapper for page-level routes. Gives every page:
 *   - the `#main-content` landmark (for the skip-link in the root layout)
 *   - `min-h-screen` + surface background
 *   - the font-body stack
 *   - a top offset matching the fixed navbar (unless `offsetNavbar={false}`)
 *
 * Navbar height lives in `--navbar-h` (see globals.css) so it stays in sync
 * with `<Navbar />` itself.
 */
export default function PageShell({
  offsetNavbar = true,
  className,
  children,
}: PageShellProps) {
  const base = "relative min-h-screen bg-surface font-body";
  const offset = offsetNavbar ? "pt-[var(--navbar-h)]" : "";
  const combined = [base, offset, className].filter(Boolean).join(" ");

  return (
    <main id="main-content" className={combined}>
      {children}
    </main>
  );
}
