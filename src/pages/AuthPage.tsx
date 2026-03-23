import { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../lib/supabase/auth';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

export function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password);
        if (error) throw error;
        alert('注册成功！请检查邮箱验证链接。');
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || '认证失败');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google 登录失败');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>👨‍👩‍👧‍👦 儿童英语学习</h1>
        <p style={styles.subtitle}>{isSignUp ? '创建家长账号' : '登录您的账号'}</p>

        <form onSubmit={handleEmailAuth} style={styles.form}>
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            minLength={6}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? '处理中...' : isSignUp ? '注册' : '登录'}
          </button>
        </form>

        <div style={styles.divider}>
          <span>或</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={styles.googleButton}
          disabled={loading}
        >
          <span style={styles.googleIcon}>🔵</span>
          使用 Google 登录
        </button>

        <p style={styles.toggle}>
          {isSignUp ? '已有账号？' : '没有账号？'}
          <button onClick={() => setIsSignUp(!isSignUp)} style={styles.link}>
            {isSignUp ? '登录' : '注册'}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
  },
  card: {
    background: 'white',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 360,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: 8,
    color: '#2d3748',
  },
  subtitle: {
    textAlign: 'center',
    color: '#718096',
    marginBottom: 24,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    padding: '14px 16px',
    borderRadius: 12,
    border: '2px solid #e2e8f0',
    fontSize: 16,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa07a 100%)',
    color: 'white',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  error: {
    color: '#e53e3e',
    fontSize: 14,
    textAlign: 'center',
  },
  divider: {
    textAlign: 'center',
    margin: '20px 0',
    color: '#a0aec0',
    fontSize: 14,
  },
  googleButton: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: '2px solid #e2e8f0',
    background: 'white',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleIcon: {
    fontSize: 20,
  },
  toggle: {
    textAlign: 'center',
    marginTop: 20,
    color: '#718096',
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#ff6b6b',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: 4,
  },
};
