import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type PropsWithChildren } from 'react';
import { APP_NAME } from '../../config/app';
import DarkModeSwitch from '../atoms/DarkModeSwitch';
import Logo from '../atoms/Logo';
import { Separator } from '../atoms/Separator';

const FullLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const goBack = () => {
    // if there's a previous page, go back to it
    if (window.history.length > 1) {
      window.history.back();
    }

    // otherwise, go to the homepage
    router.push('/');
  };
  return (
    <>
      <div className="flex h-full w-screen flex-col items-center md:h-screen">
        <Head>
          <title>What Should I Build Next - Generate Random Development Project Ideas</title>
          <meta
            name="description"
            content={`${APP_NAME} is a free tool that generates random development project ideas based on your preferences. Use it to kickstart your next hackathon project or find inspiration for your next side project.`}
          />
        </Head>
        <main className="flex h-full w-full flex-col items-center justify-center [&>div]:w-full">
          <header className="absolute top-0 flex w-full items-center justify-between px-8 py-8">
            <Link href="#" onClick={goBack} className="text-sm">
              <span aria-hidden="true">&larr;</span> Back{' '}
            </Link>
            <DarkModeSwitch />
          </header>
          <div className="container relative flex flex-col items-center justify-center lg:max-w-none  lg:px-0">
            <div className="flex w-full flex-col lg:p-8">
              <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col items-center gap-4 text-center">
                  <Logo footer />
                  <Separator className="my-4 max-w-[100px]" />
                </div>
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default FullLayout;
