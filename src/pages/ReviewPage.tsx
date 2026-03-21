import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ReviewQueueCard } from '../components/common/ReviewQueueCard';
import { buildReviewSummary } from '../lib/reviewSummary';
import type { ReviewWordItem } from '../lib/review';

interface ReviewPageProps {
  items: ReviewWordItem[];
  onStartReview: () => void;
}

export function ReviewPage({ items, onStartReview }: ReviewPageProps) {
  const summary = buildReviewSummary(items);

  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.hero}>
        <div style={styles.kicker}>今日复习主线</div>
        <div style={styles.title}>复习中心</div>
        <div style={styles.desc}>{summary.message}</div>
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <strong>{summary.total}</strong>
            <span>待复习词</span>
          </div>
          <div style={styles.statCard}>
            <strong>{summary.highPriorityCount}</strong>
            <span>高优先</span>
          </div>
        </div>
        <div style={styles.nextWord}>推荐先复习：{summary.nextWordLabel ?? '今天先休息一下也可以～'}</div>
        <button style={styles.primary} onClick={onStartReview}>开始错题复习</button>
      </div>
      <ReviewQueueCard items={items} onStartReview={onStartReview} />
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 16 },
  hero: {
    background: 'linear-gradient(135deg, #fff8f8, #ffffff)',
    borderRadius: 28,
    padding: 20,
    display: 'grid',
    gap: 10,
    boxShadow: '0 16px 30px rgba(255,118,117,0.12)',
  },
  kicker: { fontSize: 13, fontWeight: 900, color: '#ff8e7b' },
  title: { fontSize: 28, fontWeight: 900 },
  desc: { fontSize: 15, fontWeight: 700, color: '#6b7a80' },
  statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  statCard: {
    background: '#fff',
    borderRadius: 18,
    padding: '12px 14px',
    display: 'grid',
    gap: 4,
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
  },
  nextWord: { fontSize: 13, fontWeight: 800, color: '#ff7675' },
  primary: {
    marginTop: 4,
    minHeight: 52,
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #ff7675, #ff9f8e)',
    color: '#fff',
    fontWeight: 900,
    fontSize: 18,
  },
};
