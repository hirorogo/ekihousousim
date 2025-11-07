import React from 'react';
import styles from '../css/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p>&copy; 2024 テスト過去問・プリント共有サイト。All rights reserved.</p>
        <nav className={styles.footerNav}>
          <a href="#about">概要</a>
          <a href="#contact">お問い合わせ</a>
          <a href="#privacy">プライバシーポリシー</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
