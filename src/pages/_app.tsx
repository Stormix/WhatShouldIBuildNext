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
import { CONSENT_COOKIE_NAME } from '@/config/app';
import { env } from '@/env.mjs';
import { getCookie, hasCookie } from 'cookies-next';
import mixpanel from 'mixpanel-browser';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { useEffect } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export type NextPageWithLayout<P = { session: Session | null }, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
} & { session: Session | null };

const App = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>);
  const hasConsent = hasCookie(CONSENT_COOKIE_NAME) && getCookie(CONSENT_COOKIE_NAME) === 'true';

  useEffect(() => {
    mixpanel.init('fed8b4d292d89543351dec7dc17f93fa', { debug: true, ignore_dnt: hasConsent });
  }, [hasConsent]);

  return (
    <GoogleReCaptchaProvider reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" storageKey="nightwind-mode" defaultTheme="dark">
          <Toaster position="bottom-center" reverseOrder={false} />
          {getLayout(<Component {...pageProps} />)}
          {hasConsent && <Analytics />}
          <FeedbackModal />
        </ThemeProvider>
      </SessionProvider>
    </GoogleReCaptchaProvider>
  );
};

export default api.withTRPC(App);
