// 資料詳細ページコンポーネント
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileViewer from '../components/FileViewer';
import { getMaterial } from '../utils/api';
import { API_BASE_URL } from '../utils/constants';
import styles from '../css/MaterialDetail.module.css';

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 資料データの取得
  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        const materialData = await getMaterial(id);
        setMaterial(materialData);
        setError(null);
      } catch (err) {
        console.error('資料取得エラー:', err);
        setError('資料の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMaterial();
    }
  }, [id]);

  // ダウンロード処理
  const handleDownload = () => {
    if (material) {
      const link = document.createElement('a');
      link.href = `${API_BASE_URL}${material.filePath}`;
      link.download = material.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 戻るボタン処理
  const handleBack = () => {
    navigate('/materials');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>資料を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>エラー</h2>
          <p>{error}</p>
          <button onClick={handleBack} className={styles.backButton}>
            資料一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>資料が見つかりません</h2>
          <p>指定された資料は存在しないか、削除されています。</p>
          <button onClick={handleBack} className={styles.backButton}>
            資料一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 資料情報ヘッダー */}
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <button onClick={handleBack} className={styles.breadcrumbButton}>
            資料一覧
          </button>
          <span className={styles.breadcrumbSeparator}> &gt; </span>
          <span className={styles.breadcrumbCurrent}>{material.title}</span>
        </div>
        
        <div className={styles.materialInfo}>
          <h1 className={styles.title}>{material.title}</h1>
          
          <div className={styles.metadata}>
            <div className={styles.metadataItem}>
              <span className={styles.label}>科目:</span>
              <span className={`${styles.subject} ${styles[`subject${material.subject}`]}`}>
                {material.subject}
              </span>
            </div>
            
            <div className={styles.metadataItem}>
              <span className={styles.label}>アップロード者:</span>
              <span className={styles.value}>{material.uploader}</span>
            </div>
            
            <div className={styles.metadataItem}>
              <span className={styles.label}>アップロード日:</span>
              <span className={styles.value}>
                {new Date(material.uploadDate).toLocaleDateString('ja-JP')}
              </span>
            </div>
            
            <div className={styles.metadataItem}>
              <span className={styles.label}>ファイルサイズ:</span>
              <span className={styles.value}>
                {(material.fileSize / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            
            <div className={styles.metadataItem}>
              <span className={styles.label}>ファイル形式:</span>
              <span className={styles.value}>{material.fileType}</span>
            </div>
          </div>
          
          {material.description && (
            <div className={styles.description}>
              <h3>説明</h3>
              <p>{material.description}</p>
            </div>
          )}
          
          <div className={styles.actions}>
            <button onClick={handleDownload} className={styles.downloadButton}>
              ダウンロード
            </button>
            <button onClick={handleBack} className={styles.backButton}>
              戻る
            </button>
          </div>
        </div>
      </div>

      {/* ファイルビューアー */}
      <div className={styles.viewerSection}>
        <h2 className={styles.viewerTitle}>ファイルプレビュー</h2>
        <FileViewer 
          fileUrl={`${API_BASE_URL}${material.filePath}`}
          fileName={material.fileName}
          fileType={material.fileType}
        />
      </div>
    </div>
  );
};

export default MaterialDetail;
