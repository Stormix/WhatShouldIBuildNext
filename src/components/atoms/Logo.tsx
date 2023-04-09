import LogoSvg from '@/assets/logo.svg';
import { APP_NAME } from '@/config/app';
import { cn } from '@/utils/styles';
import { useRouter } from 'next/router';
import type { FC } from 'react';

const Logo: FC<{ footer?: boolean }> = ({ footer }) => {
  const router = useRouter();
  return (
    <div className={cn('flex cursor-pointer flex-row gap-2', { 'flex-col': footer })} onClick={() => router.push('/')}>
      <LogoSvg className={cn('h-6 w-6', { 'h-16 w-16': footer })} />
      <span className="sr-only">{APP_NAME}</span>
      <h1 className="font-bold" title={APP_NAME}>
        {APP_NAME}
      </h1>
    </div>
  );
};

export default Logo;
