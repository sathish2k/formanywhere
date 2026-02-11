/**
 * Auth Layout
 * Minimal layout wrapper for auth pages (no header/footer)
 */

import type { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
