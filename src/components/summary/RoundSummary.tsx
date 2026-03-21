import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div style={styles.card} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.hero}>🎉</div>
      <h1 style={styles.title}>本轮完成啦</h1>
      <div style={styles.scoreRow}>
        <div style={styles.scoreBubble}><strong>{correctCount}</strong><span>答对题数</span></div>
        <div style={{ ...styles.scoreBubble, ...styles.starBubble }}><strong>⭐ {stars}</strong><span>本轮星星</span></div>
      </div>
      {wrongWords.length > 0 ? (
        <div style={styles.listWrap}>
          <h3 style={styles.listTitle}>这些单词可以再练一练</h3>
          <div style={styles.wordList}>
            {wrongWords.map((word) => (
              <div key={word!.id} style={styles.wordItem}>{word!.chinese} · {word!.english}</div>
            ))}
          </div>
        </div>
      ) : (
        <p style={styles.text}>太棒了，这轮全对！你已经把这 5 题都拿下啦 ✨</p>
      )}
      <div style={styles.footer}>本轮一共 {roundTotal} 题，慢慢学也很厉害。</div>
      <div style={styles.actions}>
        <button style={styles.primary} onClick={onRestart}>再来一轮</button>
        {wrongWordIds.length > 0 ? <button style={styles.secondary} onClick={onRetryWrong}>复习错题</button> : null}
      </div>
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: 'linear-gradient(180deg, #ffffff 0%, #fffaf5 100%)',
    borderRadius: 28,
    padding: 24,
    boxShadow: '0 18px 40px rgba(255, 107, 107, 0.12)',
  },
  hero: { fontSize: 48, textAlign: 'center' },
  title: { marginTop: 6, marginBottom: 16, fontSize: 32, textAlign: 'center' },
  scoreRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  scoreBubble: {
    borderRadius: 22,
    padding: 16,
    background: '#f7f9fc',
    display: 'grid',
    gap: 6,
    textAlign: 'center',
  },
  starBubble: {
    background: '#fff3bd',
    color: '#7d5a00',
  },
  listWrap: { marginTop: 20, fontSize: 16 },
  listTitle: { marginBottom: 12 },
  wordList: { display: 'grid', gap: 10 },
  wordItem: {
    padding: '12px 14px',
    borderRadius: 16,
    background: '#ffffff',
    boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
    fontWeight: 700,
  },
  text: { fontSize: 18, margin: '18px 0 8px', textAlign: 'center' },
  footer: { textAlign: 'center', color: '#7c8a90', marginTop: 16, fontWeight: 700 },
  actions: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 },
  primary: {
    flex: 1,
    minHeight: 56,
    padding: '0 18px',
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #ff6b6b, #ff8e7b)',
    color: '#fff',
    fontWeight: 900,
  },
  secondary: {
    flex: 1,
    minHeight: 56,
    padding: '0 18px',
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #4ecdc4, #73ddd3)',
    color: '#fff',
    fontWeight: 900,
  },
};
