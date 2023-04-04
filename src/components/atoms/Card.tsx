import { cl } from 'dynamic-class-list';
import type { FC } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={cl(
        'flex flex-col rounded-md bg-opacity-50 bg-clip-padding px-8 py-8 backdrop-blur-2xl backdrop-filter bg-gray-100',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
