import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const GPT_API_KEY = process.env.GPT_API_KEY;

const configuration = new Configuration({
  apiKey: GPT_API_KEY
});

const openai = new OpenAIApi(configuration);

async function generateText(prompt: string) {
  return await openai.createCompletion({
    model: 'gpt-3.5-turbo',
    prompt: prompt,
    max_tokens: 100
  });
}

async function generateChat(content: string) {
  return await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: content }],
    max_tokens: 100
  });
}

async function getModeList() {
  const response = await openai.listModels();
  return response;
}
export { GPT_API_KEY, openai, generateText, generateChat, getModeList };
