// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/utils/theme/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={false}>
      <ThemeProvider>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
