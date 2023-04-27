import Head from 'next/head';
import { type PropsWithChildren } from 'react';
import { APP_NAME } from '../../config/app';
import Footer from '../molecules/Footer';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="flex h-full w-full flex-col items-center">
        <Head>
          <title>What Should I Build Next - Generate Random Development Project Ideas</title>
          <meta
            name="description"
            content={`${APP_NAME} is a free tool that generates random development project ideas based on your preferences. Use it to kickstart your next hackathon project or find inspiration for your next side project.`}
          />
        </Head>

        <main className="flex w-full flex-col">
          <div className="flex flex-grow flex-col">{children}</div>
          <Footer />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
