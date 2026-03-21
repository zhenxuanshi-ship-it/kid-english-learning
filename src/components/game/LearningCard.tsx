import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface LearningCardProps {
  english: string;
  chinese: string;
  emoji?: string;
  soundEnabled: boolean;
  onSpeak: () => void;
  onStart: () => void;
}

export function LearningCard({ english, chinese, emoji, soundEnabled, onSpeak, onStart }: LearningCardProps) {
  return (
    <motion.div style={styles.card} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.badge}>新单词先认识一下</div>
      <div style={styles.hero}>{emoji ?? '📚'}</div>
      <div style={styles.english}>{english}</div>
      <div style={styles.chinese}>{chinese}</div>
      <button style={{ ...styles.secondary, opacity: soundEnabled ? 1 : 0.7 }} onClick={onSpeak}>🔊 读一遍</button>
      <button style={styles.primary} onClick={onStart}>我记住了，开始练习</button>
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: 'linear-gradient(180deg, #ffffff 0%, #fffaf3 100%)',
    borderRadius: 28,
    padding: 24,
    boxShadow: '0 18px 40px rgba(255, 107, 107, 0.12)',
    display: 'grid',
    gap: 14,
    textAlign: 'center',
  },
  badge: {
    justifySelf: 'center',
    padding: '8px 14px',
    borderRadius: 999,
    background: '#fff2b8',
    color: '#7d5a00',
    fontWeight: 900,
    fontSize: 14,
  },
  hero: { fontSize: 46 },
  english: { fontSize: 36, fontWeight: 900, letterSpacing: 1 },
  chinese: { fontSize: 22, fontWeight: 800, color: '#636e72' },
  secondary: {
    minHeight: 50,
    border: 'none',
    borderRadius: 18,
    background: '#ffffff',
    boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
    fontWeight: 800,
    cursor: 'pointer',
  },
  primary: {
    minHeight: 56,
    border: 'none',
    borderRadius: 20,
    background: 'linear-gradient(135deg, #ff6b6b, #ff8e7b)',
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
  },
};
