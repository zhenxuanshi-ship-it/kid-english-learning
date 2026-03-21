import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { allWords } from '../../data/words';
import { StatsPanel } from '../common/StatsPanel';
import type { LearningStats } from '../../lib/stats';

interface RoundSummaryProps {
  correctCount: number;
  roundTotal: number;
  stars: number;
  wrongWordIds: number[];
  completedTaskLabel?: string;
  completedTaskReward?: string;
  onRestart: () => void;
  onRetryWrong: () => void;
  stats: LearningStats;
}

export function RoundSummary({ correctCount, roundTotal, stars, wrongWordIds, completedTaskLabel, completedTaskReward, onRestart, onRetryWrong, stats }: RoundSummaryProps) {
  const wrongWords = wrongWordIds
    .map((id) => allWords.find((word) => word.id === id))
    .filter(Boolean);

  return (
    <motion.div style={styles.card} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.hero}>🎉</div>
      <h1 style={styles.title}>本轮完成啦</h1>
      <div style={styles.scoreRow}>
        <motion.div style={styles.scoreBubble} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}><strong>{correctCount}</strong><span>答对题数</span></motion.div>
        <motion.div style={{ ...styles.scoreBubble, ...styles.starBubble }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}><strong>⭐ {stars}</strong><span>本轮星星</span></motion.div>
      </div>
      {completedTaskLabel ? (
        <motion.div style={styles.taskCelebrate} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div style={styles.confetti}>🎊 ✨ 🌟 ✨ 🎊</div>
          <div style={styles.taskBadge}>✅ 已推进今日任务：{completedTaskLabel}</div>
          <div style={styles.rewardCount}>+1 今日任务</div>
          <div style={styles.rewardText}>{completedTaskReward ?? '今日任务 +1，继续冲呀！'}</div>
        </motion.div>
      ) : null}
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
      <StatsPanel stats={stats} compact />
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
  taskCelebrate: {
    marginTop: 18,
    display: 'grid',
    gap: 8,
    justifyItems: 'center',
  },
  confetti: {
    fontSize: 22,
    letterSpacing: 4,
  },
  taskBadge: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 18,
    background: '#ecfff7',
    color: '#157a6e',
    fontWeight: 900,
    textAlign: 'center',
  },
  rewardCount: {
    padding: '6px 12px',
    borderRadius: 999,
    background: '#ffe8f2',
    color: '#d9487d',
    fontWeight: 900,
    fontSize: 13,
    textAlign: 'center',
  },
  rewardText: {
    color: '#ff8e7b',
    fontWeight: 900,
    fontSize: 15,
    textAlign: 'center',
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
