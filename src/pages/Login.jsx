// ログインページコンポーネント（サイトアクセス認証）
import React, { useState } from 'react';
import styles from '../css/Login.module.css';

const Login = ({ onAuthenticated, requiredPassword }) => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  // ログイン処理
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (password === requiredPassword) {
      setIsLoggedIn(true);
      onAuthenticated();
    } else {
      setError('パスワードが間違っています');
      setPassword('');
    }
  };

  // ログイン成功時の表示
  if (isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <h1 className={styles.title}>アクセス許可</h1>
          <p className={styles.successMessage}>サイトへのアクセスが許可されました</p>
        </div>
      </div>
    );
  }

  // ログインフォームの表示
  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>サイトアクセス</h1>
        <p className={styles.description}>パスワードを入力してアクセスしてください</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="パスワードを入力"
              autoFocus
              required
            />
            {error && <span className={styles.error}>{error}</span>}
          </div>
          <button type="submit" className={styles.loginButton}>
            アクセス
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;