import { cn } from '@/utils/styles';
import type { FC } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

const Card: FC<CardProps> = ({ children, className, footer }) => {
  return (
    <div
      className={cn(
        'flex flex-col rounded-md bg-opacity-50 bg-clip-padding px-8 pt-8 shadow backdrop-blur-2xl backdrop-filter bg-white',
        className,
        { 'pb-8': !footer }
      )}
    >
      {children}
      {footer && <div className="mt-8 pb-4">{footer}</div>}
    </div>
  );
};

export default Card;
