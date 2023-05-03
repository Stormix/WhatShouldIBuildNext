import Button from '@/components/atoms/Button';
import Hero from '@/components/molecules/Home';
import { APP_NAME } from '@/config/app';
import { type NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

const FAQPage: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <NextSeo
        title={`Not found - ${APP_NAME}`}
        description={`${APP_NAME} is a free tool that generates random development project ideas based on your preferences. Use it to kickstart your next hackathon project or find inspiration for your next side project.`}
      />
      <Hero>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight">Emm, this is awkward..</h1>
        <p className="mb-8 mt-6 max-w-2xl text-lg leading-8">
          We couldn&apos;t find the page you&apos;re looking for.{' '}
        </p>
      </Hero>
      <div className="mx-auto">
        <Button className="" onClick={() => router.push('/')}>
          Go back home
        </Button>
      </div>
    </>
  );
};

export default FAQPage;
