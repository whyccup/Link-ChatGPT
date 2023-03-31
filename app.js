// 添加env到app
require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GPT_API_KEY = process.env.GPT_API_KEY;

const gptApiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

const medicalKeywords = [
  '治疗',
  '病情',
  '药物',
  '手术',
  '诊断',
  '医院',
  '病患'
  // 添加其他医疗相关关键词
];

const sensitiveWords = [
  '敏感词1',
  '敏感词2',
  '敏感词3'
  // 添加其他敏感词
];

function isMedicalContent(text) {
  return medicalKeywords.some(keyword => text.includes(keyword));
}

function containsSensitiveWords(text) {
  return sensitiveWords.some(word => text.includes(word));
}

app.post('/gpt-proxy', async (req, res) => {
  const inputText = req.body.text;

  if (!isMedicalContent(inputText) || containsSensitiveWords(inputText)) {
    res.status(400).json({ error: '非医疗内容或包含敏感词' });
    return;
  }

  try {
    const response = await axios.post(
      gptApiUrl,
      {
        prompt: inputText,
        max_tokens: 100
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GPT_API_KEY}`
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
