import type { CSSProperties } from 'react';
import { allWords } from '../../data/words';

interface RoundSummaryProps {
  correctCount: number;
  roundTotal: number;
  stars: number;
  wrongWordIds: number[];
  onRestart: () => void;
  onRetryWrong: () => void;
}

export function RoundSummary({ correctCount, roundTotal, stars, wrongWordIds, onRestart, onRetryWrong }: RoundSummaryProps) {
  const wrongWords = wrongWordIds
    .map((id) => allWords.find((word) => word.id === id))
    .filter(Boolean);

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>本轮完成啦 🎉</h1>
      <p style={styles.text}>答对 {correctCount} / {roundTotal} 题</p>
      <p style={styles.text}>获得星星：⭐ {stars}</p>
      {wrongWords.length > 0 ? (
        <div style={styles.listWrap}>
          <h3>需要再练练</h3>
          <ul>
            {wrongWords.map((word) => (
              <li key={word!.id}>{word!.chinese} - {word!.english}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={styles.text}>太棒了，这轮全对！</p>
      )}
      <div style={styles.actions}>
        <button style={styles.primary} onClick={onRestart}>再来一轮</button>
        {wrongWordIds.length > 0 ? <button style={styles.secondary} onClick={onRetryWrong}>复习错题</button> : null}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: '#fff',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
  },
  title: { marginTop: 0, fontSize: 30 },
  text: { fontSize: 18, margin: '10px 0' },
  listWrap: { marginTop: 20, fontSize: 16 },
  actions: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 },
  primary: {
    minHeight: 52, padding: '0 18px', border: 'none', borderRadius: 16, background: '#ff6b6b', color: '#fff', fontWeight: 800,
  },
  secondary: {
    minHeight: 52, padding: '0 18px', border: 'none', borderRadius: 16, background: '#4ecdc4', color: '#fff', fontWeight: 800,
  },
};
