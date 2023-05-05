import { CONSENT_COOKIE_NAME } from '@/config/app';
import { hasCookie, setCookie } from 'cookies-next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from './Button';

const CookieConsent = () => {
  const [hideConsent, setHideConsent] = useState(true);

  useEffect(() => {
    setHideConsent(hasCookie(CONSENT_COOKIE_NAME));
  }, []);

  const acceptCookie = () => {
    setHideConsent(true);
    setCookie(CONSENT_COOKIE_NAME, 'true', {});
  };

  const rejectCookie = () => {
    setHideConsent(true);
    setCookie(CONSENT_COOKIE_NAME, 'false', {});
  };

  if (hideConsent) {
    return null;
  }

  return (
    <div className="relative z-30">
      <div className="fixed inset-0 bg-black bg-opacity-70">
        <div className="z-70 fixed left-0 right-0 top-0 flex items-center  bg-background px-4 py-8">
          <span className="mr-16 flex-grow text-base text-foreground">
            This website uses cookies to improve user experience. By using our website you consent to all cookies in
            accordance with our{' '}
            <Link href="/privacy" className="text-accent" target="_blank">
              Privacy Policy
            </Link>
            .
          </span>
          <Button onClick={() => acceptCookie()}>Accept</Button>
          <Button variant={'text'} onClick={() => rejectCookie()}>
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
