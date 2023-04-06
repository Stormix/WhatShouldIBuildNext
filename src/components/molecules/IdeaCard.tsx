import { useIdeasStore } from '@/hooks/store/ideas';
import type { GeneratedIdea } from '@/types/ideas';
import { cl } from 'dynamic-class-list';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import Card from '../atoms/Card';

interface IdeaCardProps {
  className?: string;
  idea: GeneratedIdea;
}

const IdeaCard: FC<IdeaCardProps> = ({ className }) => {
  const idea = useIdeasStore((state) => state.generatedIdea);
  return (
    <Card className={cl(className ?? 'w-full')}>
      <h3 className="text-start font-bold opacity-70">Idea #{idea?.number}</h3>
      <div className="flex items-center gap-8">
        <div className="flex-grow text-justify">
          <h2 className="py-4 text-3xl font-semibold">{idea?.title ?? 'No idea generated yet'}</h2>
          <p>{idea?.description ?? 'No idea generated yet'}</p>
        </div>
        <div className="flex w-1/4 flex-col items-start gap-4 text-start">
          <div>
            <h4 className="font-semibold">Difficulty</h4>
            <p>{idea?.difficulty ?? ''}</p>
          </div>
          <div>
            <h4 className="font-semibold">Time to complete</h4>
            <p>{idea?.timeToComplete ?? ''}</p>
          </div>
          <div>
            <h4 className="font-semibold">Keywords</h4>
            <p>{idea?.keywords?.map((key) => `#${key}`)?.join(', ')}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default dynamic(() => Promise.resolve(IdeaCard), { ssr: false });
