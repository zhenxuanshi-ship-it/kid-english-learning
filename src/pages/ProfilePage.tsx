import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { SettingsPanel } from '../components/common/SettingsPanel';
import { StatsPanel } from '../components/common/StatsPanel';
import type { LearningStats } from '../lib/stats';

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
};
