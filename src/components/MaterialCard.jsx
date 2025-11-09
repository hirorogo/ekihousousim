import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/constants';
import styles from '../css/MaterialCard.module.css';

const MaterialCard = ({ material }) => {
  const navigate = useNavigate();

  // 詳細ページへのナビゲーション
  const handleViewDetails = () => {
    navigate(`/materials/${material.id}`);
  };

  // ダウンロード処理
  const handleDownload = (e) => {
    e.stopPropagation(); // カード全体のクリックイベントを防止
    const link = document.createElement('a');
    link.href = `${API_BASE_URL}${material.filePath}`;
    link.download = material.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF.jsビューアーで開く処理
  const handleViewInPdfJs = (e) => {
    e.stopPropagation(); // カード全体のクリックイベントを防止
    const fileUrl = `${API_BASE_URL}${material.filePath}`;
    const pdfViewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
    window.open(pdfViewerUrl, '_blank');
  };

  // ファイルタイプがPDFかどうかを判定
  const isPdfFile = material.fileName.toLowerCase().endsWith('.pdf');

  // ファイルサイズの表示用フォーマット
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // アップロード日時のフォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <div className={styles.card} onClick={handleViewDetails}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{material.title}</h3>
        <span className={`${styles.subject} ${styles[`subject${material.subject}`]}`}>
          {material.subject}
        </span>
      </div>
      
      {material.description && (
        <p className={styles.description}>{material.description}</p>
      )}
      
      <div className={styles.cardFooter}>
        <div className={styles.metadata}>
          <div className={styles.stats}>
            <span className={styles.views}>閲覧: {material.viewCount}</span>
            <span className={styles.downloads}>DL: {material.downloadCount}</span>
          </div>
        </div>
        <div className={styles.uploadInfo}>
          <span className={styles.uploader}>by {material.uploader}</span>
          <span className={styles.date}>{formatDate(material.uploadDate)}</span>
        </div>
      </div>
      
      <div className={styles.actions}>
        <button 
          className={styles.viewBtn}
          onClick={handleViewDetails}
        >
          詳細を見る
        </button>
        {isPdfFile && (
          <button 
            className={styles.viewerBtn}
            onClick={handleViewInPdfJs}
            title="PDF.jsビューアーで開く"
          >
            閲覧
          </button>
        )}
        <button 
          className={styles.downloadBtn}
          onClick={handleDownload}
        >
          ダウンロード
        </button>
      </div>
    </div>
  );
};

export default MaterialCard;
