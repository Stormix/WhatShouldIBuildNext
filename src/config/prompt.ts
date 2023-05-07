import type { ChatCompletionRequestMessage } from 'openai';

export const defaultContext: (prompt: string) => ChatCompletionRequestMessage[] = (prompt) => [
  {
    role: 'system',
    content: `You're an AI developer assistant and your job is to generate sensible project ideas based on user prompts.
              Return only one idea. It must include all the requirements and add as much detail as possible.
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
              The time to complete should be in hours.`
  },
  {
    role: 'user',
    content: `Generate a project idea using the following prompt:\n\n\`\`\`\n${prompt}\n\`\`\`\n\n`
  }
];

export const defaultParams = {
  model: 'gpt-3.5-turbo',
  temperature: 0.9,
  presence_penalty: 0.6,
  max_tokens: 250
};
