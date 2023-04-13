import { api } from '@/utils/api';
import { Analytics } from '@vercel/analytics/react';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { type AppType } from 'next/app';
import { Toaster } from 'react-hot-toast';

import '@/styles/globals.css';

import FeedbackModal from '@/components/atoms/FeedbackModal';
import MainLayout from '@/components/layouts/main';
import { env } from '@/env.mjs';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const App: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" storageKey="nightwind-mode" defaultTheme="dark">
          <MainLayout>
            <Toaster position="bottom-center" reverseOrder={false} />
            <Component {...pageProps} />
            <Analytics />
            <FeedbackModal />
          </MainLayout>
        </ThemeProvider>
      </SessionProvider>
    </GoogleReCaptchaProvider>
  );
};

export default api.withTRPC(App);
