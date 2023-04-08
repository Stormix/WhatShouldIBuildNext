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
}

const Rating: FC<RatingProps> = ({ rating, readonly, onValueChange, disabled, loading }) => {
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
    <div className="mb-3 flex  items-center">
      <div className="flex flex-row-reverse items-center" ref={refs.setReference} {...getReferenceProps()}>
        {Array.from({ length: 5 }, (_, i) => {
          const isHalf = parseInt(ratingValue.toString()) !== rating && ratingValue < 5 - i && ratingValue > 5 - i - 1;
          return (
            <Star
              key={i}
              className={cn('peer h-5 w-5 ', ratingValue > 5 - i - 1 && readonly ? 'text-black' : 'text-gray-300', {
                'hover:text-black peer-hover:text-black': !readonly
              })}
              half={isHalf && readonly}
              onClick={() => {
                if (!disabled && !readonly && onValueChange) onValueChange(5 - i);
              }}
            />
          );
        })}
      </div>
      {loading && <p className="ml-2 text-sm font-medium opacity-50 text-black">Saving...</p>}
      {rating && !loading && <p className="ml-2 text-sm font-medium opacity-50 text-black">{rating} out of 5</p>}
      {!rating && !loading && <p className="ml-2 text-sm font-medium opacity-50 text-black">No rating yet</p>}
    </div>
  );
};

export default Rating;
