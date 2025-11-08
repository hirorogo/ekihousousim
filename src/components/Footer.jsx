import React from 'react';
import styles from '../css/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <nav className={styles.footerNav}>
          <a href="#about">概要</a>
          <a href="#contact">お問い合わせ</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
