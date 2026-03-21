import type { DailyPlan } from './dailyPlan';

export interface NextTaskRecommendation {
  currentIndex: number;
  nextIndex: number | null;
  nextLabel?: string;
  message: string;
}

export function getNextTaskRecommendation(plan: DailyPlan, completedKinds: string[]): NextTaskRecommendation {
  const currentIndex = plan.tasks.findIndex((task) => !completedKinds.includes(task.kind));

  if (currentIndex === -1) {
    return {
      currentIndex: plan.tasks.length,
      nextIndex: null,
      message: '今天的任务已经完成啦，想再练一轮也可以。',
    };
  }

  const nextTask = plan.tasks[currentIndex];
  return {
    currentIndex,
    nextIndex: currentIndex,
    nextLabel: nextTask.label,
    message: `下一步建议：${nextTask.label}`,
  };
}
