import { APP_NAME } from '@/config/app';

const Logo = () => {
  return (
    <>
      <span className="sr-only">{APP_NAME}</span>
      <h1 className="font-bold" title={APP_NAME}>
        {APP_NAME}
      </h1>
    </>
  );
};

export default Logo;
