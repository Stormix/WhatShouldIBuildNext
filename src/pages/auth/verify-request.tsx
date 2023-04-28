import FullLayout from '@/components/layouts/full';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../_app';

const SignIn: NextPageWithLayout = () => {
  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground">A sign in link has been sent to your email address.</p>
      </div>
    </>
  );
};

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};

export default SignIn;
