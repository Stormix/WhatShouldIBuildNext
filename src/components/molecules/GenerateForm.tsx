import { ComponentType } from '@/types/components';
import Select from '../atoms/Select';

const GenerateForm = () => {
  const components = {
    [ComponentType.What]: ['an app', 'a website'],
    [ComponentType.For]: ['a client', 'a customer', 'a user', 'a visitor'],
    [ComponentType.Using]: ['React', 'Vue', 'Angular', 'Svelte'],
    [ComponentType.On]: ['Web', 'Mobile', 'Desktop'],
    [ComponentType.But]: ['with limitations', 'with restrictions', 'with limitations and restrictions']
  };

  return (
    <div className="flex flex-col gap-12">
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat
        veniam occaecat fugiat aliqua.
      </p>
      <div className="flex w-full flex-col rounded-md bg-opacity-50 bg-clip-padding px-8 py-8 backdrop-blur-2xl backdrop-filter bg-gray-100">
        <div className="flex flex-row gap-2">
          <p>Build</p>
          <Select options={components[ComponentType.What]} />
          <p>for</p> <Select options={components[ComponentType.For]} /> <p>using</p>{' '}
          <Select options={components[ComponentType.Using]} /> <p>and on</p>
          <Select options={components[ComponentType.On]} /> <p>but</p>{' '}
          <Select options={components[ComponentType.But]} />
        </div>
        <div>
          <button className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateForm;
