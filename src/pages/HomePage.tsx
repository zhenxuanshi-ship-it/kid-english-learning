import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { DailyPlanCard } from '../components/common/DailyPlanCard';
import { NextTaskBanner } from '../components/common/NextTaskBanner';
import type { CategoryGalleryItem } from '../lib/categoryGallery';
import type { DailyPlan } from '../lib/dailyPlan';
import type { DailySummary } from '../lib/dailySummary';
import type { NextTaskRecommendation } from '../lib/nextTask';
import type { HomeRecommendation } from '../lib/recommendation';
import type { LearningStats } from '../lib/stats';
import type { SentenceLearningStage, SentencePattern } from '../types/sentence';
import type { GameMode } from '../types/question';
import { trackEvent } from '../lib/telemetry';

interface HomePageProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onStart: (useRecommendationCategory?: boolean) => void;
  onOpenTopics: () => void;
  onOpenReview: () => void;
  onOpenSentencePractice: () => void;
  totalStars: number;
  categoryItems: CategoryGalleryItem[];
  stats: LearningStats;
  recommendation: HomeRecommendation;
  dailyPlan: DailyPlan;
  dailySummary: DailySummary;
  nextTaskRecommendation: NextTaskRecommendation;
  sentenceRecommendedPattern?: SentencePattern;
  sentenceContinuePattern?: SentencePattern;
  sentenceStageSummary: Record<SentenceLearningStage, number>;
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
  onOpenSentencePractice,
  totalStars,
  categoryItems,
  stats,
  recommendation,
  dailyPlan,
  dailySummary,
  nextTaskRecommendation,
  sentenceRecommendedPattern,
  sentenceContinuePattern,
  sentenceStageSummary,
  completedDailyTaskKinds,
  newlyCompletedTaskKind,
  onStartTask,
  onResetDailyTasks,
}: HomePageProps) {
  const featuredTopic = categoryItems.find((item) => item.category === recommendation.suggestedCategory) ?? categoryItems[0];
  const sentenceAction = sentenceStageSummary.review > 0
    ? { title: '先去复习句型', desc: `有 ${sentenceStageSummary.review} 个句型待复习`, source: 'review' }
    : sentenceStageSummary.learning > 0 || sentenceContinuePattern
      ? { title: '继续上次句型', desc: '把练习中的句型再巩固一下', source: 'continue' }
      : { title: '开始新句型', desc: `还有 ${sentenceStageSummary.new} 个新句型可以学`, source: 'new' };

  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.heroCard}>
        <div style={styles.topRow}>
          <div style={styles.sparkles}>☁️ ⭐ ☁️</div>
          <div style={styles.starPanel}>🌟 {totalStars} 星星</div>
        </div>
        <div style={styles.hero}>今天先完成一件最重要的事</div>
        <div style={styles.sub}>{recommendation.title}</div>
        <button style={styles.primaryButton} onClick={() => onStart(Boolean(recommendation.suggestedCategory))}>继续今日任务</button>
        <div style={styles.pathTip}>推荐方式：{modeLabelMap[mode]} · 新词 {stats.stageCounts.new} 个 · 复习 {stats.stageCounts.review} 个</div>
      </div>

      <NextTaskBanner recommendation={nextTaskRecommendation} highlight={Boolean(newlyCompletedTaskKind)} />

      <div style={styles.summaryStrip}>
        <div style={styles.summaryItem}><strong>{dailySummary.completedTaskCount}/{dailySummary.totalTaskCount}</strong><span>今日进度</span></div>
        <div style={styles.summaryItem}><strong>{dailySummary.learnedWords}</strong><span>已学词</span></div>
        <div style={styles.summaryItem}><strong>{dailySummary.reviewWords}</strong><span>待复习</span></div>
      </div>

      {(sentenceContinuePattern || sentenceRecommendedPattern) ? (
        <button
          style={styles.sentenceCard}
          onClick={() => {
            trackEvent('home_sentence_card_click', {
              patternId: (sentenceContinuePattern ?? sentenceRecommendedPattern)?.id,
              patternTitle: (sentenceContinuePattern ?? sentenceRecommendedPattern)?.title,
              source: sentenceContinuePattern ? 'continue' : 'recommend',
            });
            onOpenSentencePractice();
          }}
        >
          <div style={styles.sentenceKicker}>{sentenceContinuePattern ? '🧩 首页继续句型' : '🧩 首页推荐句型'}</div>
          <div style={styles.sentenceTitle}>{(sentenceContinuePattern ?? sentenceRecommendedPattern)?.title}</div>
          <div style={styles.sentenceDesc}>{sentenceContinuePattern ? '先把上次练到一半的句型接着完成。' : '今天先练一个最该上的句型。'}</div>
        </button>
      ) : null}

      <button
        style={styles.sentenceStatusCard}
        onClick={() => {
          trackEvent('home_sentence_status_click', {
            action: sentenceAction.source,
            reviewCount: sentenceStageSummary.review,
            learningCount: sentenceStageSummary.learning,
            newCount: sentenceStageSummary.new,
          });
          onOpenSentencePractice();
        }}
      >
        <div style={styles.sentenceStatusHeader}>
          <div style={styles.sentenceStatusTitle}>🧩 今天句型进度</div>
          <div style={styles.sentenceStatusCta}>{sentenceAction.title}</div>
        </div>
        <div style={styles.sentenceStatusSub}>{sentenceAction.desc}</div>
        <div style={styles.sentenceStatusGrid}>
          <div style={styles.sentenceStatusItem}><strong>{sentenceStageSummary.new}</strong><span>新句型</span></div>
          <div style={styles.sentenceStatusItem}><strong>{sentenceStageSummary.learning}</strong><span>练习中</span></div>
          <div style={styles.sentenceStatusItem}><strong>{sentenceStageSummary.review}</strong><span>待复习</span></div>
          <div style={styles.sentenceStatusItem}><strong>{sentenceStageSummary.mastered}</strong><span>已掌握</span></div>
        </div>
      </button>

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

      <div style={styles.helperCard}>
        <div style={styles.helperTitle}>📌 学习提醒</div>
        <div style={styles.helperText}>{recommendation.description}</div>
      </div>
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 10 },
  heroCard: {
    background: 'linear-gradient(180deg, #fff8f5 0%, #ffffff 100%)',
    borderRadius: 24,
    padding: '16px 16px 18px',
    boxShadow: '0 12px 24px rgba(255, 107, 107, 0.10)',
    display: 'grid',
    gap: 8,
  },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  sparkles: { fontSize: 16 },
  hero: { fontSize: 25, fontWeight: 900, lineHeight: 1.12 },
  sub: { color: '#6a767b', fontSize: 14, fontWeight: 700 },
  starPanel: {
    padding: '8px 12px',
    borderRadius: 999,
    background: '#fff2b8',
    color: '#7d5a00',
    fontWeight: 800,
    fontSize: 13,
  },
  pathTip: { color: '#6b7a80', fontWeight: 700, fontSize: 13 },
  primaryButton: {
    minHeight: 50,
    border: 'none',
    borderRadius: 16,
    background: 'linear-gradient(135deg, #ff6b6b, #ff8e7b)',
    color: '#fff',
    fontWeight: 900,
    fontSize: 18,
    boxShadow: '0 12px 20px rgba(255, 107, 107, 0.20)',
  },
  summaryStrip: {
    background: '#fff',
    borderRadius: 18,
    padding: 10,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 8,
    boxShadow: '0 10px 22px rgba(0,0,0,0.06)',
  },
  summaryItem: {
    display: 'grid',
    gap: 2,
    textAlign: 'center',
    background: '#f8fafb',
    borderRadius: 14,
    padding: '10px 8px',
    fontSize: 12,
    color: '#66757b',
    fontWeight: 700,
  },
  sentenceCard: {
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #f4f1ff, #ffffff)',
    boxShadow: '0 8px 18px rgba(124,92,255,0.08)',
    padding: 14,
    textAlign: 'left',
    display: 'grid',
    gap: 4,
  },
  sentenceKicker: { fontSize: 13, fontWeight: 900, color: '#7c5cff' },
  sentenceTitle: { fontSize: 18, fontWeight: 900, color: '#433880' },
  sentenceDesc: { fontSize: 13, fontWeight: 700, color: '#66757b' },
  sentenceStatusCard: {
    background: '#fff',
    border: 'none',
    borderRadius: 18,
    padding: 12,
    boxShadow: '0 8px 18px rgba(0,0,0,0.05)',
    display: 'grid',
    gap: 8,
    textAlign: 'left',
  },
  sentenceStatusHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  sentenceStatusTitle: { fontSize: 14, fontWeight: 900, color: '#433880' },
  sentenceStatusCta: { fontSize: 12, fontWeight: 900, color: '#7c5cff' },
  sentenceStatusSub: { fontSize: 12, fontWeight: 700, color: '#66757b' },
  sentenceStatusGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 },
  sentenceStatusItem: {
    background: '#f8f7ff',
    borderRadius: 14,
    padding: '10px 6px',
    display: 'grid',
    gap: 2,
    textAlign: 'center',
    fontSize: 11,
    color: '#66757b',
    fontWeight: 700,
  },
  quickGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  quickCard: {
    minHeight: 96,
    border: 'none',
    borderRadius: 18,
    background: '#fff',
    boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
    padding: 12,
    textAlign: 'left',
    display: 'grid',
    gap: 2,
  },
  quickEmoji: { fontSize: 24 },
  quickTitle: { fontSize: 17, fontWeight: 900 },
  quickDesc: { fontSize: 12, fontWeight: 700, color: '#6b7a80' },
  helperCard: {
    background: '#fff',
    borderRadius: 18,
    padding: 14,
    boxShadow: '0 8px 18px rgba(0,0,0,0.05)',
    display: 'grid',
    gap: 6,
  },
  helperTitle: { fontWeight: 900, fontSize: 14 },
  helperText: { color: '#6b7a80', fontWeight: 700, fontSize: 13 },
};
