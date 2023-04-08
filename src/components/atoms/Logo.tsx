import LogoSvg from '@/assets/logo.svg';
import { APP_NAME } from '@/config/app';
import { cn } from '@/utils/styles';
import Link from 'next/link';
import type { FC } from 'react';

const Logo: FC<{ footer?: boolean }> = ({ footer }) => {
  return (
    <Link href="/">
      <div className={cn('flex flex-row gap-2', { 'flex-col': footer })}>
        <LogoSvg className={cn('h-6 w-6', { 'h-16 w-16': footer })} />
        <span className="sr-only">{APP_NAME}</span>
        <h1 className="font-bold" title={APP_NAME}>
          {APP_NAME}
        </h1>
      </div>
    </Link>
  );
};

export default Logo;
