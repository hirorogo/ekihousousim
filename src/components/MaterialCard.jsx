import React from 'react';
import styles from '../css/MaterialCard.module.css';

const MaterialCard = ({ material }) => {
  const renderRating = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{material.title}</h3>
        <span className={styles.subject}>{material.subject}</span>
      </div>
      <p className={styles.description}>{material.description}</p>
      <div className={styles.cardFooter}>
        <div className={styles.rating}>
          {renderRating(material.rating)} {material.rating}/5.0
        </div>
        <div className={styles.meta}>
          <span className={styles.comments}>コメント: {material.comments}</span>
          <span className={styles.date}>{material.uploadDate}</span>
        </div>
      </div>
      <button className={styles.downloadBtn}>ダウンロード</button>
    </div>
  );
};

export default MaterialCard;
