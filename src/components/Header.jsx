import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from '../css/Header.module.css';

const Header = () => {
  const { user, isAdmin, adminLogin, logout } = useAuth();

  const handleAdminLogin = () => {
    const password = prompt('管理者パスワードを入力してください:');
    if (adminLogin(password)) {
      alert('管理者としてログインしました');
      window.location.reload();
    } else {
      alert('パスワードが正しくありません');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logo}>
          テスト共有
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>ホーム</Link>
          <Link to="/materials" className={styles.navLink}>資料一覧</Link>
          <Link to="/materials/upload" className={styles.navLink}>アップロード</Link>
          {isAdmin && (
            <Link to="/admin" className={`${styles.navLink} ${styles.adminLink}`}>
              管理者パネル
            </Link>
          )}
        </nav>
        <div className={styles.rightNav}>
          {user && (
            <span className={styles.userInfo}>
              {user.nickname || user.email}
              {isAdmin && ' (管理者)'}
            </span>
          )}
          {!isAdmin ? (
            <button 
              className={styles.adminBtn}
              onClick={handleAdminLogin}
            >
              管理者
            </button>
          ) : (
            <button 
              className={styles.logoutBtn}
              onClick={() => {
                logout();
                window.location.reload();
              }}
            >
              ログアウト
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
