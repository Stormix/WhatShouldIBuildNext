import { cn } from '@/utils/styles';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Component } from '@prisma/client';
import { ComponentType } from '@prisma/client';
import type { FC } from 'react';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
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
import { Switch } from '../atoms/Switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../atoms/Tooltip';
import SimpleSelect from './SimpleSelect';

const FormSettings: FC<{
  components: Record<ComponentType, Component[]>;
  open: boolean;
  onClose: () => void;
}> = ({ components, onClose }) => {
  const schema = z.object({
    ...Object.keys(components).reduce((acc, curr) => {
      acc[curr as ComponentType] = z.array(z.object({ id: z.string(), value: z.string(), enabled: z.boolean() }));
      return acc;
    }, {} as Record<ComponentType, z.ZodArray<z.ZodObject<{ id: z.ZodString; value: z.ZodString; enabled: z.ZodBoolean }>>>)
  });

  type FormValues = z.TypeOf<typeof schema>;

  const savedSettings = localStorage.getItem('settings');
  const savedValues = savedSettings ? (JSON.parse(savedSettings) as FormValues) : undefined;

  const defaultValues = {
    ...Object.keys(components).reduce((acc, curr) => {
      acc[curr as ComponentType] = components[curr as ComponentType].map((c) => ({
        id: c.id,
        value: c.value,
        enabled: savedValues?.[curr as ComponentType]?.find((v) => v.id === c.id)?.enabled ?? true
      }));
      return acc;
    }, {} as Record<ComponentType, { id: string; value: string; enabled: boolean }[]>)
  };

  const [challengeMode, setChallengeMode] = useState(false);
  const { handleSubmit, setValue, getValues, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues
  });

  // Watch for changes and re-render
  watch();

  const values = getValues();

  const remove = (type: ComponentType, id: string) => {
    const component = components[type].find((c) => c.id === id) as Component;
    setValue(type, [...(values[type]?.filter((v) => v.id !== id) ?? []), { ...component, enabled: false }]);
  };

  const add = (type: ComponentType, id: string) => {
    const component = components[type].find((c) => c.id === id) as Component;
    setValue(type, [...(values[type]?.filter((v) => v.id !== id) ?? []), { ...component, enabled: true }]);
  };

  const onSubmit = (data: FormValues) => {
    // Save to local storage
    try {
      localStorage.setItem('settings', JSON.stringify(data));
      toast.success('Settings saved!');
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      onClose();
    }
  };

  return (
    <>
      <form className="flex h-full w-full">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Settings</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex items-center justify-between">
                <p>Customize the idea generator settings:</p>
                <div className="flex items-center gap-4">
                  <div className="italic">Challenge mode options: </div>
                  <Switch checked={challengeMode} onCheckedChange={setChallengeMode} />
                </div>
              </div>
              <div
                className={cn('grid grid-cols-4 gap-4 py-4', {
                  'grid-cols-5': challengeMode
                })}
              >
                {(Object.keys(components) as ComponentType[])
                  .sort((a, b) => (a > b ? -1 : 1))
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
                          add(type, value.value);
                        }}
                      />
                      <ScrollArea className="h-72 rounded-md border">
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
                                        onClick={() => remove(type, component.id)}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="Tooltip">
                                      <p className="w-fit bg-background p-2 text-sm">Remove option</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                {index < components[type as ComponentType].length - 1 && <Separator className="my-2" />}
                              </Fragment>
                            ))}
                        </div>
                      </ScrollArea>
                    </div>
                  ))}
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
