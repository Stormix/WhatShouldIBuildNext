import Link from 'next/link';
import type { FC } from 'react';
import DarkModeSwitch from '../atoms/DarkModeSwitch';
import Logo from '../atoms/Logo';
import UserDropdown from '../atoms/UserDropdown';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../atoms/Button';
import { Popover, PopoverContent, PopoverTrigger } from '../atoms/Popover';

const Header: FC = () => {
  const navigation = [
    { name: 'Ideas Leaderboard', href: '/leaderboard' },
    { name: 'Project Ideas', href: '/archive' },
    { name: 'FAQ', href: '#' },
    { name: 'Pricing', href: '#' }
  ];
  return (
    <>
      <Popover>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="relative flex items-center justify-between sm:h-10 md:justify-center" aria-label="Global">
            <div className="flex flex-1 items-center md:absolute md:inset-y-0 md:left-0">
              <div className="flex w-full items-center justify-between md:w-auto">
                <Logo />
                <div className="-mr-2 flex items-center md:hidden">
                  <PopoverTrigger className="inline-flex items-center justify-center rounded-md bg-gray-50 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
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
            <PopoverTrigger className="float-right inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none">
              <span className="sr-only">Close main menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </PopoverTrigger>
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <Button className="mx-4 mb-4" size={'sm'}>
              Log in
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Header;
