import Link from 'next/link';
import type { FC } from 'react';
import { useEffect } from 'react';
import DarkModeSwitch from '../atoms/DarkModeSwitch';
import Logo from '../atoms/Logo';
import UserDropdown from '../atoms/UserDropdown';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import mixpanel from 'mixpanel-browser';
import { signIn, signOut, useSession } from 'next-auth/react';
import Button from '../atoms/Button';
import { Popover, PopoverContent, PopoverTrigger } from '../atoms/Popover';

const Header: FC = () => {
  const navigation = [
    { name: 'Ideas Leaderboard', href: '/leaderboard' },
    { name: 'Project Ideas', href: '/archive' },
    { name: 'FAQ', href: '/faq' }
  ];

  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user.email) {
      mixpanel.identify(session.user.email);
      mixpanel.people.set({
        $email: session.user.email,
        $name: session.user.name,
        $last_login: new Date()
      });
    }
  }, [session]);

  return (
    <>
      <Popover>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="relative flex items-center justify-between sm:h-10 md:justify-center" aria-label="Global">
            <div className="flex flex-1 items-center md:absolute md:inset-y-0 md:left-0">
              <div className="flex w-full items-center justify-between md:w-auto">
                <Logo />
                <div className="-mr-2 flex items-center md:hidden">
                  <PopoverTrigger className="inline-flex items-center justify-center rounded-md">
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </PopoverTrigger>
                </div>
              </div>
            </div>
            <div className="hidden md:flex md:space-x-10">
              {navigation.map((item) => (
                <Link key={item.href} className="text-sm font-semibold leading-6 text-foreground" href={item.href}>
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="hidden gap-4 md:absolute md:inset-y-0 md:right-0 md:flex md:items-center md:justify-end">
              <UserDropdown />
              <DarkModeSwitch />
            </div>
          </nav>
        </div>
        <PopoverContent>
          <div className="overflow-hidden">
            <PopoverTrigger className="float-right inline-flex items-center justify-center rounded-md ">
              <span className="sr-only">Close main menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </PopoverTrigger>
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="block rounded-md px-3 py-2 text-base font-medium">
                  {item.name}
                </Link>
              ))}
              {!session && (
                <a className="block rounded-md px-3 py-2 text-base font-medium" href="#" onClick={() => signIn()}>
                  Log in
                </a>
              )}
            </div>
            {session && (
              <Button className="mx-4 mb-4" size={'sm'} onClick={() => signOut()}>
                Sign out
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Header;
