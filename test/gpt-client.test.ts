import { generateText, getModeList } from '../src/gpt-client';
describe('generateText', () => {
  // it('should generate text from prompt', async () => {
  //   const prompt = 'Some prompt';
  //   const result = await generateText(prompt);
  //   console.log(result);
  //   // expect(result.choices).toHaveLength(1);
  //   // expect(typeof result.choices[0].text).toBe('string');
  // }, 100000); // 设置超时时间为10000毫秒（即10秒）

  it('should return getModeList', async () => {
    await getModeList();
  });
});
