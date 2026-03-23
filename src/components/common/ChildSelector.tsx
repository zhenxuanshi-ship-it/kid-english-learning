import { useState } from 'react';
import type { CSSProperties } from 'react';

const EMOJIS = ['👦', '👧', '👶', '🧒', '👼', '🦸', '🧙', '🐼', '🦁', '🐰'];

interface ChildAvatarSelectorProps {
  selected: string;
  onChange: (emoji: string) => void;
}

export function ChildAvatarSelector({ selected, onChange }: ChildAvatarSelectorProps) {
  return (
    <div style={styles.avatarGrid}>
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onChange(emoji)}
          style={{
            ...styles.avatarBtn,
            ...(selected === emoji ? styles.avatarBtnSelected : {}),
          }}
        >
          <span style={styles.avatarEmoji}>{emoji}</span>
        </button>
      ))}
    </div>
  );
}

interface AddChildModalProps {
  onConfirm: (name: string, emoji: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export function AddChildModal({ onConfirm, onCancel, loading }: AddChildModalProps) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('👦');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onConfirm(name.trim(), emoji);
  };

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>添加孩子 👶</h2>
        <form onSubmit={handleSubmit} style={styles.modalForm}>
          <input
            type="text"
            placeholder="孩子的名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            maxLength={20}
            autoFocus
            required
          />
          <div style={styles.avatarLabel}>选择头像</div>
          <ChildAvatarSelector selected={emoji} onChange={setEmoji} />
          <div style={styles.modalBtns}>
            <button type="button" onClick={onCancel} style={styles.cancelBtn} disabled={loading}>
              取消
            </button>
            <button type="submit" style={styles.confirmBtn} disabled={loading || !name.trim()}>
              {loading ? '添加中...' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ChildSelectorProps {
  children: Array<{ id: string; name: string; avatar_emoji: string | null }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ChildSelector({ children, selectedId, onSelect }: ChildSelectorProps) {
  if (children.length === 0) return null;

  return (
    <div style={styles.selectorWrap}>
      {children.map((child) => (
        <button
          key={child.id}
          onClick={() => onSelect(child.id)}
          style={{
            ...styles.childChip,
            ...(selectedId === child.id ? styles.childChipSelected : {}),
          }}
        >
          <span>{child.avatar_emoji ?? '👦'}</span>
          <span>{child.name}</span>
        </button>
      ))}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: 20,
  },
  modal: {
    background: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2d3748',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  input: {
    padding: '14px 16px',
    borderRadius: 12,
    border: '2px solid #e2e8f0',
    fontSize: 16,
    outline: 'none',
  },
  avatarLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: '#718096',
  },
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 8,
  },
  avatarBtn: {
    aspectRatio: '1',
    borderRadius: 12,
    border: '2px solid #e2e8f0',
    background: '#f7fafc',
    fontSize: 24,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  avatarBtnSelected: {
    border: '2px solid #ff6b6b',
    background: '#fff4ef',
  },
  avatarEmoji: { pointerEvents: 'none' },
  modalBtns: {
    display: 'flex',
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: 12,
    border: '2px solid #e2e8f0',
    background: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    color: '#718096',
  },
  confirmBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, #ff6b6b, #ffa07a)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  selectorWrap: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  childChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    borderRadius: 99,
    border: '2px solid #e2e8f0',
    background: '#fff',
    fontSize: 14,
    fontWeight: 700,
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  childChipSelected: {
    border: '2px solid #ff6b6b',
    background: '#fff4ef',
    color: '#ff6b6b',
  },
};
