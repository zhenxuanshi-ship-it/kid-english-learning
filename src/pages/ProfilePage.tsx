import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { SettingsPanel } from '../components/common/SettingsPanel';
import { StatsPanel } from '../components/common/StatsPanel';
import type { LearningStats } from '../lib/stats';
import { APP_ENV, APP_VERSION } from '../lib/runtime';

interface ProfilePageProps {
  stats: LearningStats;
  roundSize: number;
  selectedCategory: string;
  categories: string[];
  autoPlaySound: boolean;
  soundEnabled: boolean;
  onRoundSizeChange: (size: number) => void;
  onCategoryChange: (category: string) => void;
  onToggleAutoPlaySound: () => void;
  onToggleSoundEnabled: () => void;
}

export function ProfilePage(props: ProfilePageProps) {
  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <StatsPanel stats={props.stats} />
      <div style={styles.releaseCard}>
        <div style={styles.releaseTitle}>🚀 版本信息</div>
        <div style={styles.releaseText}>版本：{APP_VERSION}</div>
        <div style={styles.releaseText}>环境：{APP_ENV}</div>
      </div>
      <SettingsPanel
        roundSize={props.roundSize}
        selectedCategory={props.selectedCategory}
        categories={props.categories}
        autoPlaySound={props.autoPlaySound}
        soundEnabled={props.soundEnabled}
        onRoundSizeChange={props.onRoundSizeChange}
        onCategoryChange={props.onCategoryChange}
        onToggleAutoPlaySound={props.onToggleAutoPlaySound}
        onToggleSoundEnabled={props.onToggleSoundEnabled}
      />
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 16 },
  releaseCard: {
    background: '#fff',
    borderRadius: 20,
    padding: 16,
    boxShadow: '0 8px 18px rgba(0,0,0,0.05)',
    display: 'grid',
    gap: 6,
  },
  releaseTitle: { fontSize: 16, fontWeight: 900, color: '#384349' },
  releaseText: { fontSize: 13, fontWeight: 700, color: '#66757b' },
};
