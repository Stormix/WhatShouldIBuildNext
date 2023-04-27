import { api } from '@/utils/api';
import { Analytics } from '@vercel/analytics/react';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';

import '@/styles/main.scss';

import FeedbackModal from '@/components/atoms/FeedbackModal';
import MainLayout from '@/components/layouts/main';
import { env } from '@/env.mjs';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export type NextPageWithLayout<P = { session: Session | null }, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
} & { session: Session | null };

const App = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>);
  return (
    <GoogleReCaptchaProvider reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" storageKey="nightwind-mode" defaultTheme="dark">
          <Toaster position="bottom-center" reverseOrder={false} />
          {getLayout(<Component {...pageProps} />)}
          <Analytics />
          <FeedbackModal />
        </ThemeProvider>
      </SessionProvider>
    </GoogleReCaptchaProvider>
  );
};

export default api.withTRPC(App);
