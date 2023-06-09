import Button from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Separator } from '@/components/atoms/Separator';
import Hero from '@/components/molecules/Home';
import IdeaCard from '@/components/molecules/Idea';
import { APP_NAME } from '@/config/app';
import { api } from '@/utils/api';
import { debounce } from 'lodash';
import mixpanel from 'mixpanel-browser';
import { type NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useEffect, useState } from 'react';

const Archive: NextPage = () => {
  const [filter, setFilter] = useState('');
  const { isLoading, data, fetchNextPage, isFetching, isFetchingNextPage, hasNextPage } =
    api.ideas.getAll.useInfiniteQuery(
      {
        limit: 5,
        filter
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor
      }
    );

  useEffect(() => {
    mixpanel.track('Viewed Archive');
  }, []);

  return (
    <>
      <NextSeo
        title={`Ideas archive - Generate Random Development Project Ideas`}
        description={`${APP_NAME} is a free tool that generates random development project ideas based on your preferences. Use it to kickstart your next hackathon project or find inspiration for your next side project.`}
      />
      <Hero>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight">Ideas Archive</h1>
        <p className="mb-8 mt-6 max-w-2xl text-lg leading-8">List of all ideas generated by our users</p>
      </Hero>
      <div className="container mx-auto mb-12 grid grid-cols-1 gap-8">
        {isLoading && <p>Loading...</p>}
        <Separator />
        <div className="flex flex-row justify-end">
          <Input
            type="text"
            placeholder="Search ideas..."
            className="w-fit min-w-[250px]"
            onChange={debounce((e) => setFilter(e.target.value), 500)}
          />
        </div>
        {data && data.pages.map((page) => page.ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />))}
        {data && data.pages.length === 0 && <p>No ideas found</p>}
        {hasNextPage && (
          <Button
            className="mx-auto w-fit"
            onClick={fetchNextPage}
            size="lg"
            loading={isFetching && !isFetchingNextPage}
          >
            Load more
          </Button>
        )}
      </div>
    </>
  );
};

export default Archive;
