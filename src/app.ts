import express, { Request, Response } from 'express';
import axios from 'axios';
import { config as dotenvConfig } from 'dotenv';
import Segment from 'segment';
import MEDICAL_KEYWORDS from './keywords/medical.json';

dotenvConfig();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GPT_API_KEY = process.env.GPT_API_KEY;
const GPT_API_URL = process.env.GPT_API_URL || 'https://api.openai.com/v1/engines/davinci-codex/completions';
const SENSITIVE_WORDS: string[] = [
  // 添加其他敏感词
];

// 添加词典
const segment = new Segment();
segment.useDefault();

function isMedicalContent(text: string): boolean {
  const keywords = segment.doSegment(text, { simple: true });
  return keywords.some((keyword: string) => MEDICAL_KEYWORDS.includes(keyword));
}

function containsSensitiveWords(text: string): boolean {
  const words = segment.doSegment(text, { simple: true });
  return words.some((word: string) => SENSITIVE_WORDS.includes(word));
}

app.post('/gpt-proxy', async (req: Request, res: Response) => {
  const inputText = req.body.text;

  if (!isMedicalContent(inputText) || containsSensitiveWords(inputText)) {
    console.log('inputText', inputText);
    res.status(400).json({ error: '非医疗内容或包含敏感词' });
    return;
  }

  try {
    const response = await axios.post(
      GPT_API_URL,
      {
        prompt: inputText,
        max_tokens: 100
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GPT_API_KEY}`
        }
      }
    );

    res.json(response.data.choices[0].text);
  } catch (error) {
    res.status(500).json({ error: 'GPT API请求失败' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { isMedicalContent, containsSensitiveWords };
