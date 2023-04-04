import { env } from '@/env.mjs';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: env.OPENAI_KEY
});

export const openai = new OpenAIApi(configuration);
