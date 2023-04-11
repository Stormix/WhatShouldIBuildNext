import Link from 'next/link';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import DarkModeSwitch from '../atoms/DarkModeSwitch';
import Logo from '../atoms/Logo';
import UserDropdown from '../atoms/UserDropdown';

const Header: FC = () => {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex">
          <Logo />
        </div>
        <div className="flex flex-grow  items-center  justify-center gap-8">
          <Link className="text-sm font-semibold leading-6 text-gray-900" href={'/leaderboard'}>
            Leaderboard
          </Link>
          <Link className="text-sm font-semibold leading-6 text-gray-900" href={'/archive'}>
            Ideas Archive
          </Link>
          <a
            className="text-sm font-semibold leading-6 text-gray-900"
            href={'/'}
            onClick={() => toast.success('TODO - Coming soon!')}
          >
            Contact
          </a>
        </div>
        <div className=" flex items-center  justify-end gap-4">
          <UserDropdown />
          <DarkModeSwitch />
        </div>
      </nav>
    </header>
  );
};

export default Header;
