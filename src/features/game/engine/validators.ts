export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}

export function isSpellingCorrect(input: string, answer: string): boolean {
  return normalizeAnswer(input) === normalizeAnswer(answer);
}
