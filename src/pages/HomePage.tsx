import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { RecommendationCard } from '../components/common/RecommendationCard';
import { SettingsPanel } from '../components/common/SettingsPanel';
import { StatsPanel } from '../components/common/StatsPanel';
import type { HomeRecommendation } from '../lib/recommendation';
import type { LearningStats } from '../lib/stats';
import type { GameMode } from '../types/question';

interface HomePageProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onStart: () => void;
  totalStars: number;
  roundSize: number;
  selectedCategory: string;
  categories: string[];
  autoPlaySound: boolean;
  soundEnabled: boolean;
  onRoundSizeChange: (size: number) => void;
  onCategoryChange: (category: string) => void;
  onToggleAutoPlaySound: () => void;
  onToggleSoundEnabled: () => void;
  stats: LearningStats;
  recommendation: HomeRecommendation;
}

const modes: Array<{ value: GameMode; label: string; emoji: string; desc: string; color: string }> = [
  { value: 'e2c', label: '英译中选择', emoji: '🌈', desc: '看英文，选中文', color: '#4ECDC4' },
  { value: 'c2e', label: '中译英拼写', emoji: '✏️', desc: '看中文，拼英文', color: '#FF6B6B' },
  { value: 'spell_blank', label: '留空补全', emoji: '🧩', desc: '补上缺失字母', color: '#FFE66D' },
];

export function HomePage({
  mode,
  onModeChange,
  onStart,
  totalStars,
  roundSize,
  selectedCategory,
  categories,
  autoPlaySound,
  soundEnabled,
  onRoundSizeChange,
  onCategoryChange,
  onToggleAutoPlaySound,
  onToggleSoundEnabled,
  stats,
  recommendation,
}: HomePageProps) {
  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.heroCard}>
        <div style={styles.sparkles}>☁️ ⭐ ☁️</div>
        <div style={styles.hero}>儿童英语单词学习</div>
        <div style={styles.sub}>一轮 5 题，轻轻松松学单词</div>
        <div style={styles.starPanel}>🌟 已经收集了 <strong>{totalStars}</strong> 颗星星</div>
        <div style={styles.pathTip}>今天有 {stats.stageCounts.new} 个新词、{stats.stageCounts.review} 个待复习词</div>
      </div>

      <RecommendationCard recommendation={recommendation} />

      <div style={styles.sectionTitle}>选择今天的学习模式</div>
      <div style={styles.grid}>
        {modes.map((item, index) => (
          <motion.button
            key={item.value}
            style={{ ...styles.modeCard, ...(mode === item.value ? styles.active : {}), borderColor: mode === item.value ? item.color : 'transparent' }}
            onClick={() => onModeChange(item.value)}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <div style={styles.modeHead}>
              <div style={styles.emoji}>{item.emoji}</div>
              <div style={{ ...styles.dot, background: item.color }} />
            </div>
            <div style={styles.modeLabel}>{item.label}</div>
            <div style={styles.modeDesc}>{item.desc}</div>
          </motion.button>
        ))}
      </div>
      <motion.button style={styles.start} onClick={onStart} whileTap={{ scale: 0.97 }} whileHover={{ y: -2 }}>
        {recommendation.focus === 'review' ? '开始复习 🔁' : recommendation.focus === 'new' ? '学习新词 🆕' : '开始学习 🚀'}
      </motion.button>

      <StatsPanel stats={stats} />

      <SettingsPanel
        roundSize={roundSize}
        selectedCategory={selectedCategory}
        categories={categories}
        autoPlaySound={autoPlaySound}
        soundEnabled={soundEnabled}
        onRoundSizeChange={onRoundSizeChange}
        onCategoryChange={onCategoryChange}
        onToggleAutoPlaySound={onToggleAutoPlaySound}
        onToggleSoundEnabled={onToggleSoundEnabled}
      />
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 18 },
  heroCard: {
    background: 'linear-gradient(180deg, #fff7f3 0%, #ffffff 100%)',
    borderRadius: 30,
    padding: '24px 20px',
    boxShadow: '0 20px 40px rgba(255, 107, 107, 0.12)',
    textAlign: 'center',
  },
  sparkles: { fontSize: 22, marginBottom: 10 },
  hero: { fontSize: 38, fontWeight: 900, textAlign: 'center', lineHeight: 1.15 },
  sub: { textAlign: 'center', color: '#636e72', fontSize: 18, marginTop: 8, fontWeight: 700 },
  starPanel: {
    marginTop: 16,
    display: 'inline-block',
    padding: '10px 16px',
    borderRadius: 999,
    background: '#fff2b8',
    color: '#7d5a00',
    fontWeight: 800,
  },
  pathTip: {
    marginTop: 12,
    color: '#6b7a80',
    fontWeight: 800,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 900,
    color: '#5a6467',
    marginLeft: 4,
  },
  grid: { display: 'grid', gap: 14 },
  modeCard: {
    minHeight: 94,
    border: '3px solid transparent',
    borderRadius: 24,
    background: '#fff',
    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
    fontSize: 18,
    fontWeight: 800,
    cursor: 'pointer',
    padding: '16px 18px',
    textAlign: 'left',
  },
  active: {
    transform: 'translateY(-2px)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.1)',
  },
  modeHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emoji: { fontSize: 30 },
  dot: { width: 14, height: 14, borderRadius: 999 },
  modeLabel: { marginTop: 8, fontSize: 19, fontWeight: 900 },
  modeDesc: { marginTop: 4, color: '#7c8a90', fontSize: 14, fontWeight: 700 },
  start: {
    minHeight: 60,
    border: 'none',
    borderRadius: 20,
    background: 'linear-gradient(135deg, #ff6b6b, #ff8e7b)',
    color: '#fff',
    fontSize: 22,
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 16px 28px rgba(255, 107, 107, 0.3)',
  },
};
