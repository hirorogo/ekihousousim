// 統計カードコンポーネント
import React from 'react';
import styles from '../../css/admin/StatsCard.module.css';

const StatsCard = ({ title, value, icon, color = '#3498db' }) => {
  return (
    <div className={styles.statsCard} style={{ borderTopColor: color }}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <span className={styles.cardIcon}>{icon}</span>
      </div>
      <div className={styles.cardValue}>{value}</div>
    </div>
  );
};

export default StatsCard;
