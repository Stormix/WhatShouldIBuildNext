import Loading from '@/components/atoms/Loading';
import Hero from '@/components/molecules/Home';
import { APP_NAME } from '@/config/app';
import { api } from '@/utils/api';
import { ArrowTopRightOnSquareIcon, BookmarkIcon, StarIcon } from '@heroicons/react/24/outline';
import mixpanel from 'mixpanel-browser';
import { type NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useEffect } from 'react';
const Leaderboard: NextPage = () => {
  const { isLoading, data } = api.ideas.leaderboard.useQuery();

  useEffect(() => {
    mixpanel.track('Viewed Leaderboard');
  }, []);

  return (
    <>
      <NextSeo
        title={`Ideas leaderboard - Generate Random Development Project Ideas`}
        description={`${APP_NAME} is a free tool that generates random development project ideas based on your preferences. Use it to kickstart your next hackathon project or find inspiration for your next side project.`}
      />
      <Hero>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight">Leaderboard</h1>
        <p className="mb-8 mt-6 max-w-2xl text-lg leading-8">Top 100 ideas generated by users on the website</p>
      </Hero>
      {isLoading && (
        <div className="mx-auto flex w-full items-center justify-center">
          <Loading className="h-8 w-8" />
        </div>
      )}
      <div className="container mx-auto mb-12 grid grid-cols-1 gap-8">
        {!isLoading && (
          <table className="z-50 table-auto border border-transparent">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-start">Rank</th>
                <th className="px-4 py-2 text-start">Idea</th>
                <th className="px-4 py-2 text-start">
                  <StarIcon className="h-4 w-4 text-gray-500" />
                </th>
                <th className="px-4 py-2 text-start">
                  <BookmarkIcon className="h-4 w-4 text-gray-500" />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.ideas.map((idea, index) => {
                  return (
                    <tr key={idea.id}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{idea.title}</td>
                      <td className="px-4 py-2">{idea.rating ?? ''}</td>
                      <td className="px-4 py-2">{idea.saveCount}</td>

                      <td className="px-4 py-2">
                        <Link href={`/idea/${idea.id}`} target="_blank">
                          <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-500" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Leaderboard;
