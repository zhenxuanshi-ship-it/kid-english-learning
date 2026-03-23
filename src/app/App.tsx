import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { loadVoices } from '../lib/audio';
import { supabase } from '../lib/supabase/client';
import { BottomNav, type NavTab } from '../components/common/BottomNav';
import { AuthPage } from '../pages/AuthPage';
import { HomePage } from '../pages/HomePage';
import { LearnPage } from '../pages/LearnPage';
import { RoundSummary } from '../components/summary/RoundSummary';
import { ProfilePage } from '../pages/ProfilePage';
import { ReviewPage } from '../pages/ReviewPage';
import { TopicsPage } from '../pages/TopicsPage';
import { SentenceHubPage } from '../pages/SentenceHubPage';
import { SentenceLearnPage } from '../pages/SentenceLearnPage';
import { SentenceSummaryPage } from '../pages/SentenceSummaryPage';
import { SentencePatternCardPage } from '../pages/SentencePatternCardPage';
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
import { getSentenceLinkedWords, getSentencePattern } from '../lib/sentencePractice';
import { getHomeSentenceSpotlight, getSentenceRecommendation, getSummarySentenceSpotlight, getTopicSentenceSpotlight } from '../lib/sentenceRecommendation';
import { ensurePersistentStorage, type StorageDiagnostics } from '../lib/runtime';
import { getSentencePatternIdsForCategory } from '../lib/sentenceCategoryLink';
import { useSentenceGameStore } from '../store/sentenceGameStore';
import { useSentenceProgressStore } from '../store/sentenceProgressStore';
import { sentencePatterns } from '../data/sentences';
import type { SentencePatternId } from '../types/sentence';
import type { GameMode } from '../types/question';

export default function App() {
  // Pre-load TTS voices on app start so first pronunciation has no delay
  useEffect(() => {
    void loadVoices();
  }, []);

  const [screen, setScreen] = useState<'home' | 'learn' | 'summary' | 'sentenceHub' | 'sentenceCard' | 'sentenceLearn' | 'sentenceSummary'>('home');
  const [navTab, setNavTab] = useState<NavTab>('home');
  const [completedTaskLabel, setCompletedTaskLabel] = useState<string | undefined>();
  const [completedTaskReward, setCompletedTaskReward] = useState<string | undefined>();
  const [newlyCompletedTaskKind, setNewlyCompletedTaskKind] = useState<string | undefined>();
  const [sentenceCorrectCount, setSentenceCorrectCount] = useState(0);
  const [pendingSentencePatternId, setPendingSentencePatternId] = useState<SentencePatternId | undefined>();
  const [storageDiagnostics, setStorageDiagnostics] = useState<StorageDiagnostics>({
    localStorageAvailable: true,
    persistenceSupported: false,
    persistenceGranted: false,
  });
  const totalStars = useProgressStore((state) => state.totalStars);
  const currentMode = useProgressStore((state) => state.currentMode);
  const wordProgressMap = useProgressStore((state) => state.wordProgressMap);
  const hydrate = useProgressStore((state) => state.hydrate);
  const setMode = useProgressStore((state) => state.setMode);
  const game = useGameStore();
  const sentenceGame = useSentenceGameStore();
  const sentenceProgressMap = useSentenceProgressStore((state) => state.progressMap);
  const hydrateSentenceProgress = useSentenceProgressStore((state) => state.hydrate);
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setAuthLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    hydrate();
    hydrateSettings();
    hydrateSentenceProgress();
    ensurePersistentStorage().then(setStorageDiagnostics).catch(() => {
      setStorageDiagnostics({
        localStorageAvailable: false,
        persistenceSupported: false,
        persistenceGranted: false,
      });
    });
  }, [hydrate, hydrateSettings, hydrateSentenceProgress]);

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
  const currentSentencePattern = useMemo(
    () => (sentenceGame.currentPatternId ? getSentencePattern(sentenceGame.currentPatternId) : undefined),
    [sentenceGame.currentPatternId],
  );
  const pendingSentencePattern = useMemo(
    () => (pendingSentencePatternId ? getSentencePattern(pendingSentencePatternId) : undefined),
    [pendingSentencePatternId],
  );
  const sentencePreferredPatternIds = useMemo(() => {
    const homeCategory = recommendation.suggestedCategory;
    const topicCategory = selectedCategory === 'all' ? recommendation.suggestedCategory : selectedCategory;
    const preferred = new Set<SentencePatternId>([
      ...getSentencePatternIdsForCategory(homeCategory),
      ...getSentencePatternIdsForCategory(topicCategory),
    ]);
    return [...preferred];
  }, [recommendation.suggestedCategory, selectedCategory]);
  const sentenceRecommendation = useMemo(
    () => getSentenceRecommendation(sentenceProgressMap, sentencePreferredPatternIds),
    [sentencePreferredPatternIds, sentenceProgressMap],
  );
  const homeSentenceSpotlight = useMemo(
    () => getHomeSentenceSpotlight(sentenceProgressMap, sentencePreferredPatternIds),
    [sentencePreferredPatternIds, sentenceProgressMap],
  );
  const topicSentenceSpotlight = useMemo(
    () => getTopicSentenceSpotlight(sentenceProgressMap, sentencePreferredPatternIds),
    [sentencePreferredPatternIds, sentenceProgressMap],
  );
  const nextSentencePattern = useMemo(() => {
    if (!sentenceGame.currentPatternId) return undefined;
    const currentIndex = sentencePatterns.findIndex((pattern) => pattern.id === sentenceGame.currentPatternId);
    return currentIndex >= 0 ? sentencePatterns[currentIndex + 1] : undefined;
  }, [sentenceGame.currentPatternId]);
  const currentSentenceLinkedWords = useMemo(
    () => (sentenceGame.currentExercise ? getSentenceLinkedWords(sentenceGame.currentExercise) : []),
    [sentenceGame.currentExercise],
  );
  const summarySentenceSuggestion = useMemo(
    () => getSummarySentenceSpotlight(sentenceProgressMap, sentencePreferredPatternIds),
    [sentencePreferredPatternIds, sentenceProgressMap],
  );
  const sentenceStageSummary = useMemo(() => {
    const summary = { new: 0, learning: 0, review: 0, mastered: 0 };
    sentencePatterns.forEach((pattern) => {
      const stage = sentenceProgressMap[pattern.id]?.stage ?? 'new';
      summary[stage] += 1;
    });
    return summary;
  }, [sentenceProgressMap]);

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

  const handleStartTopic = (category: string) => {
    setCompletedTaskLabel(undefined);
    setCompletedTaskReward(undefined);
    setNewlyCompletedTaskKind(undefined);
    setActiveDailyTask(undefined);
    setSelectedCategory(category);
    const startMode = recommendation.suggestedMode ?? currentMode;
    setMode(startMode);
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

  const handleOpenSentencePractice = () => {
    sentenceGame.reset();
    setSentenceCorrectCount(0);
    setPendingSentencePatternId(undefined);
    setScreen('sentenceHub');
  };

  const handleStartSentencePattern = (patternId: SentencePatternId) => {
    setPendingSentencePatternId(patternId);
    setScreen('sentenceCard');
  };

  const handleStartSentenceRound = () => {
    if (!pendingSentencePatternId) return;
    sentenceGame.startRound(pendingSentencePatternId);
    setSentenceCorrectCount(0);
    setScreen('sentenceLearn');
  };

  const handleSentenceAnswer = (answer: string) => {
    const before = sentenceGame.isCorrect;
    sentenceGame.selectAnswer(answer);
    const after = useSentenceGameStore.getState().isCorrect;
    if (after && !before) {
      setSentenceCorrectCount((count) => count + 1);
    }
  };

  const handleSentenceArrange = (tokens: string[]) => {
    const before = sentenceGame.isCorrect;
    sentenceGame.arrangeTokens(tokens);
    const after = useSentenceGameStore.getState().isCorrect;
    if (after && !before) {
      setSentenceCorrectCount((count) => count + 1);
    }
  };

  const handleSentenceNext = () => {
    sentenceGame.nextExercise();
    if (useSentenceGameStore.getState().completed) {
      setScreen('sentenceSummary');
    }
  };

  const handleGoHome = () => {
    game.resetRound();
    sentenceGame.reset();
    setPendingSentencePatternId(undefined);
    setScreen('home');
    setNavTab('home');
  };

  const handleGoTopics = () => {
    game.resetRound();
    sentenceGame.reset();
    setPendingSentencePatternId(undefined);
    setScreen('home');
    setNavTab('topics');
  };

  const handleGoReview = () => {
    game.resetRound();
    sentenceGame.reset();
    setPendingSentencePatternId(undefined);
    setScreen('home');
    setNavTab('review');
  };

  const handleGoNextTask = () => {
    const nextTask = dailyPlan.tasks.find((task) => !completedDailyTaskKinds.includes(task.kind));
    if (!nextTask) {
      handleGoHome();
      return;
    }
    handleStartTask(nextTask);
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
        {authLoading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#718096' }}>加载中...</div>
        ) : !isAuthenticated ? (
          <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />
        ) : (
          <>
            {screen === 'home' && navTab === 'home' ? (
          <HomePage
            mode={currentMode}
            totalStars={totalStars}
            categoryItems={categoryItems}
            onModeChange={(mode: GameMode) => setMode(mode)}
            onStart={handleStart}
            onOpenTopics={() => setNavTab('topics')}
            onOpenReview={() => setNavTab('review')}
            onOpenSentencePractice={handleOpenSentencePractice}
            stats={stats}
            recommendation={recommendation}
            dailyPlan={dailyPlan}
            dailySummary={dailySummary}
            nextTaskRecommendation={nextTaskRecommendation}
            sentenceRecommendedPattern={homeSentenceSpotlight}
            sentenceContinuePattern={sentenceRecommendation.continuePattern}
            sentenceStageSummary={sentenceStageSummary}
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
            sentenceRecommendedPattern={topicSentenceSpotlight}
            onSelectCategory={setSelectedCategory}
            onStartTopic={handleStartTopic}
            onOpenSentencePractice={handleOpenSentencePractice}
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
            storageDiagnostics={storageDiagnostics}
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

        {screen === 'sentenceHub' ? (
          <SentenceHubPage
            progressMap={sentenceProgressMap}
            orderedPatterns={sentenceRecommendation.orderedPatterns}
            recommendedPattern={sentenceRecommendation.recommendedPattern}
            continuePattern={sentenceRecommendation.continuePattern}
            reviewPattern={sentenceRecommendation.reviewPattern}
            reviewCount={sentenceRecommendation.reviewCount}
            onStartPattern={handleStartSentencePattern}
          />
        ) : null}

        {screen === 'sentenceCard' ? (
          <SentencePatternCardPage
            pattern={pendingSentencePattern}
            onStart={handleStartSentenceRound}
            onBack={handleOpenSentencePractice}
          />
        ) : null}

        {screen === 'sentenceLearn' ? (
          <SentenceLearnPage
            exercise={sentenceGame.currentExercise}
            roundIndex={sentenceGame.roundIndex}
            roundTotal={sentenceGame.round.length}
            selectedAnswer={sentenceGame.selectedAnswer}
            arrangedTokens={sentenceGame.arrangedTokens}
            linkedWords={currentSentenceLinkedWords}
            soundEnabled={soundEnabled}
            isCorrect={sentenceGame.isCorrect}
            onSelectAnswer={handleSentenceAnswer}
            onArrangeTokens={handleSentenceArrange}
            onUndoArrange={sentenceGame.undoArrangeToken}
            onNext={handleSentenceNext}
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
            nextTaskLabel={nextTaskRecommendation.nextLabel}
            sentencePatternSuggestion={summarySentenceSuggestion}
            onRestart={() => {
              setCompletedTaskLabel(undefined);
              setCompletedTaskReward(undefined);
              setNewlyCompletedTaskKind(undefined);
              game.resetRound();
              setScreen('home');
            }}
            onRetryWrong={handleRetryWrong}
            onGoHome={handleGoHome}
            onGoTopics={handleGoTopics}
            onGoReview={handleGoReview}
            onGoNextTask={nextTaskRecommendation.nextLabel ? handleGoNextTask : undefined}
            onGoSentencePractice={summarySentenceSuggestion ? () => handleStartSentencePattern(summarySentenceSuggestion.id) : undefined}
            stats={stats}
          />
        ) : null}

        {screen === 'sentenceSummary' ? (
          <SentenceSummaryPage
            pattern={currentSentencePattern}
            correctCount={sentenceCorrectCount}
            roundTotal={sentenceGame.round.length}
            stage={currentSentencePattern?.id ? sentenceProgressMap[currentSentencePattern.id]?.stage : undefined}
            nextPatternTitle={nextSentencePattern?.title}
            onRestart={() => currentSentencePattern?.id ? handleStartSentencePattern(currentSentencePattern.id) : handleOpenSentencePractice()}
            onGoReviewPattern={currentSentencePattern?.id ? () => handleStartSentencePattern(currentSentencePattern.id) : undefined}
            onGoNextPattern={nextSentencePattern ? () => handleStartSentencePattern(nextSentencePattern.id) : undefined}
            onGoTopics={handleGoTopics}
          />
        ) : null}

        {screen === 'home' ? <BottomNav current={navTab} onChange={setNavTab} /> : null}
          </>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 12,
    paddingBottom: 80,
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
    maxWidth: 520,
    display: 'grid',
    gap: 12,
    overflowY: 'auto',
    paddingBottom: 8,
  },
};
