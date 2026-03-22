import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { SentenceLearningStage, SentencePattern } from '../types/sentence';

interface SentenceSummaryPageProps {
  pattern?: SentencePattern;
  correctCount: number;
  roundTotal: number;
  stage?: SentenceLearningStage;
  nextPatternTitle?: string;
  onRestart: () => void;
  onGoTopics: () => void;
  onGoNextPattern?: () => void;
  onGoReviewPattern?: () => void;
}

export function SentenceSummaryPage({ pattern, correctCount, roundTotal, stage, nextPatternTitle, onRestart, onGoTopics, onGoNextPattern, onGoReviewPattern }: SentenceSummaryPageProps) {
  return (
    <motion.div style={styles.card} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.hero}>🧩</div>
      <div style={styles.title}>小句子练完啦</div>
      <div style={styles.subtitle}>这次练的是：{pattern?.title ?? '句式练习'}</div>
      <div style={styles.score}>{correctCount} / {roundTotal} 题答对</div>
      <div style={styles.examples}>例句：{pattern?.examples.join(' / ')}</div>
      {stage ? <div style={{ ...styles.stageTip, ...(stageStyles[stage] ?? {}) }}>{stageLabels[stage]}</div> : null}
      {nextPatternTitle ? <div style={styles.nextTip}>下一步推荐：继续练 {nextPatternTitle}</div> : null}
      <div style={styles.actions}>
        <button style={styles.primary} onClick={onRestart}>再练一轮</button>
        {stage === 'review' && onGoReviewPattern ? <button style={styles.reviewButton} onClick={onGoReviewPattern}>继续复习这个句型</button> : null}
        {onGoNextPattern && nextPatternTitle ? <button style={styles.secondary} onClick={onGoNextPattern}>去练 {nextPatternTitle}</button> : null}
        <button style={styles.secondary} onClick={onGoTopics}>回主题页</button>
      </div>
    </motion.div>
  );
}

const stageLabels: Record<SentenceLearningStage, string> = {
  new: '这是一个新句型，继续练一轮会更熟。',
  learning: '这个句型正在变熟，继续巩固一下。',
  review: '这个句型现在进入待复习阶段，建议优先回顾。',
  mastered: '太棒啦，这个句型已经掌握了！',
};

const stageStyles: Record<SentenceLearningStage, CSSProperties> = {
  new: { background: '#f2eeff', color: '#5a4bcc' },
  learning: { background: '#eef7ff', color: '#2b6cb0' },
  review: { background: '#fff4df', color: '#9a6500' },
  mastered: { background: '#e8fff7', color: '#157a6e' },
};

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
  stageTip: { fontSize: 14, fontWeight: 900, borderRadius: 14, padding: '10px 12px' },
  nextTip: { fontSize: 14, fontWeight: 900, color: '#7c5cff', background: '#f2eeff', borderRadius: 14, padding: '10px 12px' },
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
  reviewButton: {
    minHeight: 46,
    border: 'none',
    borderRadius: 16,
    background: '#ffb85c',
    color: '#5a3c00',
    fontWeight: 900,
  },
};
