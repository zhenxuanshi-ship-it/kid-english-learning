import type { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CelebrationOverlayProps {
  show: boolean;
  comboCount: number;
}

const floatingStars = [
  { left: '8%', top: '20%', emoji: '⭐', delay: 0 },
  { left: '20%', top: '72%', emoji: '✨', delay: 0.08 },
  { left: '34%', top: '12%', emoji: '🌟', delay: 0.16 },
  { left: '58%', top: '18%', emoji: '⭐', delay: 0.24 },
  { left: '74%', top: '68%', emoji: '✨', delay: 0.32 },
  { left: '88%', top: '26%', emoji: '🌟', delay: 0.4 },
];

export function CelebrationOverlay({ show, comboCount }: CelebrationOverlayProps) {
  const title = comboCount >= 3 ? '连对 3 题，超棒！' : '答对啦！';
  const subtitle = comboCount >= 3 ? '继续保持这个节奏 ✨' : '你又拿下一题啦';

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          style={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {floatingStars.map((star, index) => (
            <motion.div
              key={`${star.left}-${index}`}
              style={{ ...styles.star, left: star.left, top: star.top }}
              initial={{ opacity: 0, scale: 0.5, y: 16 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.8], y: [16, -12, -28, -40], rotate: [0, 8, -8, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: star.delay }}
            >
              {star.emoji}
            </motion.div>
          ))}
          <motion.div
            style={styles.card}
            initial={{ scale: 0.8, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          >
            <div style={styles.hero}>🎉</div>
            <div style={styles.title}>{title}</div>
            <div style={styles.subtitle}>{subtitle}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    display: 'grid',
    placeItems: 'center',
    zIndex: 20,
  },
  star: {
    position: 'absolute',
    fontSize: 28,
    filter: 'drop-shadow(0 8px 10px rgba(255, 206, 84, 0.35))',
  },
  card: {
    padding: '18px 20px',
    borderRadius: 24,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(6px)',
    boxShadow: '0 16px 36px rgba(255, 107, 107, 0.16)',
    textAlign: 'center',
    minWidth: 220,
  },
  hero: { fontSize: 34 },
  title: { fontSize: 22, fontWeight: 900, color: '#ff6b6b' },
  subtitle: { marginTop: 6, fontSize: 15, fontWeight: 700, color: '#6b7a80' },
};
