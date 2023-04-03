import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { isMedicalContent, containsSensitiveWords } from './utils';
import { generateText } from './gpt-client';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.post('/gpt-proxy', async (req: Request, res: Response) => {
  const inputText = req.body.text;

  if (!isMedicalContent(inputText) || containsSensitiveWords(inputText)) {
    console.log('inputText', inputText);
    res.status(400).json({ error: '非医疗内容或包含敏感词' });
    return;
  }

  try {
    const response = await generateText(inputText);
    res.json(response.data.choices[0].text);
  } catch (error) {
    res.status(500).json({ error: 'GPT API请求失败' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
