import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BottomNav, type NavTab } from './BottomNav';

describe('BottomNav', () => {
  const renderNav = (current: NavTab = 'home', onChange = vi.fn()) => {
    return render(<BottomNav current={current} onChange={onChange} />);
  };

  it('renders 4 tabs', () => {
    renderNav();
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('主题')).toBeInTheDocument();
    expect(screen.getByText('复习')).toBeInTheDocument();
    expect(screen.getByText('我的')).toBeInTheDocument();
  });

  it('calls onChange when topic tab clicked', () => {
    const onChange = vi.fn();
    renderNav('home', onChange);
    fireEvent.click(screen.getByText('主题'));
    expect(onChange).toHaveBeenCalledWith('topics');
  });

  it('calls onChange when review tab clicked', () => {
    const onChange = vi.fn();
    renderNav('home', onChange);
    fireEvent.click(screen.getByText('复习'));
    expect(onChange).toHaveBeenCalledWith('review');
  });

  it('calls onChange when profile tab clicked', () => {
    const onChange = vi.fn();
    renderNav('home', onChange);
    fireEvent.click(screen.getByText('我的'));
    expect(onChange).toHaveBeenCalledWith('profile');
  });

  it('renders without error when profile is active', () => {
    const onChange = vi.fn();
    renderNav('profile', onChange);
    expect(screen.getByText('我的')).toBeInTheDocument();
  });
});
