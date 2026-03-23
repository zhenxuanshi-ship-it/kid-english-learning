import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AddChildModal, ChildSelector } from './ChildSelector';

describe('ChildSelector', () => {
  it('renders child chips for each child', () => {
    const children = [
      { id: '1', name: '小明', avatar_emoji: '👦' },
      { id: '2', name: '小红', avatar_emoji: '👧' },
    ];
    render(<ChildSelector children={children} selectedId="1" onSelect={vi.fn()} />);
    expect(screen.getByText('👦')).toBeInTheDocument();
    expect(screen.getByText('小明')).toBeInTheDocument();
    expect(screen.getByText('👧')).toBeInTheDocument();
    expect(screen.getByText('小红')).toBeInTheDocument();
  });

  it('calls onSelect with child id when chip clicked', () => {
    const onSelect = vi.fn();
    const children = [{ id: '2', name: '小明', avatar_emoji: '👦' }];
    render(<ChildSelector children={children} selectedId="1" onSelect={onSelect} />);
    fireEvent.click(screen.getByText('小明'));
    expect(onSelect).toHaveBeenCalledWith('2');
  });

  it('renders null when children array is empty', () => {
    const { container } = render(<ChildSelector children={[]} selectedId={null} onSelect={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('AddChildModal', () => {
  it('renders modal with name input', () => {
    render(<AddChildModal onConfirm={vi.fn()} onCancel={vi.fn()} loading={false} />);
    expect(screen.getByPlaceholderText('孩子的名字')).toBeInTheDocument();
  });

  it('renders avatar options', () => {
    render(<AddChildModal onConfirm={vi.fn()} onCancel={vi.fn()} loading={false} />);
    expect(screen.getByText('选择头像')).toBeInTheDocument();
    // Should show emoji options
    expect(screen.getByText('👦')).toBeInTheDocument();
    expect(screen.getByText('👧')).toBeInTheDocument();
  });

  it('calls onConfirm with name and emoji on submit', () => {
    const onConfirm = vi.fn();
    render(<AddChildModal onConfirm={onConfirm} onCancel={vi.fn()} loading={false} />);
    fireEvent.change(screen.getByPlaceholderText('孩子的名字'), { target: { value: '小华' } });
    fireEvent.click(screen.getByText('添加'));
    expect(onConfirm).toHaveBeenCalledWith('小华', expect.any(String));
  });

  it('calls onCancel on cancel button', () => {
    const onCancel = vi.fn();
    render(<AddChildModal onConfirm={vi.fn()} onCancel={onCancel} loading={false} />);
    fireEvent.click(screen.getByText('取消'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('disables buttons when loading', () => {
    render(<AddChildModal onConfirm={vi.fn()} onCancel={vi.fn()} loading={true} />);
    expect(screen.getByText('添加中...')).toBeInTheDocument();
  });

  it('does not submit when name is empty', () => {
    const onConfirm = vi.fn();
    render(<AddChildModal onConfirm={onConfirm} onCancel={vi.fn()} loading={false} />);
    fireEvent.click(screen.getByText('添加'));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
