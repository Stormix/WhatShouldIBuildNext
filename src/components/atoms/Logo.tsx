import LogoSvg from '@/assets/logo.svg';
import { APP_NAME } from '@/config/app';
import { cn } from '@/utils/styles';
import type { FC } from 'react';

const Logo: FC<{ footer?: boolean }> = ({ footer }) => {
  return (
    <div className={cn('flex flex-row gap-2', { 'flex-col': footer })}>
      <LogoSvg className={cn('h-6 w-6', { 'h-16 w-16': footer })} />
      <span className="sr-only">{APP_NAME}</span>
      <h1 className="font-bold" title={APP_NAME}>
        {APP_NAME}
      </h1>
    </div>
  );
};

export default Logo;
