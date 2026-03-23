import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import { SettingsPanel } from './SettingsPanel';

describe('SettingsPanel', () => {
  const defaultProps = {
    roundSize: 5,
    selectedCategory: 'all',
    categories: ['all', 'animals', 'food', 'family'],
    autoPlaySound: false,
    soundEnabled: false,
    onRoundSizeChange: vi.fn(),
    onCategoryChange: vi.fn(),
    onToggleAutoPlaySound: vi.fn(),
    onToggleSoundEnabled: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders settings panel', () => {
    render(<SettingsPanel {...defaultProps} />);
    expect(screen.getByText('⚙️ 学习设置')).toBeInTheDocument();
  });

  it('renders round size options', () => {
    render(<SettingsPanel {...defaultProps} />);
    expect(screen.getByText('5 题')).toBeInTheDocument();
    expect(screen.getByText('8 题')).toBeInTheDocument();
    expect(screen.getByText('10 题')).toBeInTheDocument();
  });

  it('calls onRoundSizeChange when size button clicked', () => {
    render(<SettingsPanel {...defaultProps} />);
    fireEvent.click(screen.getByText('10 题'));
    expect(defaultProps.onRoundSizeChange).toHaveBeenCalledWith(10);
  });

  it('calls onCategoryChange when category changed', () => {
    render(<SettingsPanel {...defaultProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'animals' } });
    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith('animals');
  });

  it('calls onToggleSoundEnabled when sound toggle clicked', () => {
    render(<SettingsPanel {...defaultProps} />);
    fireEvent.click(screen.getByText('🔇 音效已关闭'));
    expect(defaultProps.onToggleSoundEnabled).toHaveBeenCalled();
  });

  it('calls onToggleAutoPlaySound when auto-play clicked', () => {
    render(<SettingsPanel {...defaultProps} />);
    fireEvent.click(screen.getByText('⏸️ 自动发音关'));
    expect(defaultProps.onToggleAutoPlaySound).toHaveBeenCalled();
  });
});
