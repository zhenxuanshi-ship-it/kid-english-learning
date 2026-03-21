import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface WordCardProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  children?: ReactNode;
  status?: 'correct' | 'wrong' | null;
}

export function WordCard({ title, subtitle, emoji, children, status = null }: WordCardProps) {
  return (
    <motion.div
      style={{ ...styles.card, ...(status ? styles[status] : {}) }}
      animate={status === 'correct' ? { y: [0, -6, 0], scale: [1, 1.02, 1] } : status === 'wrong' ? { x: [0, -6, 6, -4, 4, 0] } : { y: 0, x: 0, scale: 1 }}
      transition={{ duration: 0.45 }}
    >
      <div style={styles.badge}>{status === 'correct' ? '太棒啦!' : status === 'wrong' ? '再试试～' : '今日单词'}</div>
      <div style={styles.emojiRow}>
        <span>🌟</span>
        <span style={styles.icon}>{emoji ?? (status === 'correct' ? '🐣' : status === 'wrong' ? '🐻' : '🦊')}</span>
        <span>☁️</span>
      </div>
      <div style={styles.title}>{title}</div>
      {subtitle ? <div style={styles.subtitle}>{subtitle}</div> : <div style={styles.helper}>看一看，想一想，再点一点击字母或选项～</div>}
      <div style={styles.content}>{children}</div>
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #ffffff 0%, #fffdf8 100%)',
    borderRadius: 28,
    padding: 24,
    boxShadow: '0 18px 40px rgba(255, 107, 107, 0.12)',
    textAlign: 'center',
    minHeight: 280,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 14,
    border: '4px solid transparent',
  },
  badge: {
    alignSelf: 'center',
    padding: '8px 14px',
    background: '#ffe66d',
    color: '#7d5a00',
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 900,
  },
  emojiRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 24,
    opacity: 0.9,
  },
  icon: {
    fontSize: 52,
    lineHeight: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: 0.5,
    color: '#2d3436',
  },
  subtitle: {
    fontSize: 18,
    color: '#636e72',
    fontWeight: 700,
  },
  helper: {
    fontSize: 15,
    color: '#94a3ad',
    fontWeight: 700,
  },
  content: {
    display: 'grid',
    gap: 12,
  },
  correct: {
    borderColor: '#4ecdc4',
    boxShadow: '0 22px 48px rgba(78, 205, 196, 0.2)',
  },
  wrong: {
    borderColor: '#ffb4b3',
    boxShadow: '0 22px 48px rgba(255, 118, 117, 0.18)',
  },
};
