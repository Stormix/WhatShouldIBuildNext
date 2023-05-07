import { defaultContext, defaultParams } from '@/config/prompt';
import type { GenerateInput } from '@/validation/generate';
import type { Component } from '@prisma/client';
import { ComponentType } from '@prisma/client';
import * as Sentry from '@sentry/node';
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

  static async generate(prompt: string, options: GenerateInput['options'], dryRun = false) {
    const params = {
      ...defaultParams,
      temperature: options?.temperature ?? defaultParams.temperature,
      presence_penalty: options?.presencePenalty ?? defaultParams.presence_penalty
    };

    if (dryRun) {
      return JSON.stringify({
        idea: 'Your idea here',
        description: 'Your description here',
        timeToComplete: '1 hour',
        difficulty: 'easy'
      });
    }

    const response = await openai.createChatCompletion({
      ...params,
      messages: defaultContext(prompt)
    });

    const rawResponse = response.data.choices?.[0]?.message?.content as string;

    if (!rawResponse) {
      Sentry.captureMessage('Failed to get message content from OpenAI', {
        extra: {
          response
        }
      });
      throw new Error('No response from OpenAI');
    }

    try {
      JSON.parse(rawResponse);
      return rawResponse;
    } catch (err) {
      // Ask model to correct the response
      const response = await openai.createChatCompletion({
        ...params,
        messages: [
          ...defaultContext(prompt),
          {
            role: 'system',
            content: `The response from OpenAI was not valid JSON. Please correct it:\n\n\`\`\`\n${rawResponse}\n\`\`\`\n\n`
          }
        ]
      });

      const correctedResponse = response.data.choices?.[0]?.message?.content as string;

      if (!correctedResponse) {
        Sentry.captureMessage('RETRY: Failed to get message content from OpenAI', {
          extra: {
            response
          }
        });
        throw new Error('No response from OpenAI');
      }

      return correctedResponse;
    }
  }
}
