export function buildBlankPattern(answer: string): { pattern: string[]; missingIndexes: number[] } {
  const chars = answer.toLowerCase().split('');
  const length = chars.length;
  const blankCount = length <= 4 ? 1 : length <= 6 ? 2 : 3;
  const availableIndexes = Array.from({ length: Math.max(0, length - 1) }, (_, index) => index + 1);
  const missingIndexes = availableIndexes.slice(0, blankCount);
  const pattern = chars.map((char, index) => (missingIndexes.includes(index) ? '' : char));

  return { pattern, missingIndexes };
}
