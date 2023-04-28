import FullLayout from '@/components/layouts/full';
import { UserAuthForm } from '@/components/molecules/UserAuthForm';
import { authOptions } from '@/server/auth';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth/next';
import { getProviders } from 'next-auth/react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../_app';

export type Providers = InferGetServerSidePropsType<typeof getServerSideProps>['providers'];

const SignIn: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ providers }) => {
  return (
    <>
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

  return {
    props: { providers: providers ?? [] }
  };
}

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};

export default SignIn;
