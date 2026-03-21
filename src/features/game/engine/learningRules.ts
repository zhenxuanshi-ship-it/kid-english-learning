import type { GameMode } from '../../../types/question';
import type { LearningStage, WordProgress } from '../../progress/types';

export function getInitialLearningStage(): LearningStage {
  return 'new';
}

export function getNextLearningStage(progress: WordProgress, isCorrect: boolean): LearningStage {
  const correctCount = progress.correctCount + (isCorrect ? 1 : 0);
  const wrongCount = progress.wrongCount + (isCorrect ? 0 : 1);

  switch (progress.learningStage) {
    case 'new':
      return 'learning';
    case 'learning':
      return correctCount >= 2 ? 'practicing' : 'learning';
    case 'practicing':
      return correctCount >= 4 && wrongCount <= 1 ? 'mastered' : 'practicing';
    case 'mastered':
      return wrongCount >= 3 && wrongCount > correctCount / 2 ? 'review' : 'mastered';
    case 'review':
      if (correctCount >= 4 && wrongCount <= 2) return 'mastered';
      if (correctCount >= 2) return 'practicing';
      return 'review';
    default:
      return 'learning';
  }
}

export function getAllowedModes(progress: WordProgress): GameMode[] {
  switch (progress.learningStage) {
    case 'new':
      return ['e2c'];
    case 'learning':
      return ['e2c', 'c2e'];
    case 'practicing':
      return ['c2e', 'spell_blank'];
    case 'review':
      return ['e2c', 'c2e', 'spell_blank'];
    case 'mastered':
      return ['c2e', 'spell_blank'];
    default:
      return ['e2c'];
  }
}

export function getStagePriority(stage: LearningStage): number {
  switch (stage) {
    case 'review':
      return 1;
    case 'learning':
      return 2;
    case 'new':
      return 3;
    case 'practicing':
      return 4;
    case 'mastered':
      return 5;
    default:
      return 99;
  }
}

export function resolveModeForStage(requestedMode: GameMode, progress?: WordProgress): GameMode {
  if (!progress) return requestedMode === 'spell_blank' ? 'e2c' : requestedMode;
  const allowedModes = getAllowedModes(progress);
  if (allowedModes.includes(requestedMode)) return requestedMode;
  return allowedModes[0] ?? 'e2c';
}
