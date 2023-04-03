import { Configuration, OpenAIApi } from 'openai';

const GPT_API_KEY = process.env.GPT_API_KEY;

const configuration = new Configuration({
  organization: 'org-lqKXheDHvoEcMIDUX4FbShAx',
  apiKey: GPT_API_KEY
});

const openai = new OpenAIApi(configuration);

async function generateText(prompt: string) {
  const result = await openai.createCompletion({
    model: 'davinci-codex',
    prompt: prompt,
    max_tokens: 100
  });
  return result;
}

async function getModeList() {
  const response = await openai.listModels();
  console.log(response);
}
export { openai, generateText, getModeList };
