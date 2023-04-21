import { cn } from '@/utils/styles';
import type { FC } from 'react';
import Loading from './Loading';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  loading?: boolean;
}

const Card: FC<CardProps> = ({ children, className, footer, loading }) => {
  return (
    <div
      className={cn(
        'flex flex-col rounded-md bg-opacity-50 bg-clip-padding px-8 pt-8 shadow backdrop-blur-2xl backdrop-filter bg-white',
        className,
        { 'pb-8': !footer }
      )}
    >
      {loading && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
      {children}
      {footer && <div className="mt-8 pb-4">{footer}</div>}
    </div>
  );
};

export default Card;
