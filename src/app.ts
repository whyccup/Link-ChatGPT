import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// import jwt from 'jsonwebtoken';
// import fs from 'fs';
// import { isString } from 'lodash';
import logger from './logger';
import { generateText } from './gpt-client';
import { isMedicalContent, containsSensitiveWords } from './utils';

dotenv.config();
const PORT = process.env.PORT || 3000;

// Load public key
// const publicKey = fs.readFileSync('./public_key.pem', 'utf8');

const app = express();
app.use(express.json());

app.post('/gpt-proxy', async (req: Request, res: Response) => {
  logger.info('when gpt-proxy get post', req.body);
  const inputText = req.body.text;

  // const token = req.headers['x-auth-token'];
  // if (!token || !isString(token)) {
  //   res.status(401).send('Unauthorized: No token provided');
  //   return;
  // }

  // try {
  //   jwt.verify(token, publicKey, { algorithms: ['RS256'] });
  // } catch (error) {
  //   res.status(401).send('Unauthorized: Invalid token');
  //   return;
  // }

  if (!inputText) {
    res.status(400).send('Bad Request: inputText is empty or undefined');
    return;
  }

  if (!isMedicalContent(inputText) || containsSensitiveWords(inputText)) {
    logger.warn('非医疗内容或包含敏感词', inputText);
    res.status(400).json({ error: '非医疗内容或包含敏感词' });
    return;
  }

  try {
    const response = await generateText(inputText);
    res.json(response.data.choices[0].text);
    logger.info('when gpt-api return', response);
  } catch (error) {
    logger.error('when gpt-api return a error', error);
    res.status(500).json({ error: 'GPT API请求失败' });
  }
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;
