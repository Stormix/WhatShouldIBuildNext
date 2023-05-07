import { defaultParams } from '@/config/prompt';
import type { ComponentSettings } from '@/hooks/useComponentSettings';
import useComponentSettings from '@/hooks/useComponentSettings';
import { api } from '@/utils/api';
import { cn } from '@/utils/styles';
import type { GenerateInput } from '@/validation/generate';
import { generateSettingsSchema } from '@/validation/generate';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Component } from '@prisma/client';
import { ComponentType } from '@prisma/client';
import { omit } from 'lodash';
import mixpanel from 'mixpanel-browser';
import type { FC } from 'react';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../atoms/AlertDialog';
import { ScrollArea } from '../atoms/ScrollArea';
import { Separator } from '../atoms/Separator';
import { Slider } from '../atoms/Slider';
import { Switch } from '../atoms/Switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../atoms/Tooltip';
import SimpleSelect from './SimpleSelect';

type FormValues = ComponentSettings & {
  options: Required<Exclude<GenerateInput['options'], undefined>>;
};

const FormSettings: FC<{
  open: boolean;
  onClose: () => void;
  challengeMode: boolean;
  options: GenerateInput['options'];
  onOptionsChange: (options: GenerateInput['options']) => void;
}> = ({ onClose, challengeMode: challengeModeDefault, options, onOptionsChange }) => {
  const [challengeMode, setChallengeMode] = useState(challengeModeDefault);
  const { data } = api.components.getAll.useQuery();
  const { isEnabled } = useComponentSettings();

  const components = data?.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<ComponentType, Component[]>);

  const defaultValues: FormValues = {
    ...Object.values(ComponentType).reduce((acc, curr) => {
      const type = curr as ComponentType;
      acc[type] =
        components?.[type]?.map((c) => ({
          id: c.id,
          value: c.value,
          enabled: isEnabled(type, c.id)
        })) ?? [];
      return acc;
    }, {} as Record<ComponentType, { id: string; value: string; enabled: boolean }[]>),
    options: {
      temperature: options?.temperature ?? defaultParams.temperature,
      presencePenalty: options?.presencePenalty ?? defaultParams.presence_penalty
    }
  };

  const { handleSubmit, setValue, getValues, watch } = useForm<FormValues>({
    resolver: zodResolver(generateSettingsSchema),
    defaultValues
  });

  const values = getValues();

  const removeComponent = (type: ComponentType, id: string) => {
    const component = components?.[type].find((c) => c.id === id);
    if (component)
      setValue(type, [...(values[type]?.filter((v) => v.id !== id) ?? []), { ...component, enabled: false }]);
  };

  const addComponent = (type: ComponentType, id: string) => {
    const component = components?.[type].find((c) => c.id === id);
    if (component)
      setValue(type, [...(values[type]?.filter((v) => v.id !== id) ?? []), { ...component, enabled: true }]);
  };

  const onSubmit = (data: FormValues) => {
    try {
      mixpanel.track('Updated settings');
      const componentSettings = omit(data, ['options']);
      // Save to local storage
      onOptionsChange(data.options);
      localStorage.setItem('settings', JSON.stringify(componentSettings));
      toast.success('Settings saved!');
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      onClose();
    }
  };

  // Watch for changes and re-render
  watch();

  return (
    <>
      <form className="flex h-full w-full">
        <AlertDialogContent className="mt-96 h-screen overflow-auto md:mt-2 md:h-fit">
          <AlertDialogHeader>
            <AlertDialogTitle>Settings</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col  items-center justify-between md:flex-row">
                <p>1. Customize the idea generator settings:</p>
                <div className="flex items-center gap-4">
                  <div className="italic">Challenge mode options: </div>
                  <Switch checked={challengeMode} onCheckedChange={setChallengeMode} />
                </div>
              </div>
              <div
                className={cn('grid grid-cols-1 gap-4 py-4 md:grid-cols-4 ', {
                  'md:grid-cols-5': challengeMode
                })}
              >
                {Object.values(ComponentType)
                  .filter((type) => (challengeMode ? true : type !== ComponentType.But))
                  .map((type) => (
                    <div className="flex flex-col" key={type}>
                      <h4 className="mb-2">
                        &quot;{type}&quot; <span className="font-normal">values</span>
                      </h4>
                      <SimpleSelect
                        options={values[type]
                          .filter((v) => !v.enabled)
                          .map((v) => ({
                            label: v.value,
                            value: v.id
                          }))}
                        placeholder="Add back values.."
                        className="mb-2 w-full"
                        onSelect={(value) => {
                          addComponent(type, value.value);
                        }}
                      />
                      <ScrollArea className="h-24 rounded-md  border md:h-72">
                        <div className="px-2 py-2">
                          {values[type as ComponentType]
                            .filter((v) => v.enabled)
                            .map((component, index) => (
                              <Fragment key={component.id}>
                                <div className="flex items-center justify-between">
                                  <span className="flex-1">{component.value}</span>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <XMarkIcon
                                        className="h-4 w-4 hover:text-destructive"
                                        onClick={() => removeComponent(type, component.id)}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="Tooltip">
                                      <p className="w-fit bg-background p-2 text-sm">Remove option</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                {components && index < components[type as ComponentType].length - 1 && (
                                  <Separator className="my-2" />
                                )}
                              </Fragment>
                            ))}
                        </div>
                      </ScrollArea>
                    </div>
                  ))}
              </div>
              <div className="mt-4">
                <p>2. Fine-tune chat completion params:</p>
                <div className="flex flex-grow flex-col gap-2 ">
                  <div className="flex w-full flex-col items-center gap-4 md:flex-row">
                    <label className="min-w-fit">Temperature:</label>
                    <Slider
                      defaultValue={[defaultParams.temperature]}
                      max={1}
                      step={0.01}
                      min={0}
                      value={[values.options.temperature]}
                      onValueChange={(value) => {
                        setValue('options.temperature', value[0] as number);
                      }}
                    />
                    <p>{values.options.temperature.toPrecision(2)}</p>
                  </div>
                  <div className="flex w-full flex-col items-center gap-4 md:flex-row">
                    <label className="min-w-fit">Presence Penalty:</label>
                    <Slider
                      defaultValue={[defaultParams.presence_penalty]}
                      max={1}
                      step={0.01}
                      min={0}
                      value={[values.options.presencePenalty]}
                      onValueChange={(value) => {
                        setValue('options.presencePenalty', value[0] as number);
                      }}
                    />
                    <p>{values.options.presencePenalty.toPrecision(2)}</p>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit(onSubmit)}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </>
  );
};

export default FormSettings;
