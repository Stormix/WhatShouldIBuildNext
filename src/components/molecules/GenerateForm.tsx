import { api } from '@/utils/api';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Component } from '@prisma/client';
import { ComponentType } from '@prisma/client';
import { useForm } from 'react-hook-form';

import { useIdeasStore } from '@/hooks/store/ideas';
import { generateInputSchema } from '@/validation/generate';
import { ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import type { z } from 'zod';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Loading from '../atoms/Loading';
import ComponentSelect from './WrappedSelect';

type FormValues = z.TypeOf<typeof generateInputSchema>;

const GenerateForm = () => {
  const { data: session, update } = useSession();
  const { setGeneratedIdea } = useIdeasStore();
  const { data, isLoading } = api.components.getAll.useQuery();

  const { mutate: generate, isLoading: generating } = api.ideas.generate.useMutation({
    onSuccess: (data) => {
      update({
        user: {
          ...session?.user,
          credits: Math.max(session?.user.credits ?? 0 - 1, 0)
        }
      });
      setGeneratedIdea(data);
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'bottom-center'
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

  const { handleSubmit, setValue, control } = useForm<FormValues>({
    resolver: zodResolver(generateInputSchema)
  });

  const onSubmit = (data: FormValues) => {
    if (!session?.user) {
      return toast.error('Please login first!', {
        position: 'bottom-center'
      });
    }
    const credits = session.user.credits;
    if (credits < 1) {
      return toast.error('You do not have enough credits! Come back tomorrow!', {
        position: 'bottom-center'
      });
    }
    if (!generating) generate(data);
  };

  const randomize = () => {
    for (const componentType in components) {
      const component =
        components[componentType as ComponentType][
          Math.floor(Math.random() * components[componentType as ComponentType].length)
        ];
      setValue(componentType.toLowerCase() as keyof FormValues, component!.id);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="flex w-full flex-col  gap-4">
        <p className="text-left font-semibold text-black">1. Pick your components or randomize:</p>
        {components && (
          <div className="flex flex-row items-center justify-evenly gap-2">
            <span>Build</span>
            <ComponentSelect<FormValues>
              options={toOptions(components[ComponentType.What])}
              placeholder="Select a value.."
              control={control}
              name="what"
            />
            <span>for</span>
            <ComponentSelect<FormValues>
              options={toOptions(components[ComponentType.For])}
              placeholder="Select a value.."
              control={control}
              name="for"
            />
            <span>using</span>
            <ComponentSelect<FormValues>
              options={toOptions(components[ComponentType.Using])}
              placeholder="Select a value.."
              control={control}
              name="using"
            />
            <span>and on</span>
            <ComponentSelect<FormValues>
              options={toOptions(components[ComponentType.On])}
              placeholder="Select a value.."
              control={control}
              name="on"
            />
            <span>but</span>
            <ComponentSelect<FormValues>
              options={toOptions(components[ComponentType.But])}
              placeholder="Select a value.."
              control={control}
              name="but"
            />
          </div>
        )}
        {isLoading && (
          <div>
            <Loading />
          </div>
        )}
        <p className="mt-4 text-left font-semibold text-black">2. Generate your idea:</p>
        <div className="flex flex-row items-center justify-center  gap-4">
          <Button
            className="group"
            type="button"
            variant={'link'}
            onClick={() => randomize()}
            icon={<ArrowPathIcon className="h-4 w-4 group-hover:animate-spin" />}
          >
            Randomize
          </Button>
          <Button
            className="group"
            type="submit"
            loading={generating}
            icon={<SparklesIcon className="h-4 w-4 group-hover:animate-pulse" />}
          >
            Generate
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default GenerateForm;
