'use client';

import type { ComponentType } from '@prisma/client';

export type ComponentSettings = Record<
  ComponentType,
  {
    id: string;
    value: string;
    enabled: boolean;
  }[]
>;

const useComponentSettings = () => {
  const savedSettings = typeof window !== 'undefined' ? window.localStorage.getItem('settings') : undefined;
  const settings = savedSettings ? (JSON.parse(savedSettings) as ComponentSettings) : undefined;
  const isEnabled = (componentType: ComponentType, id: string) => {
    if (!settings) {
      return true;
    }

    const componentSettings = settings[componentType];
    if (!componentSettings) {
      return true;
    }

    const componentSetting = componentSettings.find((setting) => setting.id === id);
    if (!componentSetting) {
      return true;
    }

    return componentSetting.enabled;
  };
  return { settings, isEnabled };
};

export default useComponentSettings;
