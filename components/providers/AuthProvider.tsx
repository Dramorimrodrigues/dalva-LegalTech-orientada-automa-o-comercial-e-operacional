// =============================================================
// DALVA — Session Provider (Client-side)
// Wraps the app with NextAuth session context
// =============================================================

'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
