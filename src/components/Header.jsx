import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Header.module.css';

const Header = () => {
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
