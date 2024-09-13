// src/app/protected/page.tsx
'use client';

import { useSession } from 'next-auth/react';

export default function ProtectedPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    return <p>Access Denied</p>;
  }

  return <p>Welcome, {session.user?.username}</p>;
}
