'use client';

import Button from '@/components/atoms/Button';
import Loading from '@/components/atoms/Loading';
import { Separator } from '@/components/atoms/Separator';
import Hero from '@/components/molecules/Home';
import Idea from '@/components/molecules/Idea';
import { APP_NAME } from '@/config/app';
import { appRouter } from '@/server/api/root';
import { createInnerTRPCContext } from '@/server/api/trpc';
import { prisma } from '@/server/db';
import { api } from '@/utils/api';
import { ComponentType } from '@prisma/client';
import { createServerSideHelpers } from '@trpc/react-query/server';
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import superjson from 'superjson';

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await prisma.component.findMany({
    orderBy: {
      id: 'desc'
    },
    where: {
      type: ComponentType.Using
    }
  });
  const languages = data?.filter((component) => component.type === ComponentType.Using) ?? [];

  return {
    paths: languages.map((component) => ({
      params: { value: component.value }
    })),
    fallback: true
  };
};

export const getStaticProps: GetStaticProps<{ value: string }> = async (context) => {
  const componentValue = context.params?.value as string;

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: null
    }),
    transformer: superjson
  });

  if (!componentValue) {
    return {
      notFound: true
    };
  }

  const component = await helpers.ideas.getByComponent.fetch({ component: componentValue });
  if (!component) {
    return {
      notFound: true
    };
  }

  await helpers.ideas.getByComponent.prefetch({ component: componentValue });
  await helpers.components.getOne.prefetch({ value: componentValue });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      value: componentValue
    }
  };
};

function PrefilledPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { value } = props;
  const { data: component, isLoading: isLoadingComponent, error } = api.components.getOne.useQuery({ value });

  const { isLoading, data, fetchNextPage, isFetching, isFetchingNextPage, hasNextPage } =
    api.ideas.getByComponent.useInfiniteQuery(
      {
        limit: 10,
        component: value
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor
      }
    );

  return (
    <>
      <NextSeo
        title={`Project Ideas using ${component?.value ?? '🤔'} - ${APP_NAME}`}
        description={`${APP_NAME} is a free tool that generates random development project ideas based on your preferences. Use it to kickstart your next hackathon project or find inspiration for your next side project.`}
      />
      <Hero>
        <h1 className="text-4xl font-bold tracking-tight">{`Project Ideas using ${component?.value ?? '🤔'}`}</h1>
        {component?.value && (
          <p className="mb-8 mt-6 text-lg leading-8">
            List of user generated ideas using {component?.value ?? '🤔'}. You can also generate your own{' '}
            <Link href={`/?using=${component?.id}`} className="text-accent">
              here
            </Link>
            .
          </p>
        )}
        {!component?.value && <p className="mb-8 mt-6 max-w-2xl text-lg leading-8">What are you trying to do? </p>}
      </Hero>
      <div className="container mx-auto mb-12 grid min-w-fit max-w-7xl grid-cols-1 gap-8">
        <Separator />
        {!(isLoading || isLoadingComponent) && (!component || !data) && (
          <p>
            No ideas found ¯\_(ツ)_/¯. Generate your own{' '}
            <Link href={`/?using=${component?.id}`} className="text-accent">
              here
            </Link>
            .
          </p>
        )}
        {(isLoading || isLoadingComponent) && (
          <div className="flex items-center gap-4">
            <Loading className="h-4 w-4" /> <span>Loading...</span>
          </div>
        )}
        {data && data.pages.map((page) => page.ideas.map((idea) => <Idea key={idea.id} idea={idea} />))}
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
}

export default PrefilledPage;
