import FAQ from '@/components/molecules/FAQ';
import Hero from '@/components/molecules/Home';
import { APP_NAME } from '@/config/app';
import { type NextPage } from 'next';
import { NextSeo } from 'next-seo';

const FAQPage: NextPage = () => {
  return (
    <>
      <NextSeo
        title={`FAQ - ${APP_NAME}`}
        description={`${APP_NAME} is a free tool that generates random development project ideas based on your preferences. Use it to kickstart your next hackathon project or find inspiration for your next side project.`}
      />
      <Hero>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="mb-8 mt-6 max-w-2xl text-lg leading-8">
          Feel free to reach out if you can&apos;t find an answer.
        </p>
      </Hero>
      <div className="container mx-auto mb-12 grid grid-cols-1 gap-8">
        <FAQ />
      </div>
    </>
  );
};

export default FAQPage;
