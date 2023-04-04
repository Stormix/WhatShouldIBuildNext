import { api } from '@/utils/api';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Component } from '@prisma/client';
import { ComponentType } from '@prisma/client';
import { useForm } from 'react-hook-form';

import { useIdeasStore } from '@/hooks/store/ideas';
import type { GenerateSchema } from '@/validation/generate';
import { generateSchema } from '@/validation/generate';
import { ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Button, { ButtonVariant } from '../atoms/Button';
import Card from '../atoms/Card';
import Loading from '../atoms/Loading';
import Select from '../atoms/Select';

const GenerateForm = () => {
  const { setGeneratedIdea } = useIdeasStore();
  const { data, isLoading } = api.components.getAll.useQuery();
  const { mutate: generate, isLoading: generating } = api.ideas.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedIdea({
        id: '',
        title: data.idea,
        description: data.description,
        createdAt: new Date(),
        difficulty: data.difficulty,
        timeToComplete: data.timeToComplete,
        authorId: '',
        updatedAt: new Date()
      });
    }
  });

  const components = data?.reduce((acc, curr) => {
    if (acc[curr.type]) {
      acc[curr.type].push(curr);
    } else {
      acc[curr.type] = [curr];
    }
    return acc;
  }, {} as Record<ComponentType, Component[]>);

  const toOptions = (components: Component[] | undefined) => {
    return (
      components?.map((component) => ({
        value: component.id,
        label: component.value
      })) ?? []
    );
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<GenerateSchema>({
    resolver: zodResolver(generateSchema)
  });

  const onSubmit = (data: GenerateSchema) => {
    if (!generating) generate(data);
  };

  const randomize = () => {
    for (const componentType in components) {
      const component =
        components[componentType as ComponentType][
          Math.floor(Math.random() * components[componentType as ComponentType].length)
        ];
      setValue(componentType.toLowerCase() as keyof GenerateSchema, component!.id);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full items-center">
        {components && (
          <div className="flex flex-row items-center justify-evenly gap-2">
            <span>Build</span>
            <Select options={toOptions(components[ComponentType.What])} errors={errors.what} {...register('what')} />
            <span>for</span>
            <Select options={toOptions(components[ComponentType.For])} errors={errors.for} {...register('for')} />
            <span>using</span>
            <Select options={toOptions(components[ComponentType.Using])} errors={errors.using} {...register('using')} />
            <span>and on</span>
            <Select options={toOptions(components[ComponentType.On])} errors={errors.on} {...register('on')} />
            <span>but</span>
            <Select options={toOptions(components[ComponentType.But])} errors={errors.but} {...register('but')} />
          </div>
        )}
        {isLoading && (
          <div>
            <Loading />
          </div>
        )}
        <div className="flex flex-row items-center gap-4">
          <Button
            className="group mt-8"
            type="button"
            variant={ButtonVariant.Text}
            onClick={() => randomize()}
            icon={<ArrowPathIcon className="h-4 w-4 group-hover:animate-spin" />}
          >
            Randomize
          </Button>
          <Button
            className="group mt-8"
            type="submit"
            loading={generating}
            icon={<SparklesIcon className="h-4 w-4 group-hover:animate-pulse" />}
          >
            Generate a new idea
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default GenerateForm;
