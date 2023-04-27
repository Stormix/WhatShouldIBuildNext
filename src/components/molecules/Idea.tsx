import type { GeneratedIdea } from '@/types/ideas';
import { api } from '@/utils/api';
import { BookmarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { cl } from 'dynamic-class-list';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../atoms/Button';
import { Card, CardContent, CardFooter } from '../atoms/Card';
import Rating from '../atoms/Rating';
import { Skeleton } from '../atoms/Skeleton';

interface IdeaProps {
  className?: string;
  idea: GeneratedIdea;
  noSave?: boolean;
  loading?: boolean;
}

const Idea: FC<IdeaProps> = ({ className, idea, noSave, loading }) => {
  const { update } = useSession();
  const context = api.useContext();
  const { mutate: saveIdea, isLoading: saving, isSuccess: saved } = api.ideas.save.useMutation();
  const invalidate = () => {
    context.ideas.getAll.invalidate();
    context.ideas.getOne.invalidate({
      id: idea?.id
    });
    update();
  };
  const { mutate: rate, isLoading: rating } = api.ideas.rate.useMutation({
    onSuccess: () => {
      invalidate();
      toast.success('Rated !');
    },
    onError: (e) => {
      invalidate();
      toast.error(e.message);
    }
  });

  const alreadySaved = idea?.saved || saved || false;
  const router = useRouter();

  return (
    <Card
      className={cl(className, 'z-20 flex w-full flex-col ')}
      onClick={(e) => {
        const ignoredClass = 'ignore-click';
        const target = e.target as HTMLElement;

        // If tarrget or a parent has the class, ignore the click
        if (target.classList.contains(ignoredClass) || target.closest(`.${ignoredClass}`)) {
          return;
        }

        router.push(`/idea/${idea?.id}`);
      }}
    >
      <CardContent className="flex flex-col gap-4">
        <h3 className="text-start font-bold opacity-70">Idea #{idea?.number}</h3>
        <div className="flex flex-col gap-8 md:flex-row md:items-center ">
          <div className="flex-grow text-justify">
            <h2 className="py-4 text-3xl font-semibold">
              {loading && <Skeleton className="h-6 rounded-full" />}
              {!loading && (idea?.title ?? 'No idea generated yet')}
            </h2>
            {loading && (
              <div className="mt-6 flex flex-col gap-2">
                <Skeleton className="h-4 rounded-full" />
                <Skeleton className="h-4 rounded-full" />
                <Skeleton className="h-4 rounded-full" />
              </div>
            )}
            {!loading && <p>{idea?.description ?? 'No idea generated yet'}</p>}
          </div>
          <div className="flex flex-col items-start gap-4 text-start md:w-1/4">
            <div>
              <h4 className="font-semibold">Difficulty</h4>
              {loading ? <Skeleton className="mt-2 h-4 rounded-full" /> : <p>{idea?.difficulty ?? ''}</p>}
            </div>
            <div>
              <h4 className="font-semibold">Time to complete</h4>
              {loading ? (
                <Skeleton className="mt-2 h-4 rounded-full" />
              ) : (
                <p>
                  {idea?.timeToComplete ?? ''}
                  {idea?.timeToComplete?.toLowerCase()?.includes('hours') ? '' : ' hours'}
                </p>
              )}
            </div>
            <div>
              <h4 className="font-semibold">Keywords</h4>
              {loading ? (
                <Skeleton className="mt-2 h-4 rounded-full" />
              ) : (
                <p>{idea?.keywords?.map((key) => `#${key}`)?.join(', ')}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {!noSave && (
          <>
            <Rating
              loading={rating}
              disabled={rating}
              rating={idea.rating}
              readonly={idea.ratedByThisUser}
              onValueChange={(rating) => {
                rate({ id: idea?.id, rating });
              }}
              ratings={idea.ratingsCount ?? 0}
              className="ignore-click"
            />
            <Button
              className="ignore-click"
              type="button"
              variant="text"
              onClick={() => saveIdea({ id: idea?.id })}
              icon={alreadySaved ? <CheckIcon className="h-5 w-5" /> : <BookmarkIcon className="h-6 w-6" />}
              disabled={alreadySaved || saving}
              loading={saving}
            >
              {alreadySaved ? 'Saved' : 'Save'}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default dynamic(() => Promise.resolve(Idea), { ssr: false });
