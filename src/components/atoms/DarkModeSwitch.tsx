import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

const DarkModeSwitch = () => {
  const { theme, setTheme } = useTheme();
  console.log(theme);

  const toggle = () => {
    setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark);
  };

  return (
    <div onClick={toggle} className="flex cursor-pointer">
      <SunIcon className="h-6 w-6 rotate-0 scale-100 text-foreground transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-6 w-6 rotate-90 scale-0 text-foreground transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </div>
  );
};

export default DarkModeSwitch;
