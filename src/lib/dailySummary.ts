import type { LearningStats } from './stats';

export interface DailySummary {
  completedTaskCount: number;
  totalTaskCount: number;
  learnedWords: number;
  reviewWords: number;
  message: string;
}

export function buildDailySummary(completedKinds: string[], stats: LearningStats): DailySummary {
  const completedTaskCount = completedKinds.length;
  const totalTaskCount = ['review', 'new', 'practice'].filter((kind) => {
    if (kind === 'review') return stats.stageCounts.review > 0;
    if (kind === 'new') return stats.stageCounts.new > 0;
    return stats.stageCounts.learning + stats.stageCounts.practicing > 0 || completedKinds.includes('practice');
  }).length || 1;

  const learnedWords = stats.learnedWords;
  const reviewWords = stats.stageCounts.review;

  const message = completedTaskCount >= totalTaskCount
    ? '今天的学习任务基本完成啦，干得漂亮！'
    : `今天已经完成 ${completedTaskCount} 项任务，继续保持～`;

  return {
    completedTaskCount,
    totalTaskCount,
    learnedWords,
    reviewWords,
    message,
  };
}
