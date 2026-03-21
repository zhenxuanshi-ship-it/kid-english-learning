import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { BottomNav, type NavTab } from '../components/common/BottomNav';
import { HomePage } from '../pages/HomePage';
import { LearnPage } from '../pages/LearnPage';
import { RoundSummary } from '../components/summary/RoundSummary';
import { ProfilePage } from '../pages/ProfilePage';
import { ReviewPage } from '../pages/ReviewPage';
import { TopicsPage } from '../pages/TopicsPage';
import { useProgressStore } from '../store/progressStore';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { allWords, wordCategories } from '../data/words';
import { buildCategoryGalleryItems } from '../lib/categoryGallery';
import { buildDailyPlan } from '../lib/dailyPlan';
import { buildDailySummary } from '../lib/dailySummary';
import { didCompleteDailyTask } from '../lib/dailyTaskProgress';
import { getNextTaskRecommendation } from '../lib/nextTask';
import { getHomeRecommendation } from '../lib/recommendation';
import { buildReviewQueue } from '../lib/review';
import { buildLearningStats } from '../lib/stats';
import type { GameMode } from '../types/question';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'learn' | 'summary'>('home');
  const [navTab, setNavTab] = useState<NavTab>('home');
  const [completedTaskLabel, setCompletedTaskLabel] = useState<string | undefined>();
  const [completedTaskReward, setCompletedTaskReward] = useState<string | undefined>();
  const [newlyCompletedTaskKind, setNewlyCompletedTaskKind] = useState<string | undefined>();
  const totalStars = useProgressStore((state) => state.totalStars);
  const currentMode = useProgressStore((state) => state.currentMode);
  const wordProgressMap = useProgressStore((state) => state.wordProgressMap);
  const hydrate = useProgressStore((state) => state.hydrate);
  const setMode = useProgressStore((state) => state.setMode);
  const game = useGameStore();
  const hydrateSettings = useSettingsStore((state) => state.hydrate);
  const roundSize = useSettingsStore((state) => state.roundSize);
  const selectedCategory = useSettingsStore((state) => state.selectedCategory);
  const autoPlaySound = useSettingsStore((state) => state.autoPlaySound);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const completedDailyTaskKinds = useSettingsStore((state) => state.completedDailyTaskKinds);
  const activeDailyTaskKind = useSettingsStore((state) => state.activeDailyTaskKind);
  const setRoundSize = useSettingsStore((state) => state.setRoundSize);
  const setSelectedCategory = useSettingsStore((state) => state.setSelectedCategory);
  const toggleAutoPlaySound = useSettingsStore((state) => state.toggleAutoPlaySound);
  const toggleSoundEnabled = useSettingsStore((state) => state.toggleSoundEnabled);
  const setActiveDailyTask = useSettingsStore((state) => state.setActiveDailyTask);
  const markDailyTaskDone = useSettingsStore((state) => state.markDailyTaskDone);
  const resetDailyTasks = useSettingsStore((state) => state.resetDailyTasks);
  const [usedLetterIndexes, setUsedLetterIndexes] = useState<number[]>([]);

  useEffect(() => {
    hydrate();
    hydrateSettings();
  }, [hydrate, hydrateSettings]);

  const correctCount = useMemo(
    () => game.completedWordIds.length - game.wrongWordIds.length + (game.result === 'correct' ? 1 : 0),
    [game.completedWordIds.length, game.result, game.wrongWordIds.length],
  );

  const stats = useMemo(() => buildLearningStats(allWords, wordProgressMap), [wordProgressMap]);
  const recommendation = useMemo(() => getHomeRecommendation(stats), [stats]);
  const dailyPlan = useMemo(() => buildDailyPlan(stats), [stats]);
  const categoryItems = useMemo(() => buildCategoryGalleryItems(wordCategories, stats), [stats]);

  useEffect(() => {
    if (!game.currentQuestion && !game.isLearningCard && screen === 'learn' && game.roundWordIds.length > 0) {
      if (activeDailyTaskKind) {
        const completedTask = dailyPlan.tasks.find((task) => task.kind === activeDailyTaskKind);
        if (didCompleteDailyTask(activeDailyTaskKind, game.completedWordIds, game.roundStartStages)) {
          markDailyTaskDone(activeDailyTaskKind);
          setCompletedTaskLabel(completedTask?.label);
          setCompletedTaskReward(`太棒啦！${completedTask?.label ?? '今日任务'}完成得很棒～`);
          setNewlyCompletedTaskKind(activeDailyTaskKind);
        } else {
          setActiveDailyTask(undefined);
          setCompletedTaskLabel(undefined);
          setCompletedTaskReward(undefined);
        }
      } else {
        setCompletedTaskLabel(undefined);
        setCompletedTaskReward(undefined);
      }
      setScreen('summary');
      setUsedLetterIndexes([]);
    }
  }, [
    activeDailyTaskKind,
    dailyPlan.tasks,
    game.completedWordIds,
    game.currentQuestion,
    game.isLearningCard,
    game.roundStartStages,
    game.roundWordIds.length,
    markDailyTaskDone,
    screen,
    setActiveDailyTask,
  ]);

  useEffect(() => {
    if (screen === 'learn' && !game.result && !game.showAnswer && game.userInput.length === 0 && game.attemptCount > 0) {
      setUsedLetterIndexes([]);
    }
  }, [game.attemptCount, game.result, game.showAnswer, game.userInput.length, screen]);
  const dailySummary = useMemo(() => buildDailySummary(completedDailyTaskKinds, stats), [completedDailyTaskKinds, stats]);
  const nextTaskRecommendation = useMemo(
    () => getNextTaskRecommendation(dailyPlan, completedDailyTaskKinds),
    [completedDailyTaskKinds, dailyPlan],
  );
  const reviewQueue = useMemo(() => buildReviewQueue(allWords, wordProgressMap).slice(0, 5), [wordProgressMap]);

  const handleStart = (useRecommendationCategory = false) => {
    setCompletedTaskLabel(undefined);
    setCompletedTaskReward(undefined);
    setNewlyCompletedTaskKind(undefined);
    setActiveDailyTask(undefined);
    let startMode = currentMode;
    if (useRecommendationCategory && recommendation.suggestedCategory) {
      setSelectedCategory(recommendation.suggestedCategory);
    }
    if (recommendation.suggestedMode) {
      setMode(recommendation.suggestedMode);
      startMode = recommendation.suggestedMode;
    }
    game.startRound(startMode);
    setUsedLetterIndexes([]);
    setScreen('learn');
  };

  const handleStartReview = () => {
    setCompletedTaskLabel(undefined);
    setCompletedTaskReward(undefined);
    setNewlyCompletedTaskKind(undefined);
    setActiveDailyTask(undefined);
    const reviewWordIds = reviewQueue.map((item) => item.wordId);
    if (reviewWordIds.length === 0) return;
    game.startRound(currentMode, reviewWordIds);
    setUsedLetterIndexes([]);
    setScreen('learn');
  };

  const handleStartTask = (task: { mode: GameMode; kind: 'new' | 'review' | 'practice' }) => {
    setCompletedTaskLabel(undefined);
    setCompletedTaskReward(undefined);
    setNewlyCompletedTaskKind(undefined);
    setMode(task.mode);
    setActiveDailyTask(task.kind);
    game.startRound(task.mode);
    setUsedLetterIndexes([]);
    setScreen('learn');
  };

  const handleRetryWrong = () => {
    setCompletedTaskLabel(undefined);
    setCompletedTaskReward(undefined);
    setNewlyCompletedTaskKind(undefined);
    setActiveDailyTask(undefined);
    game.startRound(currentMode, game.wrongWordIds);
    setUsedLetterIndexes([]);
    setScreen('learn');
  };

  const handlePickLetter = (letter: string, index: number) => {
    game.inputLetter(letter);
    setUsedLetterIndexes((prev) => [...prev, index]);
  };

  const handleDelete = () => {
    setUsedLetterIndexes((prev) => prev.slice(0, -1));
    game.removeLastLetter();
  };

  const handleNext = () => {
    game.nextQuestion();
    setUsedLetterIndexes([]);
  };

  return (
    <main style={styles.page}>
      <div style={styles.bgBlobA} />
      <div style={styles.bgBlobB} />
      <div style={styles.shell}>
        {screen === 'home' && navTab === 'home' ? (
          <HomePage
            mode={currentMode}
            totalStars={totalStars}
            categoryItems={categoryItems}
            onModeChange={(mode: GameMode) => setMode(mode)}
            onStart={handleStart}
            onOpenTopics={() => setNavTab('topics')}
            onOpenReview={() => setNavTab('review')}
            stats={stats}
            recommendation={recommendation}
            dailyPlan={dailyPlan}
            dailySummary={dailySummary}
            nextTaskRecommendation={nextTaskRecommendation}
            completedDailyTaskKinds={completedDailyTaskKinds}
            newlyCompletedTaskKind={newlyCompletedTaskKind}
            onStartTask={handleStartTask}
            onResetDailyTasks={resetDailyTasks}
          />
        ) : null}

        {screen === 'home' && navTab === 'topics' ? (
          <TopicsPage
            items={categoryItems}
            selectedCategory={selectedCategory === 'all' ? recommendation.suggestedCategory ?? categoryItems[0]?.category ?? 'animals' : selectedCategory}
            onSelectCategory={setSelectedCategory}
            onStartTopic={() => handleStart(false)}
          />
        ) : null}

        {screen === 'home' && navTab === 'review' ? (
          <ReviewPage items={reviewQueue} onStartReview={handleStartReview} />
        ) : null}

        {screen === 'home' && navTab === 'profile' ? (
          <ProfilePage
            stats={stats}
            roundSize={roundSize}
            selectedCategory={selectedCategory}
            categories={wordCategories}
            autoPlaySound={autoPlaySound}
            soundEnabled={soundEnabled}
            onRoundSizeChange={setRoundSize}
            onCategoryChange={setSelectedCategory}
            onToggleAutoPlaySound={toggleAutoPlaySound}
            onToggleSoundEnabled={toggleSoundEnabled}
          />
        ) : null}

        {screen === 'learn' ? (
          <LearnPage
            state={game}
            totalStars={totalStars}
            disabledLetterIndexes={usedLetterIndexes}
            soundEnabled={soundEnabled}
            autoPlaySound={autoPlaySound}
            onPickLetter={handlePickLetter}
            onDelete={handleDelete}
            onSelectOption={game.selectOption}
            onShowAnswer={game.showCorrectAnswer}
            onNext={handleNext}
            onStartPractice={game.startPractice}
          />
        ) : null}

        {screen === 'summary' ? (
          <RoundSummary
            correctCount={Math.max(0, correctCount)}
            roundTotal={game.roundTotal}
            stars={game.stars}
            wrongWordIds={game.wrongWordIds}
            completedTaskLabel={completedTaskLabel}
            completedTaskReward={completedTaskReward}
            onRestart={() => {
              setCompletedTaskLabel(undefined);
              setCompletedTaskReward(undefined);
              setNewlyCompletedTaskKind(undefined);
              game.resetRound();
              setScreen('home');
            }}
            onRetryWrong={handleRetryWrong}
            stats={stats}
          />
        ) : null}

        {screen === 'home' ? <BottomNav current={navTab} onChange={setNavTab} /> : null}
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  bgBlobA: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: '50%',
    background: 'rgba(255, 107, 107, 0.14)',
    top: -40,
    left: -60,
    filter: 'blur(8px)',
  },
  bgBlobB: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: '50%',
    background: 'rgba(78, 205, 196, 0.16)',
    bottom: -60,
    right: -80,
    filter: 'blur(8px)',
  },
  shell: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: 560,
    display: 'grid',
    gap: 16,
  },
};
