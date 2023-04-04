import { cl } from 'dynamic-class-list';
import type { FC, ForwardedRef } from 'react';
import { forwardRef } from 'react';
import Loading from './Loading';

export enum ButtonVariant {
  Primary = 'primary',
  Outline = 'outline',
  Text = 'text'
}

interface ButtonProps {
  onClick?: () => void;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  ref?: ForwardedRef<HTMLButtonElement>;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
}

const variantClasses = {
  [ButtonVariant.Primary]: 'bg-white text-black hover:bg-black hover:text-white focus-visible:outline-white  shadow-sm',
  [ButtonVariant.Outline]: 'bg-transparent text-white hover:bg-white hover:text-black focus-visible:outline-white',
  [ButtonVariant.Text]: ' text-black hover:text-white focus-visible:outline-white'
};

const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, onClick, className, type, variant, icon }, ref) => {
    return (
      <button
        className={cl(
          'flex max-w-fit items-center gap-2 rounded-md px-3.5 py-2.5 font-semibold transition-colors duration-150 ease-in',
          className,
          variantClasses[variant ?? ButtonVariant.Primary]
        )}
        disabled={loading}
        type={type ?? 'button'}
        ref={ref}
        {...(onClick && { onClick })}
      >
        {!loading && icon}
        {loading && <Loading className="h-4 w-4" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
