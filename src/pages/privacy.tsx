import Hero from '@/components/molecules/Home';
import { APP_NAME } from '@/config/app';
import { type NextPage } from 'next';
import { NextSeo } from 'next-seo';

const PrivacyPolicy: NextPage = () => {
  return (
    <>
      <NextSeo
        title={`Privacy Policy - ${APP_NAME}`}
        description={`${APP_NAME} is a free tool that generates random development project ideas based on your preferences. Use it to kickstart your next hackathon project or find inspiration for your next side project.`}
      />
      <Hero>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight">Privacy Policy</h1>
      </Hero>
      <div className="container mb-12 grid grid-cols-1 gap-8  px-24">
        <div className="flex flex-col gap-4">
          <p className="text-lg">
            Your privacy is important to us. It is <b>{APP_NAME}&apos;s</b> policy to respect your privacy regarding any
            information we may collect from you across our website,
            <a href="https://whatshouldibuildnext.com/" className="text-accent">
              https://whatshouldibuildnext.com/
            </a>
            , and other sites we own and operate.
          </p>
          <p className="text-lg">
            This Privacy Policy explains how we collect, use, and disclose your personal information when you use our
            development project idea generator website.
          </p>
          <h3>Information We Collect</h3>
          <p className="text-lg">
            We collect information you provide directly to us when you sign up for an account or use our website, such
            as your name and email address. We also collect information automatically when you use our website, such as
            your IP address, browser type, and usage data.
          </p>
          <h3>Use of Information</h3>
          <p className="text-lg">
            We use the information we collect to provide and improve our website, to communicate with you, and to
            personalize your experience. We may also use the information for research purposes, to analyze trends and
            usage patterns, and to comply with legal obligations.
          </p>
          <h3>Disclosure of Information</h3>
          <p className="text-lg">
            We may disclose your information to third-party service providers that help us operate our website or to
            comply with legal obligations. We may also disclose your information to enforce our policies or to protect
            our rights or the rights of others.
          </p>
          <h3>Cookies</h3>
          <p className="text-lg">
            We use cookies to track your use of our website and to personalize your experience. You can disable cookies
            in your browser settings, but this may affect your ability to use our website.
          </p>
          <h3>Data Security</h3>
          <p className="text-lg">
            We take reasonable measures to protect your personal information from unauthorized access, disclosure, or
            destruction. However, no data transmission or storage system can be guaranteed to be 100% secure.
          </p>
          <h3>Changes to This Privacy Policy</h3>
          <p className="text-lg">
            We may update this Privacy Policy from time to time. If we make any material changes, we will notify you by
            email or by posting a notice on our website.
          </p>
          <i className="">
            Last updated: <b>May 5, 2023</b>
          </i>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
