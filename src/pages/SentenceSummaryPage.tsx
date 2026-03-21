import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { SentencePattern } from '../types/sentence';

interface SentenceSummaryPageProps {
  pattern?: SentencePattern;
  correctCount: number;
  roundTotal: number;
  onRestart: () => void;
  onGoTopics: () => void;
}

export function SentenceSummaryPage({ pattern, correctCount, roundTotal, onRestart, onGoTopics }: SentenceSummaryPageProps) {
  return (
    <motion.div style={styles.card} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.hero}>🧩</div>
      <div style={styles.title}>小句子练完啦</div>
      <div style={styles.subtitle}>这次练的是：{pattern?.title ?? '句式练习'}</div>
      <div style={styles.score}>{correctCount} / {roundTotal} 题答对</div>
      <div style={styles.examples}>例句：{pattern?.examples.join(' / ')}</div>
      <div style={styles.actions}>
        <button style={styles.primary} onClick={onRestart}>再练一轮</button>
        <button style={styles.secondary} onClick={onGoTopics}>回主题页</button>
      </div>
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: 'linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)',
    borderRadius: 24,
    padding: 20,
    display: 'grid',
    gap: 10,
    boxShadow: '0 14px 28px rgba(124, 92, 255, 0.10)',
    textAlign: 'center',
  },
  hero: { fontSize: 42 },
  title: { fontSize: 28, fontWeight: 900 },
  subtitle: { fontSize: 15, fontWeight: 800, color: '#66757b' },
  score: { fontSize: 18, fontWeight: 900, color: '#7c5cff' },
  examples: { fontSize: 14, fontWeight: 700, color: '#66757b' },
  actions: { display: 'grid', gap: 10, marginTop: 6 },
  primary: {
    minHeight: 50,
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #7c5cff, #9b83ff)',
    color: '#fff',
    fontWeight: 900,
  },
  secondary: {
    minHeight: 46,
    border: '1px solid #ece8ff',
    borderRadius: 16,
    background: '#fff',
    color: '#5a4bcc',
    fontWeight: 800,
  },
};
