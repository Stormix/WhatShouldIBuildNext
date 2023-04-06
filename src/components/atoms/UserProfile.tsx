import { Menu, Transition } from '@headlessui/react';
import { cl } from 'dynamic-class-list';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Fragment, useEffect } from 'react';

const UserProfile = () => {
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
      <a href="#" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => signIn()}>
        Log in <span aria-hidden="true">&rarr;</span>
      </a>
    );

  return (
    <Menu as="div" className="relative ml-3">
      <div className="flex flex-row items-center gap-4">
        <span>
          {session.user.name} (credits: <b>{session.user.credits ?? 0}</b>)
        </span>
        <Menu.Button className="flex rounded-full text-sm bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="sr-only">Open user menu</span>
          <Image
            width={32}
            height={32}
            className="rounded-full"
            src={session.user.image as string}
            alt={session.user.name as string}
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 bg-white focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <a href="#" className={cl(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm')}>
                Your Profile
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a href="#" className={cl(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm')}>
                Settings
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={cl(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm')}
                onClick={() => signOut()}
              >
                Log out
              </a>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserProfile;
