import request from 'supertest';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { generateText, openai } from '../src/gpt-client';

dotenv.config();

describe.skip('POST /gpt-proxy', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/gpt-proxy', async (req: Request, res: Response) => {
      const inputText = req.body.text;
      const response = await generateText(inputText);
      res.json(response.data.choices[0].text);
    });
  });

  it('should respond with generated text when given valid medical content', async () => {
    const inputText = 'Some valid medical content';
    const response = await request(app).post('/gpt-proxy').send({ text: inputText }).expect(200);

    expect(response.body).toBeTruthy();
    expect(typeof response.body).toBe('string');
  });

  it('should respond with error when given non-medical content', async () => {
    const inputText = 'Some non-medical content';
    const response = await request(app).post('/gpt-proxy').send({ text: inputText }).expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('非医疗内容或包含敏感词');
  });

  it('should respond with error when given sensitive content', async () => {
    const inputText = 'Some sensitive content';
    const response = await request(app).post('/gpt-proxy').send({ text: inputText }).expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('非医疗内容或包含敏感词');
  });

  it('should respond with error when GPT API fails', async () => {
    const inputText = 'Some valid medical content';
    jest.spyOn(openai, 'createCompletion').mockImplementation(() => {
      throw new Error('GPT API请求失败');
    });

    const response = await request(app).post('/gpt-proxy').send({ text: inputText }).expect(500);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('GPT API请求失败');
  });
});
