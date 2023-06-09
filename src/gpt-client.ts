import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const GPT_API_KEY = process.env.GPT_API_KEY;
const USE_PROXY = process.env.NODE_ENV === 'Development';

const configuration = new Configuration({
  apiKey: GPT_API_KEY
});

const openai = new OpenAIApi(configuration);

const axiosConfig = USE_PROXY
  ? {
      proxy: {
        host: '127.0.0.1',
        port: 7078,
        protocol: 'Socks5'
      }
    }
  : undefined;

async function generateText(prompt: string) {
  return await openai.createCompletion(
    {
      model: 'gpt-3.5-turbo',
      prompt: prompt,
      max_tokens: 100
    },
    axiosConfig
  );
}

async function generateChat(content: string) {
  return await openai.createChatCompletion(
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: content }],
      max_tokens: 100
    },
    axiosConfig
  );
}

async function getModeList() {
  return await openai.listModels();
}
export { GPT_API_KEY, openai, generateText, generateChat, getModeList };
