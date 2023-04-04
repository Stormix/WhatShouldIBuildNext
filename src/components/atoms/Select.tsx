import type { ChangeEventHandler, FC, ForwardedRef } from 'react';
import { forwardRef } from 'react';
import type { FieldError } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: (Option | string)[] | undefined;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  value?: string;
  ref?: ForwardedRef<HTMLSelectElement>;
  errors?: FieldError;
}

const Select: FC<SelectProps> = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { options, onChange, value } = props;
  const processedOptions =
    options?.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt;
    }) ?? [];

  return (
    <div className="flex flex-col">
      <select
        className="focus:ring-white-600 block w-fit rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 text-gray-900 focus:ring-2 focus:ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
        onChange={onChange}
        value={value}
        ref={ref}
      >
        {processedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {props.errors && <span className="text-red-500">{props.errors.message}</span>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
