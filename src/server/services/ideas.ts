import type { Component } from '@prisma/client';
import { ComponentType } from '@prisma/client';
import { openai } from '../api/openai';

export default class IdeasService {
  static componentsToPrompt(components: Component[]) {
    const componentsMap = components.reduce((acc, component) => {
      acc[component.type] = component;
      return acc;
    }, {} as Record<ComponentType, Component>);

    const what = componentsMap[ComponentType.What].value;
    const on = componentsMap[ComponentType.On].value;
    const for_ = componentsMap[ComponentType.For].value;
    const using = componentsMap[ComponentType.Using].value;
    const but = componentsMap[ComponentType.But]?.value;
    const prompt = `Build ${what} for ${for_} using ${using} and deploy on ${on}`;

    if (but) return `${prompt} but ${but}`;
    return prompt;
  }

  static async generate(prompt: string) {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `You're an AI developer assistant and your job is to generate sensible project ideas based on user prompts.
      Here's a prompt: ${prompt}. Return only one idea. It must include all the requirements and add as much detail as possible.
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
      temperature: 0.9,
      presence_penalty: 0.6,
      max_tokens: 250
    });

    const rawResponse = response.data.choices[0]?.text;

    if (!rawResponse) {
      throw new Error('No response from OpenAI');
    }

    return rawResponse;
  }
}
