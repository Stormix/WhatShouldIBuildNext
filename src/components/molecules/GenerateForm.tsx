import { api } from '@/utils/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentType } from '@prisma/client';
import { useForm } from 'react-hook-form';

import { defaultParams } from '@/config/prompt';
import { useIdeasStore } from '@/hooks/store/ideas';
import type { ComponentSettings } from '@/hooks/useComponentSettings';
import useComponentSettings from '@/hooks/useComponentSettings';
import { toOptions } from '@/utils/ideas';
import type { GenerateInput } from '@/validation/generate';
import { generateInputSchema } from '@/validation/generate';
import { ArrowPathIcon, Cog6ToothIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { sample } from 'lodash';
import mixpanel from 'mixpanel-browser';
import { useSession } from 'next-auth/react';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AlertDialog, AlertDialogTrigger } from '../atoms/AlertDialog';
import Button from '../atoms/Button';
import { Card, CardContent } from '../atoms/Card';
import Loading from '../atoms/Loading';
import { Switch } from '../atoms/Switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../atoms/Tooltip';
import FormSettings from './FormSettings';
import ComponentSelect from './WrappedSelect';

const GenerateForm: FC<{ loading?: boolean }> = ({ loading }) => {
  const { data: session, update } = useSession();
  const { setGeneratedIdea } = useIdeasStore();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = api.components.getAll.useQuery();
  const [challengeMode, setChallengeMode] = useState(false);

  const { mutate: generate, isLoading: generating } = api.ideas.generate.useMutation({
    onSuccess: (data) => {
      update();
      setGeneratedIdea(data.id);
    },
    onError: (error) => {
      toast.error(error.message, {
        position: 'bottom-center'
      });
    }
  });

  const { isEnabled } = useComponentSettings();

  const components = data?.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push({ ...curr, enabled: isEnabled(curr.type, curr.id) });
    return acc;
  }, {} as ComponentSettings);

  const { handleSubmit, setValue, control, getValues } = useForm<GenerateInput>({
    resolver: zodResolver(generateInputSchema),
    defaultValues: {
      options: {
        temperature: defaultParams.temperature,
        presencePenalty: defaultParams.presence_penalty
      }
    }
  });

  const onSubmit = (data: GenerateInput) => {
    mixpanel.track('Clicked Generate');
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
    if (!generating) {
      setGeneratedIdea(null);
      if (!challengeMode) delete data.but;
      generate(data);
    }
  };

  const randomize = () => {
    mixpanel.track('Clicked randomize');
    for (const componentType in components) {
      const type = componentType as ComponentType;
      const enabledComponents = components[type].filter((component) => component.enabled);
      const component = sample(enabledComponents);
      setValue(type.toLowerCase() as keyof GenerateInput, component!.id);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-full w-full">
      <Card className="z-20 flex h-full w-full ">
        <CardContent className="flex w-full flex-col gap-4">
          <p className="text-left font-semibold ">1. Pick your components or randomize:</p>
          {components && (
            <div className="flex flex-row flex-wrap items-center justify-center gap-1">
              <span>Build</span>
              <ComponentSelect<GenerateInput>
                options={toOptions(components[ComponentType.What])}
                placeholder="Select a value.."
                control={control}
                name="what"
              />
              <span>for</span>
              <ComponentSelect<GenerateInput>
                options={toOptions(components[ComponentType.For])}
                placeholder="Select a value.."
                control={control}
                name="for"
              />
              <span>using</span>
              <ComponentSelect<GenerateInput>
                options={toOptions(components[ComponentType.Using])}
                placeholder="Select a value.."
                control={control}
                name="using"
              />
              <span>and on</span>
              <ComponentSelect<GenerateInput>
                options={toOptions(components[ComponentType.On])}
                placeholder="Select a value.."
                control={control}
                name="on"
              />
              {challengeMode && (
                <>
                  <span>but</span>
                  <ComponentSelect<GenerateInput>
                    options={toOptions(components[ComponentType.But])}
                    placeholder="Select a value.."
                    control={control}
                    name="but"
                  />
                </>
              )}
              <AlertDialog
                open={open}
                onOpenChange={(opened) => {
                  mixpanel.track('Clicked settings');
                  setOpen(opened);
                }}
              >
                <AlertDialogTrigger>
                  <Button variant={'outline'} icon={<Cog6ToothIcon className="h-5 w-5" />} />
                </AlertDialogTrigger>
                <FormSettings
                  open={open}
                  onClose={() => setOpen(false)}
                  challengeMode
                  options={getValues()['options']}
                  onOptionsChange={(options) => {
                    setValue('options', {
                      ...getValues()['options'],
                      ...options
                    });
                  }}
                />
              </AlertDialog>
            </div>
          )}
          {isLoading && (
            <div className="flex w-full items-center justify-center">
              <Loading className="h-8 w-8" />
            </div>
          )}
          <div className="mt-4 flex gap-4">
            <Tooltip>
              <TooltipTrigger>
                <div className="italic">Challenge Mode: </div>
              </TooltipTrigger>
              <TooltipContent className="Tooltip">
                <p className="max-w-md text-sm">
                  Challenge mode adds a &quot;but&quot; component to your idea. This adds some restrictions to the idea,
                  making it more challenging to build.
                </p>
              </TooltipContent>
            </Tooltip>
            <Switch
              checked={challengeMode}
              onCheckedChange={(checked) => {
                mixpanel.track('Toggled challenge mode', {
                  challengeModeEnabled: checked
                });
                setChallengeMode(checked);
              }}
            />
          </div>
          <p className="mt-4 text-left font-semibold ">2. Generate your idea:</p>
          <div className="flex flex-row items-center justify-center  gap-4">
            <Button
              className="group"
              type="button"
              variant="link"
              onClick={() => randomize()}
              icon={<ArrowPathIcon className="h-4 w-4 group-hover:animate-spin" />}
            >
              Randomize
            </Button>
            <Button
              className="group"
              type="submit"
              loading={generating || loading}
              icon={<SparklesIcon className="h-4 w-4 group-hover:animate-pulse" />}
            >
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default GenerateForm;
