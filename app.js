// 添加env到app
const express = require('express');
const axios = require('axios');
const nodejieba = require('nodejieba');
const app = express();
app.use(express.json());
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const GPT_API_KEY = process.env.GPT_API_KEY;
const GPT_API_URL = process.env.GPT_API_URL;

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

// 在app.js的其他代码中
function isMedicalContent(text) {
  const keywords = nodejieba.extract(text, 10);
  return keywords.some(keyword => medicalKeywords.includes(keyword.word));
}

function containsSensitiveWords(text) {
  const words = nodejieba.cut(text);
  return words.some(word => sensitiveWords.includes(word));
}

app.post('/gpt-proxy', async (req, res) => {
  const inputText = req.body.text;

  if (!isMedicalContent(inputText) || containsSensitiveWords(inputText)) {
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
