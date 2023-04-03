import type { FC } from 'react';
import { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: (Option | string)[];
}

const Select: FC<SelectProps> = ({ options }) => {
  const processedOptions = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const [selectedOption, setSelectedOption] = useState<Option['value'] | undefined>(processedOptions?.[0]?.label);

  return (
    <div className="flex flex-col">
      <select
        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        {processedOptions.map((opt) => (
          <option key={opt.value} value={opt.value} selected={opt.value === selectedOption}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
