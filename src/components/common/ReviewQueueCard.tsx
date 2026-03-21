import type { CSSProperties } from 'react';
import type { ReviewWordItem } from '../../lib/review';

interface ReviewQueueCardProps {
  items: ReviewWordItem[];
  onStartReview?: () => void;
}

export function ReviewQueueCard({ items, onStartReview }: ReviewQueueCardProps) {
  if (items.length === 0) {
    return (
      <div style={styles.card}>
        <div style={styles.title}>🧹 错题复习队列</div>
        <div style={styles.empty}>目前没有高优先错题，继续保持～</div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>🔁 错题复习队列</div>
        {onStartReview ? <button style={styles.action} onClick={onStartReview}>只练错题</button> : null}
      </div>
      <div style={styles.list}>
        {items.map((item, index) => (
          <div key={item.wordId} style={styles.row}>
            <div style={styles.rank}>{index + 1}</div>
            <div style={styles.main}>
              <div style={styles.wordLine}>{item.chinese} · {item.english}</div>
              <div style={styles.meta}>错 {item.wrongCount} 次 · 当前阶段 {item.learningStage}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: '#fff',
    borderRadius: 24,
    padding: 18,
    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
    display: 'grid',
    gap: 14,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  title: { fontWeight: 900, fontSize: 18 },
  action: {
    minHeight: 38,
    padding: '0 12px',
    border: 'none',
    borderRadius: 999,
    background: '#ff7675',
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
  },
  empty: {
    background: '#f7f9fc',
    borderRadius: 18,
    padding: 16,
    color: '#6b7a80',
    fontWeight: 700,
  },
  list: { display: 'grid', gap: 10 },
  row: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    background: '#fff8f8',
    borderRadius: 18,
    padding: '12px 14px',
  },
  rank: {
    width: 30,
    height: 30,
    borderRadius: 999,
    background: '#ff7675',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 900,
    flexShrink: 0,
  },
  main: { display: 'grid', gap: 4 },
  wordLine: { fontWeight: 800 },
  meta: { color: '#7b8a90', fontSize: 13, fontWeight: 700 },
};
