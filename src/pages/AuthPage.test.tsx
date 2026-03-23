import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthPage } from './AuthPage';

const mockSignInWithEmail = vi.fn();
const mockSignUpWithEmail = vi.fn();
const mockSignInWithGoogle = vi.fn();

vi.mock('../lib/supabase/auth', () => ({
  signInWithEmail: (...args: unknown[]) => mockSignInWithEmail(...args),
  signUpWithEmail: (...args: unknown[]) => mockSignUpWithEmail(...args),
  signInWithGoogle: (...args: unknown[]) => mockSignInWithGoogle(...args),
}));

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<AuthPage onLoginSuccess={vi.fn()} />);
    expect(screen.getByPlaceholderText('邮箱')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
  });

  it('toggles between login and sign up modes', () => {
    render(<AuthPage onLoginSuccess={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '注册' }));
    expect(screen.getByRole('button', { name: '注册' })).toBeInTheDocument();
    // Should show sign up button label
    expect(screen.getByRole('button', { name: '注册' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '登录' }));
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
  });

  it('calls signInWithEmail with correct params on login submit', async () => {
    mockSignInWithEmail.mockResolvedValue({ error: null });
    render(<AuthPage onLoginSuccess={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('邮箱'), { target: { value: 'parent@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('密码'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    expect(mockSignInWithEmail).toHaveBeenCalledWith('parent@test.com', 'password123');
  });

  it('calls signUpWithEmail on sign up submit', async () => {
    mockSignUpWithEmail.mockResolvedValue({ error: null });
    render(<AuthPage onLoginSuccess={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: '注册' }));
    fireEvent.change(screen.getByPlaceholderText('邮箱'), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('密码'), { target: { value: 'newpass' } });
    fireEvent.click(screen.getByRole('button', { name: '注册' }));

    expect(mockSignUpWithEmail).toHaveBeenCalledWith('new@test.com', 'newpass');
  });

  it('shows error message on login failure', async () => {
    mockSignInWithEmail.mockResolvedValue({ error: { message: '邮箱或密码错误' } });
    render(<AuthPage onLoginSuccess={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('邮箱'), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('密码'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await vi.waitFor(() => {
      expect(screen.getByText('邮箱或密码错误')).toBeInTheDocument();
    });
  });

  it('calls onLoginSuccess on successful login', async () => {
    mockSignInWithEmail.mockResolvedValue({ error: null });
    const onLoginSuccess = vi.fn();
    render(<AuthPage onLoginSuccess={onLoginSuccess} />);

    fireEvent.change(screen.getByPlaceholderText('邮箱'), { target: { value: 'parent@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('密码'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await vi.waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalled();
    });
  });

  it('renders Google login button', () => {
    render(<AuthPage onLoginSuccess={vi.fn()} />);
    expect(screen.getByText('使用 Google 登录')).toBeInTheDocument();
  });

  it('calls signInWithGoogle on Google button click', () => {
    mockSignInWithGoogle.mockResolvedValue({ error: null });
    render(<AuthPage onLoginSuccess={vi.fn()} />);

    fireEvent.click(screen.getByText('使用 Google 登录'));
    expect(mockSignInWithGoogle).toHaveBeenCalled();
  });
});
