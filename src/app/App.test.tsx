import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

function seedProgressState() {
  localStorage.setItem(
    'kids-english-progress',
    JSON.stringify({
      totalStars: 8,
      words: {
        1: {
          wordId: 1,
          seenCount: 3,
          correctCount: 1,
          wrongCount: 2,
          lastMode: 'e2c',
          learningStage: 'review',
        },
        2: {
          wordId: 2,
          seenCount: 1,
          correctCount: 0,
          wrongCount: 0,
          lastMode: 'e2c',
          learningStage: 'new',
        },
        3: {
          wordId: 3,
          seenCount: 2,
          correctCount: 1,
          wrongCount: 0,
          lastMode: 'spell_blank',
          learningStage: 'learning',
        },
      },
    }),
  );
}

function seedSettingsState() {
  localStorage.setItem(
    'kids-english-settings',
    JSON.stringify({
      mode: 'c2e',
      roundSize: 5,
      selectedCategory: 'all',
      autoPlaySound: false,
      soundEnabled: false,
      completedDailyTaskKinds: ['review'],
    }),
  );
}

describe('App task flow integration', () => {
  beforeEach(() => {
    localStorage.clear();
    seedProgressState();
    seedSettingsState();
  });

  it('shows compressed home summary and next task based on persisted state', () => {
    render(<App />);

    expect(screen.getByText(/今天先完成一件最重要的事/)).toBeInTheDocument();
    expect(screen.getByText('今日进度')).toBeInTheDocument();
    expect(screen.getByText(/下一步建议/)).toBeInTheDocument();
  });

  it('can reset daily tasks from home', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '重置任务' }));
    expect(screen.getAllByRole('button', { name: '开始' }).length).toBeGreaterThan(0);
  });

  it('opens topic area with recommended category context when user has not chosen a specific category', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /主题学习/ }));
    expect(screen.getByText('今日推荐主题')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '开始这个主题' })).toBeInTheDocument();
  });

  it('opens sentence practice flow from topics', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /主题学习/ }));
    fireEvent.click(screen.getByRole('button', { name: '进入句式练习' }));
    expect(screen.getByText('先学小句子')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /This is/ }));
    expect(screen.getByText(/第 1 \/ 3 题/)).toBeInTheDocument();
  });
});
