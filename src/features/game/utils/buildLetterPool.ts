import { shuffle } from '../../../lib/helpers';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export function buildLetterPool(answer: string, targetSize = 10): string[] {
  const letters = answer.toLowerCase().split('');
  const pool = [...letters];

  while (pool.length < Math.max(targetSize, letters.length)) {
    const candidate = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    pool.push(candidate);
  }

  return shuffle(pool);
}
