import type { Word } from '../../../types/word';
import type { WordProgress } from '../../progress/types';
import { sample } from '../../../lib/helpers';
import { getStagePriority } from './learningRules';

export function createRound(words: Word[], size = 5, category = 'all'): number[] {
  const source = category === 'all' ? words : words.filter((word) => word.category === category);
  const picked = source.length > 0 ? source : words;
  return sample(picked, Math.min(size, picked.length)).map((word) => word.id);
}

export function createPriorityRound(
  words: Word[],
  wordProgressMap: Record<number, WordProgress>,
  size = 5,
  category = 'all',
): number[] {
  const source = category === 'all' ? words : words.filter((word) => word.category === category);
  const picked = source.length > 0 ? source : words;
  const sorted = [...picked].sort((a, b) => {
    const stageA = wordProgressMap[a.id]?.learningStage ?? 'new';
    const stageB = wordProgressMap[b.id]?.learningStage ?? 'new';
    const stageDiff = getStagePriority(stageA) - getStagePriority(stageB);
    if (stageDiff !== 0) return stageDiff;

    const seenA = wordProgressMap[a.id]?.seenCount ?? 0;
    const seenB = wordProgressMap[b.id]?.seenCount ?? 0;
    if (seenA !== seenB) return seenA - seenB;

    return b.id - a.id;
  });

  return sorted.slice(0, Math.min(size, sorted.length)).map((word) => word.id);
}
