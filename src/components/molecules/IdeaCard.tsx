import type { Idea } from '@prisma/client';
import { cl } from 'dynamic-class-list';
import type { FC } from 'react';
import Card from '../atoms/Card';

interface IdeaCardProps {
  className?: string;
  idea: Idea;
}

const IdeaCard: FC<IdeaCardProps> = ({ className }) => {
  return (
    <Card className={cl(className, 'w-full')}>
      <h3 className="text-start font-bold opacity-70">Idea</h3>
      <h2 className="py-4 text-3xl font-semibold">
        Build a chatbot for pet owners using T3 on web but it only speaks in UwU
      </h2>
      <div className="mt-4 flex gap-8">
        <div className=" w-2/3 text-justify">
          <h4 className=" font-semibold">Description</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut tincidunt luctus, nunc nisl
            aliquam nisl, eget aliquam nisl nunc et nisl. Sed euismod, nunc ut tincidunt luctus, nunc nisl aliquam nisl,
            eget aliquam nisl nunc et nisl.
          </p>
        </div>
        <div className="flex w-1/3 flex-col items-start gap-4 text-start">
          <div>
            <h4 className="font-semibold">Difficulty</h4>
            <p>Easy</p>
          </div>
          <div>
            <h4 className="font-semibold">Keywords</h4>
            <p>Web, T3, UwU</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IdeaCard;
