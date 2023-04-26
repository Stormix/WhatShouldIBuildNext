import { formatNumber } from '@/utils/format';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './DropdownMenu';

const UserDropdown = () => {
  const { data: session, update } = useSession();

  // Polling the session every 1 hour
  useEffect(() => {
    const interval = setInterval(() => update(), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [update]);

  // Listen for when the page is visible, if the user switches tabs
  useEffect(() => {
    const visibilityHandler = () => document.visibilityState === 'visible' && update();
    window.addEventListener('visibilitychange', visibilityHandler, false);
    return () => window.removeEventListener('visibilitychange', visibilityHandler, false);
  }, [update]);

  if (!session)
    return (
      <a href="#" className="text-sm font-semibold leading-6" onClick={() => signIn()}>
        Log in <span aria-hidden="true">&rarr;</span>
      </a>
    );

  return (
    <DropdownMenu>
      <div className="flex flex-row items-center gap-4">
        <span>
          {session.user.name} (credits: <b>{formatNumber(session.user.credits ?? 0)}</b>)
        </span>
        <DropdownMenuTrigger className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="sr-only">Open user menu</span>
          <Image
            width={32}
            height={32}
            className="rounded-full"
            src={session.user.image as string}
            alt={session.user.name as string}
          />
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href={`/profile`}>Your Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <a href="#" onClick={() => signOut()}>
            Log out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
