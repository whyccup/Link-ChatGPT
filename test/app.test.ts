import request from 'supertest';
import app from '../src/app';
import { isMedicalContent, containsSensitiveWords } from '../src/utils';
import { generateText } from '../src/gpt-client';

jest.mock('../src/utils', () => ({
  isMedicalContent: jest.fn(),
  containsSensitiveWords: jest.fn()
}));

jest.mock('../src/gpt-client', () => ({
  generateText: jest.fn()
}));

describe('POST /gpt-proxy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns error if not medical content or contains sensitive words', async () => {
    (isMedicalContent as jest.Mock).mockReturnValue(false);
    (containsSensitiveWords as jest.Mock).mockReturnValue(true);

    const response = await request(app).post('/gpt-proxy').send({ text: 'test input' });

    expect(isMedicalContent).toHaveBeenCalledWith('test input');
    expect(containsSensitiveWords).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: '非医疗内容或包含敏感词' });
  });

  it('returns error if contains sensitive words', async () => {
    (isMedicalContent as jest.Mock).mockReturnValue(true);
    (containsSensitiveWords as jest.Mock).mockReturnValue(true);

    const response = await request(app).post('/gpt-proxy').send({ text: 'test input' });

    expect(isMedicalContent).toHaveBeenCalledWith('test input');
    expect(containsSensitiveWords).toHaveBeenCalledWith('test input');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: '非医疗内容或包含敏感词' });
  });

  test('returns GPT API generated text on success', async () => {
    (isMedicalContent as jest.Mock).mockReturnValue(true);
    (containsSensitiveWords as jest.Mock).mockReturnValue(false);
    (generateText as jest.Mock).mockResolvedValue({
      data: {
        choices: [{ text: 'generated text' }]
      }
    });

    const response = await request(app).post('/gpt-proxy').send({ text: 'test input' });

    expect(isMedicalContent).toHaveBeenCalledWith('test input');
    expect(containsSensitiveWords).toHaveBeenCalledWith('test input');
    expect(generateText).toHaveBeenCalledWith('test input');
    expect(response.status).toBe(200);
    expect(response.body).toBe('generated text');
  });

  test('returns error if GPT API request fails', async () => {
    (isMedicalContent as jest.Mock).mockReturnValue(true);
    (containsSensitiveWords as jest.Mock).mockReturnValue(false);
    (generateText as jest.Mock).mockRejectedValue(new Error('GPT API请求失败'));

    const response = await request(app).post('/gpt-proxy').send({ text: 'test input' });

    expect(isMedicalContent).toHaveBeenCalledWith('test input');
    expect(containsSensitiveWords).toHaveBeenCalledWith('test input');
    expect(generateText).toHaveBeenCalledWith('test input');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'GPT API请求失败' });
  });

  it('should return 400 Bad Request if inputText is empty or undefined', async () => {
    // Test with empty string
    const responseEmpty = await request(app).post('/gpt-proxy').send({ inputText: '' });
    expect(responseEmpty.status).toEqual(400);
    expect(responseEmpty.text).toEqual('Bad Request: inputText is empty or undefined');

    // Test with undefined inputText
    const responseUndefined = await request(app).post('/gpt-proxy').send({});
    expect(responseUndefined.status).toEqual(400);
    expect(responseUndefined.text).toEqual('Bad Request: inputText is empty or undefined');
  });
});
