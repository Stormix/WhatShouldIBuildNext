import { useIdeasStore } from '@/hooks/store/ideas';
import { api } from '@/utils/api';
import { cn } from '@/utils/styles';
import type { FC } from 'react';
import GenerateForm from './GenerateForm';
import IdeaCard from './IdeaCard';

interface HeroProps {
  children?: React.ReactNode;
  empty?: boolean;
  noPadding?: boolean;
}

const Hero: FC<HeroProps> = ({ children, empty, noPadding }) => {
  const { generatedIdeaId } = useIdeasStore();
  const { data: idea, isLoading: loading } = api.ideas.getOne.useQuery({
    id: generatedIdeaId as string
  });
  return (
    <>
      <div
        className={cn('relative isolate flex flex-col justify-center px-6  lg:px-8', {
          'pt-14': !noPadding
        })}
      >
        <div className="h-128 absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 transform-gpu">
          <div className="absolute -left-4 top-0 h-72 w-72 animate-blob rounded-full opacity-70 mix-blend-multiply blur-xl filter bg-purple-300"></div>
          <div className="animation-delay-2000 absolute -right-4 top-0 h-72 w-72 animate-blob rounded-full opacity-70 mix-blend-multiply blur-xl filter bg-yellow-300"></div>
          <div className="animation-delay-4000 absolute -bottom-8 left-20 h-72 w-72 animate-blob rounded-full opacity-70 mix-blend-multiply blur-xl filter bg-pink-300"></div>
        </div>
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className=" relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }}
          />
        </div>
        <div className="z-10 mt-56 flex flex-col items-center justify-center text-center">
          {!children && !empty && (
            <div className="flex w-6/12 flex-col items-center gap-12">
              <h1 className="max-w-2xl scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Generate your next project idea now
              </h1>
              <p className="mb-8 mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                The ultimate resource for developers looking for new project ideas. With thousands of unique
                combinations to choose from, you&apos;re sure to find something that inspires you.
              </p>
              <GenerateForm loading={loading} />
              {idea && <IdeaCard loading={loading} idea={idea} className="w-full" />}
            </div>
          )}
          {children}
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Hero;
