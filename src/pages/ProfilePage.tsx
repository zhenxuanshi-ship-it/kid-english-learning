import { useState } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { SettingsPanel } from '../components/common/SettingsPanel';
import { StatsPanel } from '../components/common/StatsPanel';
import { ChildSelector, AddChildModal } from '../components/common/ChildSelector';
import type { LearningStats } from '../lib/stats';
import { APP_ENV, APP_VERSION, type StorageDiagnostics } from '../lib/runtime';

interface ProfilePageProps {
  stats: LearningStats;
  roundSize: number;
  selectedCategory: string;
  categories: string[];
  autoPlaySound: boolean;
  soundEnabled: boolean;
  storageDiagnostics: StorageDiagnostics;
  children: Array<{ id: string; name: string; avatar_emoji: string | null }>;
  selectedChildId: string | null;
  onSelectChild: (id: string) => void;
  onAddChild: (name: string, emoji: string) => Promise<void>;
  onRoundSizeChange: (size: number) => void;
  onCategoryChange: (category: string) => void;
  onToggleAutoPlaySound: () => void;
  onToggleSoundEnabled: () => void;
}

export function ProfilePage(props: ProfilePageProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingChild, setAddingChild] = useState(false);

  const selectedChild = props.children.find((c) => c.id === props.selectedChildId);

  const handleAddChild = async (name: string, emoji: string) => {
    setAddingChild(true);
    try {
      await props.onAddChild(name, emoji);
      setShowAddModal(false);
    } finally {
      setAddingChild(false);
    }
  };

  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

      {/* 孩子选择区 */}
      <div style={styles.childrenCard}>
        <div style={styles.childrenHeader}>
          <div style={styles.childrenTitle}>👨‍👩‍👧‍👦 学习账号</div>
          <button style={styles.addBtn} onClick={() => setShowAddModal(true)}>+ 添加孩子</button>
        </div>
        {props.children.length > 0 ? (
          <div style={styles.selectorWrap}>
            <ChildSelector
              children={props.children}
              selectedId={props.selectedChildId}
              onSelect={props.onSelectChild}
            />
          </div>
        ) : (
          <div style={styles.emptyHint}>还没有添加孩子，点击上方按钮添加</div>
        )}
      </div>

      {/* 当前孩子信息 */}
      {selectedChild && (
        <div style={styles.currentChild}>
          <span style={styles.currentChildName}>{selectedChild.avatar_emoji ?? '👦'} {selectedChild.name}</span>
          <span style={styles.currentChildLabel}>当前学习账号</span>
        </div>
      )}

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
      <div style={styles.releaseCard}>
        <div style={styles.releaseTitle}>🚀 版本信息</div>
        <div style={styles.releaseText}>版本：{APP_VERSION}</div>
        <div style={styles.releaseText}>环境：{APP_ENV}</div>
        <div style={styles.releaseDivider} />
        <div style={styles.releaseTitle}>💾 存储状态</div>
        <div style={styles.releaseText}>localStorage：{props.storageDiagnostics.localStorageAvailable ? '可用' : '不可用'}</div>
        <div style={styles.releaseText}>持久存储支持：{props.storageDiagnostics.persistenceSupported ? '支持' : '不支持'}</div>
        <div style={styles.releaseText}>持久存储授权：{props.storageDiagnostics.persistenceGranted ? '已授权' : '未授权 / 未支持'}</div>
      </div>

      {showAddModal && (
        <AddChildModal
          onConfirm={handleAddChild}
          onCancel={() => setShowAddModal(false)}
          loading={addingChild}
        />
      )}
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 16 },
  childrenCard: {
    background: '#fff',
    borderRadius: 20,
    padding: 16,
    boxShadow: '0 8px 18px rgba(0,0,0,0.05)',
    display: 'grid',
    gap: 12,
  },
  childrenHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  childrenTitle: { fontSize: 16, fontWeight: 900, color: '#384349' },
  addBtn: {
    padding: '6px 14px',
    borderRadius: 99,
    border: 'none',
    background: 'linear-gradient(135deg, #ff6b6b, #ffa07a)',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
  selectorWrap: { marginTop: 4 },
  emptyHint: {
    fontSize: 13,
    color: '#a0aec0',
    fontWeight: 600,
    textAlign: 'center',
    padding: '8px 0',
  },
  currentChild: {
    background: '#fff4ef',
    borderRadius: 14,
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentChildName: { fontSize: 15, fontWeight: 800, color: '#2d3748' },
  currentChildLabel: { fontSize: 12, color: '#ff6b6b', fontWeight: 700 },
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
  releaseDivider: { height: 1, background: '#edf1f3', margin: '4px 0' },
};
