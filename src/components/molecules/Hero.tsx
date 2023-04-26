import { useIdeasStore } from '@/hooks/store/ideas';
import { api } from '@/utils/api';
import type { FC } from 'react';
import Header from './Header';

import { cn } from '@/utils/styles';
import GenerateForm from './GenerateForm';
import Idea from './Idea';

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
    <div className="w-full bg-background">
      <div className="relative overflow-hidden ">
        <div className="absolute inset-y-0 h-full w-full" aria-hidden="true">
          <div className="relative h-full">
            <svg
              className="absolute right-full translate-x-1/4 translate-y-1/3 transform sm:translate-x-1/2 md:translate-y-1/2 lg:translate-x-full"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-muted-foreground opacity-30"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect width={404} height={784} fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)" />
            </svg>
            <svg
              className="absolute left-full -translate-x-1/4 -translate-y-3/4 transform sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="d2a68204-c383-44b1-b99f-42ccff4e5365"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-muted-foreground opacity-30"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect width={404} height={784} fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)" />
            </svg>
          </div>
        </div>

        <div className="relative w-full pb-24 pt-6 sm:pb-24">
          <Header />
          <div
            className={cn('mx-auto max-w-7xl px-4  sm:px-6', {
              'mt-24 sm:mt-48': !noPadding
            })}
          >
            {!children && !empty && (
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
                  Generate your next <span className="text-accent">project idea</span> now
                </h1>
                <p className="mx-auto mt-3 max-w-md text-base text-secondary-foreground sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                  The ultimate resource for developers looking for new project ideas. With thousands of unique
                  combinations to choose from, you&apos;re sure to find something that inspires you.
                </p>
              </div>
            )}
            {children}
          </div>
        </div>
        {!children && !empty && (
          <div className="relative">
            <div className="absolute inset-0 flex flex-col" aria-hidden="true">
              <div className="flex-1" />
              <div className="z-10 w-full flex-1 bg-strip" />
            </div>
            <div className="z-20 mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6">
              <GenerateForm loading={loading} />
            </div>
          </div>
        )}
      </div>

      {!children && !empty && (
        <div className="z-10 bg-strip">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-10 lg:px-8">
            <p className="muted text-center">
              If you ever ran out of credits and need more ideas, feel free to reach out. Or come back tomorrow, free
              credits are rewarded to active users every day.
            </p>
          </div>
        </div>
      )}

      {!children && !empty && idea && (
        <div
          className={cn('mx-auto max-w-7xl px-4  sm:px-6', {
            'mt-24': !noPadding
          })}
        >
          <Idea loading={loading} idea={idea} />{' '}
        </div>
      )}
    </div>
  );
};

export default Hero;
