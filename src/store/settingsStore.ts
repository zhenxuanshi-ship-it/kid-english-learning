import { create } from 'zustand';
import type { DailyTaskKind } from '../lib/dailyTaskProgress';
import { readJson, writeJson } from '../lib/storage';
import { wordCategories } from '../data/words';

const STORAGE_KEY = 'kids-english-settings';

export interface SettingsState {
  roundSize: number;
  selectedCategory: string;
  autoPlaySound: boolean;
  soundEnabled: boolean;
  completedDailyTaskKinds: DailyTaskKind[];
  activeDailyTaskKind?: DailyTaskKind;
}

interface SettingsStore extends SettingsState {
  hydrate: () => void;
  setRoundSize: (size: number) => void;
  setSelectedCategory: (category: string) => void;
  toggleAutoPlaySound: () => void;
  toggleSoundEnabled: () => void;
  setActiveDailyTask: (kind?: DailyTaskKind) => void;
  markDailyTaskDone: (kind: DailyTaskKind) => void;
  resetDailyTasks: () => void;
}

const initialState: SettingsState = {
  roundSize: 5,
  selectedCategory: 'all',
  autoPlaySound: false,
  soundEnabled: false,
  completedDailyTaskKinds: [],
  activeDailyTaskKind: undefined,
};

function persist(state: SettingsState) {
  writeJson(STORAGE_KEY, state);
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...initialState,
  hydrate: () => {
    const data = readJson<SettingsState>(STORAGE_KEY, initialState);
    const safeCategory = data.selectedCategory === 'all' || wordCategories.includes(data.selectedCategory)
      ? data.selectedCategory
      : 'all';
    set({
      ...data,
      selectedCategory: safeCategory,
      completedDailyTaskKinds: data.completedDailyTaskKinds ?? [],
      activeDailyTaskKind: data.activeDailyTaskKind,
    });
  },
  setRoundSize: (size) => {
    const next = { ...get(), roundSize: size };
    set({ roundSize: size });
    persist(next);
  },
  setSelectedCategory: (category) => {
    const next = { ...get(), selectedCategory: category };
    set({ selectedCategory: category });
    persist(next);
  },
  toggleAutoPlaySound: () => {
    const next = { ...get(), autoPlaySound: !get().autoPlaySound };
    set({ autoPlaySound: next.autoPlaySound });
    persist(next);
  },
  toggleSoundEnabled: () => {
    const next = { ...get(), soundEnabled: !get().soundEnabled };
    set({ soundEnabled: next.soundEnabled });
    persist(next);
  },
  setActiveDailyTask: (kind) => {
    const next = { ...get(), activeDailyTaskKind: kind };
    set({ activeDailyTaskKind: kind });
    persist(next);
  },
  markDailyTaskDone: (kind) => {
    const completedDailyTaskKinds = Array.from(new Set([...get().completedDailyTaskKinds, kind]));
    const next = { ...get(), completedDailyTaskKinds, activeDailyTaskKind: undefined };
    set({ completedDailyTaskKinds, activeDailyTaskKind: undefined });
    persist(next);
  },
  resetDailyTasks: () => {
    const next = { ...get(), completedDailyTaskKinds: [], activeDailyTaskKind: undefined };
    set({ completedDailyTaskKinds: [], activeDailyTaskKind: undefined });
    persist(next);
  },
}));
