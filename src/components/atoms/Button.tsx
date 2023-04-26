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
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-secondary-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-secondary-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
        text: 'underline-offset-4 hover:underline text-primary'
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
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
