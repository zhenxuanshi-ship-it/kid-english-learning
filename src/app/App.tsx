import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { HomePage } from '../pages/HomePage';
import { LearnPage } from '../pages/LearnPage';
import { RoundSummary } from '../components/summary/RoundSummary';
import { useProgressStore } from '../store/progressStore';
import { useGameStore } from '../store/gameStore';
import type { GameMode } from '../types/question';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'learn' | 'summary'>('home');
  const totalStars = useProgressStore((state) => state.totalStars);
  const currentMode = useProgressStore((state) => state.currentMode);
  const hydrate = useProgressStore((state) => state.hydrate);
  const setMode = useProgressStore((state) => state.setMode);
  const game = useGameStore();
  const [usedLetterIndexes, setUsedLetterIndexes] = useState<number[]>([]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!game.currentQuestion && screen === 'learn' && game.roundWordIds.length > 0) {
      setScreen('summary');
      setUsedLetterIndexes([]);
    }
  }, [game.currentQuestion, game.roundWordIds.length, screen]);

  useEffect(() => {
    if (screen === 'learn' && !game.result && !game.showAnswer && game.userInput.length === 0 && game.attemptCount > 0) {
      setUsedLetterIndexes([]);
    }
  }, [game.attemptCount, game.result, game.showAnswer, game.userInput.length, screen]);

  const correctCount = useMemo(
    () => game.completedWordIds.length - game.wrongWordIds.length + (game.result === 'correct' ? 1 : 0),
    [game.completedWordIds.length, game.result, game.wrongWordIds.length],
  );

  const handleStart = () => {
    game.startRound(currentMode);
    setUsedLetterIndexes([]);
    setScreen('learn');
  };

  const handleRetryWrong = () => {
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
        {screen === 'home' ? (
          <HomePage
            mode={currentMode}
            totalStars={totalStars}
            onModeChange={(mode: GameMode) => setMode(mode)}
            onStart={handleStart}
          />
        ) : null}

        {screen === 'learn' ? (
          <LearnPage
            state={game}
            totalStars={totalStars}
            disabledLetterIndexes={usedLetterIndexes}
            onPickLetter={handlePickLetter}
            onDelete={handleDelete}
            onSelectOption={game.selectOption}
            onShowAnswer={game.showCorrectAnswer}
            onNext={handleNext}
          />
        ) : null}

        {screen === 'summary' ? (
          <RoundSummary
            correctCount={Math.max(0, correctCount)}
            roundTotal={game.roundTotal}
            stars={game.stars}
            wrongWordIds={game.wrongWordIds}
            onRestart={() => {
              game.resetRound();
              setScreen('home');
            }}
            onRetryWrong={handleRetryWrong}
          />
        ) : null}
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
