import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ReviewQueueCard } from '../components/common/ReviewQueueCard';
import type { ReviewWordItem } from '../lib/review';

interface ReviewPageProps {
  items: ReviewWordItem[];
  onStartReview: () => void;
}

export function ReviewPage({ items, onStartReview }: ReviewPageProps) {
  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.hero}>
        <div style={styles.title}>复习中心</div>
        <div style={styles.desc}>先把容易忘记的词再练一练，今天会更稳。</div>
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
    gap: 8,
    boxShadow: '0 16px 30px rgba(255,118,117,0.12)',
  },
  title: { fontSize: 28, fontWeight: 900 },
  desc: { fontSize: 15, fontWeight: 700, color: '#6b7a80' },
  primary: {
    marginTop: 6,
    minHeight: 52,
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #ff7675, #ff9f8e)',
    color: '#fff',
    fontWeight: 900,
    fontSize: 18,
  },
};
