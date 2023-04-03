import MEDICAL_KEYWORDS from './keywords/medical.json';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Segment = require('segment');

const SENSITIVE_WORDS: string[] = ['习近', '平'];

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

export { isMedicalContent, containsSensitiveWords };
