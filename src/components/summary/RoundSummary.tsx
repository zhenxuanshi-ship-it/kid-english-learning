import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { allWords } from '../../data/words';
import { StatsPanel } from '../common/StatsPanel';
import type { LearningStats } from '../../lib/stats';
import type { SentencePattern } from '../../types/sentence';
import { trackEvent } from '../../lib/telemetry';

interface RoundSummaryProps {
  correctCount: number;
  roundTotal: number;
  stars: number;
  wrongWordIds: number[];
  completedTaskLabel?: string;
  completedTaskReward?: string;
  nextTaskLabel?: string;
  sentencePatternSuggestion?: SentencePattern;
  onRestart: () => void;
  onRetryWrong: () => void;
  onGoHome: () => void;
  onGoTopics: () => void;
  onGoReview: () => void;
  onGoNextTask?: () => void;
  onGoSentencePractice?: () => void;
  stats: LearningStats;
}

export function RoundSummary({ correctCount, roundTotal, stars, wrongWordIds, completedTaskLabel, completedTaskReward, nextTaskLabel, sentencePatternSuggestion, onRestart, onRetryWrong, onGoHome, onGoTopics, onGoReview, onGoNextTask, onGoSentencePractice, stats }: RoundSummaryProps) {
  const wrongWords = wrongWordIds
    .map((id) => allWords.find((word) => word.id === id))
    .filter(Boolean);

  return (
    <motion.div style={styles.card} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.hero}>🎉</div>
      <h1 style={styles.title}>本轮完成啦</h1>
      <div style={styles.scoreRow}>
        <motion.div style={styles.scoreBubble} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}><strong>{correctCount}</strong><span>答对题数</span></motion.div>
        <motion.div style={{ ...styles.scoreBubble, ...styles.starBubble }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}><strong>⭐ {stars}</strong><span>本轮星星</span></motion.div>
      </div>
      {completedTaskLabel ? (
        <motion.div style={styles.taskCelebrate} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div style={styles.confetti}>🎊 ✨ 🌟 ✨ 🎊</div>
          <div style={styles.taskBadge}>✅ 已推进今日任务：{completedTaskLabel}</div>
          <div style={styles.rewardCount}>+1 今日任务</div>
          <div style={styles.rewardText}>{completedTaskReward ?? '今日任务 +1，继续冲呀！'}</div>
        </motion.div>
      ) : null}
      {wrongWords.length > 0 ? (
        <div style={styles.listWrap}>
          <h3 style={styles.listTitle}>这些单词可以再练一练</h3>
          <div style={styles.wordList}>
            {wrongWords.map((word) => (
              <div key={word!.id} style={styles.wordItem}>{word!.chinese} · {word!.english}</div>
            ))}
          </div>
        </div>
      ) : (
        <p style={styles.text}>太棒了，这轮全对！你已经把这 5 题都拿下啦 ✨</p>
      )}
      <div style={styles.footer}>本轮一共 {roundTotal} 题，慢慢学也很厉害。</div>
      <StatsPanel stats={stats} compact />
      <div style={styles.actions}>
        <button style={styles.primary} onClick={onRestart}>再来一轮</button>
        {wrongWordIds.length > 0 ? <button style={styles.secondary} onClick={onRetryWrong}>复习错题</button> : null}
      </div>
      {sentencePatternSuggestion && onGoSentencePractice ? (
        <div style={styles.sentenceSuggestion}>
          <div style={styles.sentenceSuggestionKicker}>🧩 结算页顺手练句子</div>
          <div style={styles.sentenceSuggestionTitle}>{sentencePatternSuggestion.title}</div>
          <div style={styles.sentenceSuggestionText}>刚学完这轮单词，马上用这个句型串起来会更容易记住。</div>
          <button
            style={styles.sentenceSuggestionButton}
            onClick={() => {
              trackEvent('summary_sentence_suggestion_click', {
                patternId: sentencePatternSuggestion.id,
                patternTitle: sentencePatternSuggestion.title,
              });
              onGoSentencePractice();
            }}
          >
            去练这个句型
          </button>
        </div>
      ) : null}
      <div style={styles.navBlock}>
        <div style={styles.navTitle}>下一步去哪？</div>
        <div style={styles.navGrid}>
          {onGoNextTask && nextTaskLabel ? <button style={styles.navButton} onClick={onGoNextTask}>继续下一项：{nextTaskLabel}</button> : null}
          <button style={styles.navButton} onClick={onGoHome}>回首页</button>
          <button style={styles.navButton} onClick={onGoTopics}>去主题页</button>
          <button style={styles.navButton} onClick={onGoReview}>去复习页</button>
        </div>
      </div>
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: 'linear-gradient(180deg, #ffffff 0%, #fffaf5 100%)',
    borderRadius: 24,
    padding: 18,
    boxShadow: '0 14px 28px rgba(255, 107, 107, 0.12)',
  },
  hero: { fontSize: 40, textAlign: 'center' },
  title: { marginTop: 4, marginBottom: 12, fontSize: 28, textAlign: 'center' },
  scoreRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  scoreBubble: {
    borderRadius: 18,
    padding: 12,
    background: '#f7f9fc',
    display: 'grid',
    gap: 6,
    textAlign: 'center',
  },
  starBubble: {
    background: '#fff3bd',
    color: '#7d5a00',
  },
  taskCelebrate: {
    marginTop: 18,
    display: 'grid',
    gap: 8,
    justifyItems: 'center',
  },
  confetti: {
    fontSize: 22,
    letterSpacing: 4,
  },
  taskBadge: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 18,
    background: '#ecfff7',
    color: '#157a6e',
    fontWeight: 900,
    textAlign: 'center',
  },
  rewardCount: {
    padding: '6px 12px',
    borderRadius: 999,
    background: '#ffe8f2',
    color: '#d9487d',
    fontWeight: 900,
    fontSize: 13,
    textAlign: 'center',
  },
  rewardText: {
    color: '#ff8e7b',
    fontWeight: 900,
    fontSize: 15,
    textAlign: 'center',
  },
  listWrap: { marginTop: 20, fontSize: 16 },
  listTitle: { marginBottom: 12 },
  wordList: { display: 'grid', gap: 10 },
  wordItem: {
    padding: '12px 14px',
    borderRadius: 16,
    background: '#ffffff',
    boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
    fontWeight: 700,
  },
  text: { fontSize: 18, margin: '18px 0 8px', textAlign: 'center' },
  footer: { textAlign: 'center', color: '#7c8a90', marginTop: 16, fontWeight: 700 },
  actions: { display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginTop: 20 },
  sentenceSuggestion: {
    marginTop: 14,
    display: 'grid',
    gap: 8,
    background: 'linear-gradient(135deg, #f4f1ff, #ffffff)',
    borderRadius: 18,
    padding: 14,
    boxShadow: '0 8px 18px rgba(124,92,255,0.08)',
  },
  sentenceSuggestionKicker: { fontSize: 13, fontWeight: 900, color: '#7c5cff' },
  sentenceSuggestionTitle: { fontSize: 20, fontWeight: 900, color: '#433880' },
  sentenceSuggestionText: { fontSize: 13, fontWeight: 700, color: '#66757b' },
  sentenceSuggestionButton: {
    minHeight: 44,
    border: 'none',
    borderRadius: 16,
    background: 'linear-gradient(135deg, #7c5cff, #9b83ff)',
    color: '#fff',
    fontWeight: 900,
  },
  navBlock: {
    marginTop: 14,
    display: 'grid',
    gap: 8,
    background: '#fff',
    borderRadius: 18,
    padding: 12,
    boxShadow: '0 8px 18px rgba(0,0,0,0.05)',
  },
  navTitle: { fontWeight: 900, fontSize: 16 },
  navGrid: { display: 'grid', gap: 8 },
  navButton: {
    minHeight: 42,
    border: '1px solid #edf1f3',
    borderRadius: 14,
    background: '#f7f9fc',
    fontWeight: 800,
    color: '#4f5d63',
  },
  primary: {
    flex: 1,
    minHeight: 56,
    padding: '0 18px',
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #ff6b6b, #ff8e7b)',
    color: '#fff',
    fontWeight: 900,
  },
  secondary: {
    flex: 1,
    minHeight: 56,
    padding: '0 18px',
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #4ecdc4, #73ddd3)',
    color: '#fff',
    fontWeight: 900,
  },
};
