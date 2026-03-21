import { beforeEach, describe, expect, it } from 'vitest';
import { useSettingsStore } from './settingsStore';

describe('settingsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState({
      roundSize: 5,
      selectedCategory: 'all',
      autoPlaySound: false,
      soundEnabled: false,
      completedDailyTaskKinds: [],
      activeDailyTaskKind: undefined,
    });
  });

  it('sets and clears active daily task', () => {
    useSettingsStore.getState().setActiveDailyTask('review');
    expect(useSettingsStore.getState().activeDailyTaskKind).toBe('review');

    useSettingsStore.getState().setActiveDailyTask(undefined);
    expect(useSettingsStore.getState().activeDailyTaskKind).toBeUndefined();
  });

  it('marks daily task done and clears active task', () => {
    useSettingsStore.getState().setActiveDailyTask('new');
    useSettingsStore.getState().markDailyTaskDone('new');

    expect(useSettingsStore.getState().completedDailyTaskKinds).toContain('new');
    expect(useSettingsStore.getState().activeDailyTaskKind).toBeUndefined();
  });
});
