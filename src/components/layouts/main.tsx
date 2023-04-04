import Head from 'next/head';
import { type PropsWithChildren } from 'react';
import Footer from '../molecules/Footer';
import Header from '../molecules/Header';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="flex h-full w-full flex-col items-center">
        <Head>
          <title>HackIdeas - Generate Random Development Project Ideas</title>
          <meta
            name="description"
            content="HackIdeas is a free tool that generates random development project ideas based on your preferences. Use it to kickstart your next hackathon project or find inspiration for your next side project."
          />
        </Head>

        <main className="flex h-screen w-full flex-col">
          <Header />
          {children}
          <Footer />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
