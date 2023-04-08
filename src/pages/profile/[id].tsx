import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Hero from '@/components/molecules/Hero';
import IdeaCard from '@/components/molecules/IdeaCard';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect } from 'react';

const Profile: NextPage = () => {
  const { data: session, update } = useSession();

  // Polling the session every 1 hour
  useEffect(() => {
    const interval = setInterval(() => update(), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [update]);

  // Listen for when the page is visible, if the user switches tabs
  useEffect(() => {
    const visibilityHandler = () => document.visibilityState === 'visible' && update();
    window.addEventListener('visibilitychange', visibilityHandler, false);
    return () => window.removeEventListener('visibilitychange', visibilityHandler, false);
  }, [update]);

  return (
    <>
      <Hero>
        <Card className="container w-full">
          <div className="flex items-center gap-8">
            <Image
              width={128}
              height={128}
              className="rounded-full"
              src={session?.user.image as string}
              alt={session?.user.name as string}
            />
            <div className="ml-4 flex flex-col items-start justify-center">
              <h1 className="text-3xl font-bold text-gray-900">{session?.user.name}</h1>
              <h2 className="text-xl text-gray-900">Credits: {session?.user.credits ?? 0}</h2>
            </div>
          </div>
        </Card>
      </Hero>
      <div className="container z-30 mx-auto mb-24 mt-12">
        <div className="mb-4 flex w-full items-center justify-between">
          <h3 className="text-lg font-semibold">Generated Ideas </h3>
          <Button variant="text">View more</Button>
        </div>
        <div className="flex flex-col gap-4">
          {session?.user?.ideas?.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} noSave />
          ))}
        </div>
        <div className="my-4 flex w-full items-center justify-between">
          <h3 className="text-lg font-semibold">Saved ideas</h3>
          <Button variant="text">View more</Button>
        </div>

        <div className="flex flex-col gap-4">
          {session?.user?.savedIdeas?.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
