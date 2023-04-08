import { api } from '@/utils/api';
import { Analytics } from '@vercel/analytics/react';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { type AppType } from 'next/app';
import { Toaster } from 'react-hot-toast';

import '@/styles/globals.css';

import MainLayout from '@/components/layouts/main';

const App: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" storageKey="nightwind-mode" defaultTheme="dark">
        <MainLayout>
          <Toaster position="bottom-center" reverseOrder={false} />
          <Component {...pageProps} />
          <Analytics />
        </MainLayout>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(App);
