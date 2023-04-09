import { cn } from '@/utils/styles';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import * as React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform"
        aria-hidden="true"
      />
      <input
        className={cn(
          'flex h-10 w-full rounded-md border px-3 py-2 pl-12 text-sm bg-transparent border-gray-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
