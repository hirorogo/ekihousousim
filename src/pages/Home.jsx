import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Home.module.css';
import { SUBJECTS } from '../utils/constants';

const Home = () => {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>テスト過去問・プリント共有サイト</h1>
        <p className={styles.heroSubtitle}>
          高校生と教師のための資料共有プラットフォーム
        </p>
        <Link to="/materials" className={styles.ctaButton}>
          資料を探す
        </Link>
      </section>

      <section className={styles.features}>
        <h2>主な機能</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>アップロード・ダウンロード</h3>
            <p>過去問やプリントを簡単にアップロード・ダウンロード</p>
          </div>
          <div className={styles.featureCard}>
            <h3>科目で整理</h3>
            <p>複数の科目から資料を検索・整理</p>
          </div>
          <div className={styles.featureCard}>
            <h3>評価・コメント</h3>
            <p>資料に評価やコメントを付けて情報共有</p>
          </div>
        </div>
      </section>

      <section className={styles.subjects}>
        <h2>対応科目</h2>
        <div className={styles.subjectGrid}>
          {SUBJECTS.map(subject => (
            <Link
              key={subject.id}
              to={`/materials?subject=${subject.name}`}
              className={styles.subjectTag}
              style={{ backgroundColor: subject.color }}
            >
              {subject.name}
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>今すぐ始める</h2>
        <div className={styles.ctaButtons}>
          <Link to="/materials/upload" className={styles.primaryBtn}>
            資料をアップロード
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;