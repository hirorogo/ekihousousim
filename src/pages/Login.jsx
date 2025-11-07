import React, { useState } from 'react';
import styles from '../css/Login.module.css';

const Login = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    if (password === '123') {
      setIsLoggedIn(true);
    } else {
      alert('パスワードが間違っています');
    }
  };

  if (isLoggedIn) {
    return (
      <div className={styles.container}>
        <h1>ログイン成功</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <label>パスワードを入力</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>ログイン</button>
    </div>
  );
};

export default Login;