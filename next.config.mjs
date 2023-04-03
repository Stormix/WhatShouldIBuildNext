/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'));

import { execSync } from 'child_process';

const commitHash = execSync('git rev-parse --short HEAD').toString()?.replace('\n', '');
const timestamp = execSync('git log -1 --format=%ct').toString()?.replace('\n', '');

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ['en'],
    defaultLocale: 'en'
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  swcMinify: true,
  env: {
    NEXT_PUBLIC_COMMIT_HASH: commitHash,
    NEXT_PUBLIC_COMMIT_TIMESTAMP: timestamp
  },
  images: {
    domains: ['cdn.discordapp.com', 'avatars.githubusercontent.com']
  }
};
export default config;
