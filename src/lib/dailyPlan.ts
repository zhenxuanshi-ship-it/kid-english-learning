import type { GameMode } from '../types/question';
import type { LearningStats } from './stats';

export interface DailyPlan {
  title: string;
  summary: string;
  tasks: Array<{
    label: string;
    count: number;
    mode: GameMode;
    kind: 'new' | 'review' | 'practice';
  }>;
}

export function buildDailyPlan(stats: LearningStats): DailyPlan {
  const tasks: DailyPlan['tasks'] = [];

  if (stats.stageCounts.review > 0) {
    tasks.push({ label: '先复习旧词', count: stats.stageCounts.review, mode: 'e2c', kind: 'review' });
  }
  if (stats.stageCounts.new > 0) {
    tasks.push({ label: '认识新词', count: stats.stageCounts.new, mode: 'e2c', kind: 'new' });
  }
  const practiceCount = stats.stageCounts.learning + stats.stageCounts.practicing;
  if (practiceCount > 0) {
    tasks.push({ label: '继续拼写练习', count: practiceCount, mode: 'c2e', kind: 'practice' });
  }

  if (tasks.length === 0) {
    tasks.push({ label: '来一轮综合练习', count: 5, mode: 'c2e', kind: 'practice' });
  }

  return {
    title: '今日学习任务',
    summary: `今天建议按顺序完成 ${tasks.length} 组小任务。`,
    tasks,
  };
}
