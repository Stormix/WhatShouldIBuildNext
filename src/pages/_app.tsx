import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { type AppType } from 'next/app';

import { api } from '@/utils/api';

import MainLayout from '@/components/layouts/main';
import '@/styles/globals.css';

const App: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" storageKey="nightwind-mode" defaultTheme="dark">
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(App);
