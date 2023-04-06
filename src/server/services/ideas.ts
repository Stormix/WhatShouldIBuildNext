import type { Component } from '@prisma/client';
import { ComponentType } from '@prisma/client';
import { openai } from '../api/openai';

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

  static async generate(prompt: string) {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Given the following prompt: ${prompt} generate a development project Idea. Return only one idea. It must include all the requirements.
          Use the following template in JSON:\n\n
          \`\`\`
          {
            "idea": "Your idea here",
            "description": "Your description here"
            "timeToComplete": "",
            "difficulty": ""
          }
          \`\`\`\n\n
          You can also use the following difficulty levels: easy, medium, hard, and advanced.
          The time to complete should be in hours.
          \n\n
          `,
      temperature: 0.5,
      max_tokens: 250
    });

    const rawResponse = response.data.choices[0]?.text;

    if (!rawResponse) {
      throw new Error('No response from OpenAI');
    }

    return rawResponse;
  }
}
