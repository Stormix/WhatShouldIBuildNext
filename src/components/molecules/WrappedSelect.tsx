import { cn } from '@/utils/styles';
import type { Control, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../atoms/Select';

interface Option {
  value: string;
  label: string;
}

interface SelectProps<T extends FieldValues> {
  options: (Option | string)[] | undefined;
  control: Control<T, unknown>;
  name: string;
  placeholder?: string;
  className?: string;
}

function ComponentSelect<T extends FieldValues>(props: SelectProps<T>) {
  const { options, control, name, placeholder, className } = props;
  const processedOptions =
    options?.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt;
    }) ?? [];

  return (
    <div className={cn('flex flex-col', className)}>
      <Controller
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        control={control as any}
        name={name}
        render={({ field: { onChange, value }, fieldState }) => (
          <>
            <Select
              onValueChange={(value) =>
                onChange({
                  target: {
                    value
                  },
                  type: 'change'
                })
              }
              value={value}
            >
              <SelectTrigger className={cn('w-[180px]', className)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {processedOptions.map((opt) => (
                  <SelectItem value={opt.value} key={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && <span className="text-sm text-red-500">{fieldState.error.message}</span>}
          </>
        )}
      />
    </div>
  );
}

ComponentSelect.displayName = 'ComponentSelect';

export default ComponentSelect;
