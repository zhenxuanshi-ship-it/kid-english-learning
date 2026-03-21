import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { DailyPlanCard } from '../components/common/DailyPlanCard';
import { DailySummaryCard } from '../components/common/DailySummaryCard';
import { NextTaskBanner } from '../components/common/NextTaskBanner';
import { RecommendationCard } from '../components/common/RecommendationCard';
import type { CategoryGalleryItem } from '../lib/categoryGallery';
import type { DailyPlan } from '../lib/dailyPlan';
import type { DailySummary } from '../lib/dailySummary';
import type { NextTaskRecommendation } from '../lib/nextTask';
import type { HomeRecommendation } from '../lib/recommendation';
import type { LearningStats } from '../lib/stats';
import type { GameMode } from '../types/question';

interface HomePageProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onStart: (useRecommendationCategory?: boolean) => void;
  onOpenTopics: () => void;
  onOpenReview: () => void;
  totalStars: number;
  categoryItems: CategoryGalleryItem[];
  stats: LearningStats;
  recommendation: HomeRecommendation;
  dailyPlan: DailyPlan;
  dailySummary: DailySummary;
  nextTaskRecommendation: NextTaskRecommendation;
  completedDailyTaskKinds: string[];
  newlyCompletedTaskKind?: string;
  onStartTask: (task: DailyPlan['tasks'][number]) => void;
  onResetDailyTasks: () => void;
}

const modeLabelMap: Record<GameMode, string> = {
  e2c: '英译中选择',
  c2e: '中译英拼写',
  spell_blank: '留空补全',
};

export function HomePage({
  mode,
  onStart,
  onOpenTopics,
  onOpenReview,
  totalStars,
  categoryItems,
  stats,
  recommendation,
  dailyPlan,
  dailySummary,
  nextTaskRecommendation,
  completedDailyTaskKinds,
  newlyCompletedTaskKind,
  onStartTask,
  onResetDailyTasks,
}: HomePageProps) {
  const featuredTopic = categoryItems.find((item) => item.category === recommendation.suggestedCategory) ?? categoryItems[0];

  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.heroCard}>
        <div style={styles.sparkles}>☁️ ⭐ ☁️</div>
        <div style={styles.hero}>今天继续学一点点</div>
        <div style={styles.sub}>把任务做清楚，比把页面堆很长更重要。</div>
        <div style={styles.starPanel}>🌟 已收集 <strong>{totalStars}</strong> 颗星星</div>
        <div style={styles.pathTip}>推荐方式：{modeLabelMap[mode]} · 新词 {stats.stageCounts.new} 个</div>
      </div>

      <div style={styles.primaryCard}>
        <div style={styles.primaryHeader}>
          <div>
            <div style={styles.sectionKicker}>今日主线</div>
            <div style={styles.primaryTitle}>继续今日任务</div>
          </div>
          <button style={styles.primaryButton} onClick={() => onStart(Boolean(recommendation.suggestedCategory))}>开始</button>
        </div>
        <NextTaskBanner recommendation={nextTaskRecommendation} highlight={Boolean(newlyCompletedTaskKind)} />
      </div>

      <div style={styles.quickGrid}>
        <button style={styles.quickCard} onClick={onOpenTopics}>
          <div style={styles.quickEmoji}>🎒</div>
          <div style={styles.quickTitle}>主题学习</div>
          <div style={styles.quickDesc}>{featuredTopic ? `${featuredTopic.label} · ${featuredTopic.featuredChinese}` : '去挑一个主题'}</div>
        </button>
        <button style={styles.quickCard} onClick={onOpenReview}>
          <div style={styles.quickEmoji}>🔁</div>
          <div style={styles.quickTitle}>复习错题</div>
          <div style={styles.quickDesc}>{stats.stageCounts.review > 0 ? `待复习 ${stats.stageCounts.review} 个` : '今天复习压力不大'}</div>
        </button>
      </div>

      <DailyPlanCard
        plan={dailyPlan}
        completedKinds={completedDailyTaskKinds}
        newlyCompletedKind={newlyCompletedTaskKind}
        onStartTask={onStartTask}
        onReset={onResetDailyTasks}
      />
      <DailySummaryCard summary={dailySummary} />
      <RecommendationCard recommendation={recommendation} />
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 16 },
  heroCard: {
    background: 'linear-gradient(180deg, #fff7f3 0%, #ffffff 100%)',
    borderRadius: 30,
    padding: '24px 20px',
    boxShadow: '0 20px 40px rgba(255, 107, 107, 0.12)',
    textAlign: 'center',
  },
  sparkles: { fontSize: 22, marginBottom: 10 },
  hero: { fontSize: 34, fontWeight: 900, lineHeight: 1.15 },
  sub: { color: '#636e72', fontSize: 16, marginTop: 8, fontWeight: 700 },
  starPanel: {
    marginTop: 16,
    display: 'inline-block',
    padding: '10px 16px',
    borderRadius: 999,
    background: '#fff2b8',
    color: '#7d5a00',
    fontWeight: 800,
  },
  pathTip: { marginTop: 12, color: '#6b7a80', fontWeight: 800, fontSize: 14 },
  primaryCard: {
    background: '#fff',
    borderRadius: 24,
    padding: 18,
    display: 'grid',
    gap: 12,
    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
  },
  primaryHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  sectionKicker: { fontSize: 12, fontWeight: 900, color: '#ff8e7b' },
  primaryTitle: { fontSize: 24, fontWeight: 900 },
  primaryButton: {
    minWidth: 96,
    minHeight: 48,
    border: 'none',
    borderRadius: 16,
    background: 'linear-gradient(135deg, #ff6b6b, #ff8e7b)',
    color: '#fff',
    fontWeight: 900,
    fontSize: 18,
  },
  quickGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  quickCard: {
    minHeight: 120,
    border: 'none',
    borderRadius: 22,
    background: '#fff',
    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
    padding: 16,
    textAlign: 'left',
    display: 'grid',
    gap: 6,
  },
  quickEmoji: { fontSize: 28 },
  quickTitle: { fontSize: 18, fontWeight: 900 },
  quickDesc: { fontSize: 13, fontWeight: 700, color: '#6b7a80' },
};
