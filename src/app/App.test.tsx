import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

// Mock Supabase client in tests — simulate a logged-in session and empty children list
vi.mock('../lib/supabase/client', () => {
  const mockSession = { user: { id: 'test-id' } };
  const getSession = () => Promise.resolve({ data: { session: mockSession } });
  const onAuthStateChange = () => ({ data: { subscription: { unsubscribe: () => {} } } });
  const from = () => ({
    select: () => ({
      order: () => Promise.resolve({ data: [], error: null }),
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
  });
  return { supabase: { auth: { getSession, onAuthStateChange, getUser: () => Promise.resolve({ data: { user: mockSession.user } }) }, from } };
});

function seedProgressState() {
  localStorage.setItem(
    'kids-english-progress',
    JSON.stringify({
      totalStars: 8,
      words: {
        1: { wordId: 1, seenCount: 3, correctCount: 1, wrongCount: 2, lastMode: 'e2c', learningStage: 'review' },
        2: { wordId: 2, seenCount: 1, correctCount: 0, wrongCount: 0, lastMode: 'e2c', learningStage: 'new' },
        3: { wordId: 3, seenCount: 2, correctCount: 1, wrongCount: 0, lastMode: 'spell_blank', learningStage: 'learning' },
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

function seedSentenceProgressState() {
  localStorage.setItem(
    'kids-english-sentence-progress',
    JSON.stringify({
      i_like: { patternId: 'i_like', seenCount: 2, correctCount: 1, wrongCount: 2, mastered: false, stage: 'review', lastPracticedAt: 200 },
      this_is: { patternId: 'this_is', seenCount: 1, correctCount: 3, wrongCount: 0, mastered: true, stage: 'mastered', lastPracticedAt: 100 },
    }),
  );
}

describe('App task flow integration', () => {
  beforeEach(() => {
    localStorage.clear();
    seedProgressState();
    seedSettingsState();
    seedSentenceProgressState();
  });

  it('shows compressed home summary and next task based on persisted state', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/今天先完成一件最重要的事/)).toBeInTheDocument());
    expect(screen.getByText('今日进度')).toBeInTheDocument();
    expect(screen.getByText(/下一步建议/)).toBeInTheDocument();
  });

  it('can reset daily tasks from home', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByRole('button', { name: '重置任务' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: '重置任务' }));
    expect(screen.getAllByRole('button', { name: '开始' }).length).toBeGreaterThan(0);
  });

  it('opens topic area with recommended category context when user has not chosen a specific category', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByRole('button', { name: /主题学习/ })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /主题学习/ }));
    expect(screen.getByText('今日推荐主题')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '开始这个主题' })).toBeInTheDocument();
  });

  it('opens sentence practice flow from topics', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByRole('button', { name: /主题学习/ })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /主题学习/ }));
    fireEvent.click(screen.getByRole('button', { name: /去练推荐句型|去练主题相关句型|进入句式练习/ }));
    expect(screen.getByText('先学小句子')).toBeInTheDocument();
    expect(screen.getByText('继续上次句型')).toBeInTheDocument();
    expect(screen.getByText('句型复习入口')).toBeInTheDocument();
    expect(screen.getByText('推荐先练')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /I like/ }));
    expect(screen.getByText(/先认识这个句型/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '开始练这个句型' }));
    expect(screen.getByText(/第 1 \/ 3 题/)).toBeInTheDocument();
  });
});
