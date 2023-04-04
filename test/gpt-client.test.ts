import { Configuration, OpenAIApi } from 'openai';
import { GPT_API_KEY, generateText, getModeList } from '../src/gpt-client';

jest.mock('openai');

describe('GPT Client', () => {
  let openaiInstance: OpenAIApi;
  let createCompletionSpy: jest.SpyInstance;
  let listModelsSpy: jest.SpyInstance;

  beforeEach(() => {
    (OpenAIApi as jest.Mock).mockClear();
    openaiInstance = new OpenAIApi();
    createCompletionSpy = jest.spyOn(openaiInstance, 'createCompletion');
    listModelsSpy = jest.spyOn(openaiInstance, 'listModels');
  });

  it('initializes OpenAIApi with the correct configuration', () => {
    expect(Configuration).toHaveBeenCalledWith({
      organization: 'org-lqKXheDHvoEcMIDUX4FbShAx',
      apiKey: GPT_API_KEY
    });
    expect(OpenAIApi).toHaveBeenCalledTimes(1);
  });

  it.skip('generateText calls createCompletion with the correct parameters', async () => {
    const mockCompletion = { data: 'test data' };
    createCompletionSpy.mockResolvedValue(mockCompletion);

    const result = await generateText('test prompt');
    expect(createCompletionSpy).toHaveBeenCalledWith({
      model: 'gpt-3.5-turbo',
      prompt: 'test prompt',
      max_tokens: 100
    });
    expect(result).toEqual(mockCompletion);
  });

  it.skip('getModeList calls listModels', async () => {
    const mockModelList = { data: 'model list' };
    listModelsSpy.mockResolvedValue(mockModelList);

    const result = await getModeList();
    expect(listModelsSpy).toHaveBeenCalled();
    expect(result).toEqual(mockModelList);
  });
});
