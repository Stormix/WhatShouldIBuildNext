import { useTheme } from 'next-themes';
import { DarkModeSwitch as DarkModeSwitchIcon } from 'react-toggle-dark-mode';

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

const DarkModeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark);
  };

  return (
    <DarkModeSwitchIcon className="nightwind-prevent" checked={theme === Theme.Dark} onChange={toggle} size={24} />
  );
};

export default DarkModeSwitch;
