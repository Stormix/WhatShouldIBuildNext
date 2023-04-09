import { cn } from '@/utils/styles';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { FC, ForwardedRef } from 'react';
import { forwardRef } from 'react';
import Loading from './Loading';

const buttonVariants = cva(
  'cursor-pointer inline-flex gap-2 items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2  disabled:opacity-50  disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-black text-white hover:bg-white hover:text-black focus-visible:outline-white  shadow-sm data-[state=open]:bg-slate-100 ',
        destructive: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
        outline: 'bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100',
        subtle: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100',
        ghost:
          'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
        link: 'text-black hover:text-white focus-visible:outline-white  data-[state=open]:bg-slate-100 ',
        text: '  text-black hover:opacity-50 data-[state=open]:transparent'
      },
      size: {
        default: 'h-10 py-2 px-4 font-medium',
        sm: 'h-9 px-2 rounded-md text-sm font-medium',
        lg: 'h-14 px-12 text-lg rounded-md font-bold',
        text: 'font-medium'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  onClick?: () => void;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  ref?: ForwardedRef<HTMLButtonElement>;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, onClick, className, type, variant, icon, size, disabled }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={loading || disabled}
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
