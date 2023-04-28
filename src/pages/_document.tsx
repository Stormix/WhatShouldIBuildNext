import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:image" content="https://whatshouldibuildnext.com/api/og" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
