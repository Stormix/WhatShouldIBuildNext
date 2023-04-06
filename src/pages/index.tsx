import FAQ from '@/components/molecules/FAQ';
import Hero from '@/components/molecules/Hero';
import { type NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <Hero />
      <FAQ />
    </>
  );
};

export default Home;
