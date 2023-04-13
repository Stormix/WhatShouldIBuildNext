import FAQ from '@/components/molecules/FAQ';
import Hero from '@/components/molecules/Hero';
import { APP_NAME } from '@/config/app';
import { type NextPage } from 'next';
import { NextSeo } from 'next-seo';

const Home: NextPage = () => {
  return (
    <>
      <NextSeo
        title={`${APP_NAME} - Generate Random Development Project Ideas`}
        description={`${APP_NAME} is a free tool that generates random development project ideas based on your preferences. Use it to kickstart your next hackathon project or find inspiration for your next side project.`}
      />
      <Hero />
      <FAQ />
    </>
  );
};

export default Home;
