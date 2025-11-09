// 管理者ログインページ
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/AdminLogin.module.css';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        // 認証成功
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        navigate('/admin');
      } else {
        setError(data.message || 'ログインに失敗しました');
      }
    } catch (err) {
      setError('サーバーに接続できません');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1>管理者ログイン</h1>
        <p className={styles.description}>管理者パネルにアクセスするにはパスワードを入力してください</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="管理者パスワードを入力"
              required
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className={styles.backLink}>
          <a href="/">← ホームに戻る</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
