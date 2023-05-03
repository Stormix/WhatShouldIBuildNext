import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:image" content="https://whatshouldibuildnext.com/api/og" />
        <meta property="twitter:image" content="https://whatshouldibuildnext.com/api/og" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:title"
          content="What should I build next? - Generate Random Development Project Ideas"
        />
        <meta
          property="twitter:description"
          content="A free tool that generates detailed development project ideas based on your preferences. Use it to kickstart your next hackathon project or find inspiration for your next side project."
        />
        <meta property="og:url" content="https://whatshouldibuildnext.com/api/og" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
