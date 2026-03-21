import type { CSSProperties } from 'react';
import type { DailyPlan } from '../../lib/dailyPlan';

interface DailyPlanCardProps {
  plan: DailyPlan;
  completedKinds: string[];
  onStartTask: (task: DailyPlan['tasks'][number]) => void;
  onReset?: () => void;
}

const kindEmojiMap = {
  new: '🆕',
  review: '🔁',
  practice: '✏️',
} as const;

export function DailyPlanCard({ plan, completedKinds, onStartTask, onReset }: DailyPlanCardProps) {
  const completedCount = plan.tasks.filter((task) => completedKinds.includes(task.kind)).length;
  const progressPercent = plan.tasks.length > 0 ? Math.round((completedCount / plan.tasks.length) * 100) : 0;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>{plan.title}</div>
          <div style={styles.summary}>{plan.summary}</div>
        </div>
        {onReset ? <button style={styles.reset} onClick={onReset}>重置任务</button> : null}
      </div>
      <div style={styles.progressWrap}>
        <div style={styles.progressText}>今日进度 {completedCount}/{plan.tasks.length}</div>
        <div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${progressPercent}%` }} /></div>
      </div>
      <div style={styles.list}>
        {plan.tasks.map((task) => {
          const done = completedKinds.includes(task.kind);
          return (
            <div key={`${task.kind}-${task.mode}`} style={{ ...styles.item, ...(done ? styles.itemDone : {}) }}>
              <div style={styles.itemContent}>
                <div style={styles.itemTitleRow}>
                  <div style={styles.itemTitle}>{kindEmojiMap[task.kind]} {task.label}</div>
                  {done ? <div style={styles.doneBadge}>🏅 已完成</div> : null}
                </div>
                <div style={styles.itemMeta}>约 {task.count} 个词 · 推荐模式 {task.mode}</div>
                {done ? <div style={styles.rewardHint}>太棒啦，今天这项任务已经拿下啦！</div> : null}
              </div>
              <button style={{ ...styles.button, ...(done ? styles.buttonDone : {}) }} onClick={() => onStartTask(task)}>
                {done ? '再来一轮' : '开始'}
              </button>
            </div>
          );
        })}
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
  summary: { color: '#6b7a80', fontWeight: 700, fontSize: 14 },
  reset: {
    minHeight: 34,
    padding: '0 12px',
    border: 'none',
    borderRadius: 999,
    background: '#f3f7f8',
    fontWeight: 800,
    cursor: 'pointer',
  },
  progressWrap: { display: 'grid', gap: 8 },
  progressText: { fontSize: 13, fontWeight: 800, color: '#617076' },
  progressTrack: { height: 10, borderRadius: 999, background: '#eef3f5', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, background: 'linear-gradient(135deg, #4ecdc4, #73ddd3)' },
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
  itemContent: {
    display: 'grid',
    gap: 4,
    flex: 1,
  },
  itemTitleRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  itemDone: {
    background: '#eefbf7',
  },
  itemTitle: { fontWeight: 800 },
  doneBadge: {
    padding: '4px 8px',
    borderRadius: 999,
    background: '#fff6d8',
    color: '#9a6b00',
    fontSize: 12,
    fontWeight: 900,
  },
  itemMeta: { marginTop: 4, color: '#7b8a90', fontSize: 13, fontWeight: 700 },
  rewardHint: {
    marginTop: 2,
    color: '#ff8e7b',
    fontSize: 13,
    fontWeight: 800,
  },
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
  buttonDone: {
    background: '#7dcfb6',
  },
};
