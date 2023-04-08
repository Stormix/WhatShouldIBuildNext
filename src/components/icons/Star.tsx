import { cn } from '@/utils/styles';
import { useTheme } from 'next-themes';
import React from 'react';
import colors from 'tailwindcss/colors';
import { Theme } from '../atoms/DarkModeSwitch';

export interface IconProps {
  className?: string;
  half?: boolean;
  onClick?: () => void;
}

const Star: React.FC<IconProps> = ({ className, half, onClick }) => {
  const { theme } = useTheme();

  return (
    <svg
      aria-hidden="true"
      className={cn('h-5 w-5 text-black', className)}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => onClick?.()}
    >
      {half && (
        <defs>
          <linearGradient id="grad">
            <stop offset="50%" stop-color={theme === Theme.Dark ? colors.white : colors.black} />
            <stop offset="50%" stop-color={theme === Theme.Dark ? colors.gray['700'] : colors.gray['300']} />
          </linearGradient>
        </defs>
      )}
      <path
        fill={half ? 'url(#grad)' : 'currentColor'}
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
      ></path>
    </svg>
  );
};

export default Star;
