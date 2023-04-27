import { cn } from '@/utils/styles';
import { autoUpdate, useFloating, useHover, useInteractions } from '@floating-ui/react';
import type { FC } from 'react';
import { useState } from 'react';
import Star from '../icons/Star';

interface RatingProps {
  className?: string;
  rating: number | null | undefined;
  readonly?: boolean;
  onValueChange?: (value: number) => void;
  disabled: boolean;
  loading: boolean;
  ratings?: number;
}

const Rating: FC<RatingProps> = ({ rating, readonly, disabled, loading, ratings, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate
  });

  const hover = useHover(context);
  const { getReferenceProps } = useInteractions([hover]);
  const ratingValue = rating ?? 0;
  return (
    <div className="mb-3 flex items-center">
      <div
        className="flex cursor-pointer flex-row-reverse items-center"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const isHalf = parseInt(ratingValue.toString()) !== rating && ratingValue < 5 - i && ratingValue > 5 - i - 1;
          return (
            <Star
              key={i}
              className={cn(
                'peer h-5 w-5',
                ratingValue > 5 - i - 1 && readonly
                  ? 'text-accent'
                  : 'text-forground opacity-30 hover:text-accent hover:opacity-100',
                {
                  'hover:text-accent hover:opacity-100 peer-hover:text-accent peer-hover:opacity-100': !readonly
                }
              )}
              half={isHalf && readonly}
              onClick={(e) => {
                if (!disabled && !readonly && onValueChange) onValueChange(5 - i);
                e.stopPropagation();
              }}
            />
          );
        })}
      </div>
      {loading && <p className="ml-2 text-sm font-medium">Saving...</p>}
      {rating && !loading && (
        <>
          <p>({ratings})</p>
          <p className="ml-2 text-sm font-medium">{rating} out of 5</p>
        </>
      )}
      {!rating && !loading && <p className="muted ml-2">No rating yet</p>}
    </div>
  );
};

export default Rating;
