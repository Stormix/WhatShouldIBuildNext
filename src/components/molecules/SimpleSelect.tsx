import { cn } from '@/utils/styles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../atoms/Select';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: (Option | string)[];
  placeholder?: string;
  className?: string;
  onSelect: (value: Option) => void;
}

function SimpleSelect(props: SelectProps) {
  const { options, onSelect, placeholder, className } = props;
  const processedOptions =
    options?.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt;
    }) ?? [];

  return (
    <div className={cn('flex flex-col', className)}>
      <Select
        onValueChange={(value) => {
          onSelect?.(processedOptions.find((opt) => opt.value === value)!);
        }}
      >
        <SelectTrigger className={cn('w-[180px]', className)}>
          <SelectValue placeholder={placeholder}>{placeholder}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {processedOptions.map((opt) => (
            <SelectItem value={opt.value} key={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

SimpleSelect.displayName = 'SimpleSelect';

export default SimpleSelect;
