import type { CSSProperties } from 'react';
import type { DailyPlan } from '../../lib/dailyPlan';

interface DailyPlanCardProps {
  plan: DailyPlan;
  onStartTask: (mode: DailyPlan['tasks'][number]['mode']) => void;
}

const kindEmojiMap = {
  new: '🆕',
  review: '🔁',
  practice: '✏️',
} as const;

export function DailyPlanCard({ plan, onStartTask }: DailyPlanCardProps) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>{plan.title}</div>
      <div style={styles.summary}>{plan.summary}</div>
      <div style={styles.list}>
        {plan.tasks.map((task) => (
          <div key={`${task.kind}-${task.mode}`} style={styles.item}>
            <div>
              <div style={styles.itemTitle}>{kindEmojiMap[task.kind]} {task.label}</div>
              <div style={styles.itemMeta}>约 {task.count} 个词 · 推荐模式 {task.mode}</div>
            </div>
            <button style={styles.button} onClick={() => onStartTask(task.mode)}>开始</button>
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
  title: { fontWeight: 900, fontSize: 18 },
  summary: { color: '#6b7a80', fontWeight: 700, fontSize: 14 },
  list: { display: 'grid', gap: 10 },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    background: '#f7f9fc',
    borderRadius: 18,
    padding: '12px 14px',
  },
  itemTitle: { fontWeight: 800 },
  itemMeta: { marginTop: 4, color: '#7b8a90', fontSize: 13, fontWeight: 700 },
  button: {
    minHeight: 38,
    padding: '0 12px',
    border: 'none',
    borderRadius: 999,
    background: '#4ecdc4',
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
    flexShrink: 0,
  },
};
