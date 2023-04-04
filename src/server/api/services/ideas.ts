import type { Component } from '@prisma/client';
import { ComponentType } from '@prisma/client';

export default class IdeasService {
  static componentsToPrompt(components: Component[]) {
    // const template = ``;

    const componentsMap = components.reduce((acc, component) => {
      acc[component.type] = component;
      return acc;
    }, {} as Record<ComponentType, Component>);

    const prompt = `Build ${componentsMap[ComponentType.What].value} for ${
      componentsMap[ComponentType.For].value
    } using ${componentsMap[ComponentType.Using].value} and deploy on ${componentsMap[ComponentType.On].value} but ${
      componentsMap[ComponentType.But].value
    }`;

    return prompt;
  }
}
