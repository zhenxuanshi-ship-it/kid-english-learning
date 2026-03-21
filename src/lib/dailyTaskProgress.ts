import type { LearningStage } from '../features/progress/types';

export type DailyTaskKind = 'new' | 'review' | 'practice';

export function didCompleteDailyTask(
  kind: DailyTaskKind,
  completedWordIds: number[],
  roundStartStages: Record<number, LearningStage | undefined>,
): boolean {
  return completedWordIds.some((wordId) => {
    const stage = roundStartStages[wordId];
    if (kind === 'new') return stage === 'new';
    if (kind === 'review') return stage === 'review';
    return stage === 'learning' || stage === 'practicing';
  });
}
