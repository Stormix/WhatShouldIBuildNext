import DarkModeSwitch from '@/components/atoms/DarkModeSwitch';
import Logo from '@/components/atoms/Logo';
import { Separator } from '@/components/atoms/Separator';
import FullLayout from '@/components/layouts/full';
import { UserAuthForm } from '@/components/molecules/UserAuthForm';
import { authOptions } from '@/server/auth';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth/next';
import { getCsrfToken, getProviders } from 'next-auth/react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../_app';

export type Providers = InferGetServerSidePropsType<typeof getServerSideProps>['providers'];

const SignIn: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  providers,
  csrfToken
}) => {
  return (
    <>
      <header className="absolute top-0 flex w-full items-center justify-between px-8 py-8">
        <Link href="/" className="text-sm">
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
            <UserAuthForm providers={providers} />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By signing in , you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/' } };
  }

  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: { providers: providers ?? [], csrfToken }
  };
}

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};

export default SignIn;
