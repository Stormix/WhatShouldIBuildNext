import LogoSvg from '@/assets/logo.svg';
import { APP_NAME } from '@/config/app';
import { cn } from '@/utils/styles';
import { useRouter } from 'next/router';
import type { FC } from 'react';

const Logo: FC<{ footer?: boolean; small?: boolean }> = ({ footer, small }) => {
  const router = useRouter();
  return (
    <div
      className={cn('flex cursor-pointer flex-row items-center gap-2', { 'flex-col': footer })}
      onClick={() => router.push('/')}
    >
      <LogoSvg className={cn('h-6 w-6', { 'h-16 w-16': footer })} />
      <span className="sr-only">{APP_NAME}</span>
      {!small && (
        <span className="logo" title={APP_NAME}>
          {APP_NAME}
        </span>
      )}
    </div>
  );
};

export default Logo;
