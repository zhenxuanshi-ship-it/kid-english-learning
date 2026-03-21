import type { CSSProperties } from 'react';
import type { DailySummary } from '../../lib/dailySummary';

interface DailySummaryCardProps {
  summary: DailySummary;
}

export function DailySummaryCard({ summary }: DailySummaryCardProps) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>✅ 今日完成总结</div>
      <div style={styles.message}>{summary.message}</div>
      <div style={styles.grid}>
        <div style={styles.item}>
          <strong>{summary.completedTaskCount}/{summary.totalTaskCount}</strong>
          <span>任务进度</span>
        </div>
        <div style={styles.item}>
          <strong>{summary.learnedWords}</strong>
          <span>累计已学词</span>
        </div>
        <div style={styles.item}>
          <strong>{summary.reviewWords}</strong>
          <span>待复习词</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: 'linear-gradient(135deg, #f5fff8, #ffffff)',
    borderRadius: 24,
    padding: 18,
    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
    display: 'grid',
    gap: 12,
  },
  title: { fontWeight: 900, fontSize: 18 },
  message: { color: '#5f6d73', fontWeight: 700, fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 },
  item: {
    background: '#fff',
    borderRadius: 18,
    padding: '12px 10px',
    display: 'grid',
    gap: 4,
    textAlign: 'center',
  },
};
