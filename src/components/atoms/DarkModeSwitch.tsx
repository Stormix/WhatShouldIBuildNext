import { useTheme } from 'next-themes';
import nightwind from 'nightwind/helper';
import { DarkModeSwitch as DarkModeSwitchIcon } from 'react-toggle-dark-mode';

const DarkModeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    nightwind.beforeTransition();
    if (theme !== 'dark') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };
  return <DarkModeSwitchIcon checked={theme === 'dark'} onChange={toggle} size={24} />;
};

export default DarkModeSwitch;
