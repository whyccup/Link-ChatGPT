import { expect } from 'chai';
import { isMedicalContent, containsSensitiveWords } from '../src/app';

describe('isMedicalContent', () => {
  it('should return true for medical content', () => {
    const text = '心脏病是一种常见的疾病。';
    expect(isMedicalContent(text)).to.be.true;
  });

  it('should return false for non-medical content', () => {
    const text = '我喜欢吃苹果。';
    expect(isMedicalContent(text)).to.be.false;
  });
});

describe('containsSensitiveWords', () => {
  it('should return true for text containing sensitive words', () => {
    const text = '习近平';
    expect(containsSensitiveWords(text)).to.be.true;
  });

  it('should return false for text without sensitive words', () => {
    const text = '这是一个不包含敏感词的句子。';
    expect(containsSensitiveWords(text)).to.be.false;
  });
});
