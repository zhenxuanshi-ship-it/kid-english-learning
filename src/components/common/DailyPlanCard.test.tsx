import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DailyPlanCard } from './DailyPlanCard';

describe('DailyPlanCard', () => {
  const plan = {
    title: '今日学习任务',
    summary: '今天建议按顺序完成 3 组小任务。',
    tasks: [
      { label: '先复习旧词', count: 3, mode: 'e2c' as const, kind: 'review' as const },
      { label: '认识新词', count: 4, mode: 'e2c' as const, kind: 'new' as const },
    ],
  };

  it('shows progress, task labels, and completion badge', () => {
    render(<DailyPlanCard plan={plan} completedKinds={['review']} onStartTask={vi.fn()} />);
    expect(screen.getByText('今日进度 1/2')).toBeInTheDocument();
    expect(screen.getByText(/先复习旧词/)).toBeInTheDocument();
    expect(screen.getByText(/认识新词/)).toBeInTheDocument();
    expect(screen.getByText(/已完成/)).toBeInTheDocument();
    expect(screen.getByText(/今天这项任务已经拿下啦/)).toBeInTheDocument();
  });

  it('calls onStartTask when task button is clicked', () => {
    const onStartTask = vi.fn();
    render(<DailyPlanCard plan={plan} completedKinds={[]} onStartTask={onStartTask} />);
    const startButton = screen.getAllByRole('button').find((button) => button.textContent?.includes('开始'));
    expect(startButton).toBeTruthy();
    fireEvent.click(startButton!);
    expect(onStartTask).toHaveBeenCalled();
  });
});
