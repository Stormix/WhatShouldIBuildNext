// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { version } from 'src/version.ts';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN || 'https://af355dd205424e8fa64ed6360deee7a3@o84215.ingest.sentry.io/4504976186802176',
  tracesSampleRate: 1.0,
  release: version
});
