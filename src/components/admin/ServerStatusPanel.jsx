// サーバー状態表示パネルコンポーネント
import React, { useState, useEffect } from 'react';
import styles from '../../css/admin/ServerStatusPanel.module.css';

const ServerStatusPanel = () => {
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // サーバー状態を取得
  const fetchServerStatus = async () => {
    try {
      setLoading(true);
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/admin/server/status`);
      
      if (!response.ok) {
        throw new Error('サーバー情報の取得に失敗しました');
      }
      
      const data = await response.json();
      setServerStatus(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    // 30秒ごとに更新
    const interval = setInterval(fetchServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // ファイルサイズをフォーマット
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) {
    return <div className={styles.loading}>サーバー情報を読み込み中...</div>;
  }

  if (error) {
    return <div className={styles.error}>エラー: {error}</div>;
  }

  if (!serverStatus) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>サーバー稼働状況</h3>
        <button onClick={fetchServerStatus} className={styles.refreshButton}>
          更新
        </button>
      </div>

      <div className={styles.statusGrid}>
        <div className={styles.statusCard}>
          <h4>サーバー状態</h4>
          <p className={styles.statusRunning}>稼働中</p>
        </div>

        <div className={styles.statusCard}>
          <h4>データベース</h4>
          <p>資料数: {serverStatus.database.materialsCount}</p>
          <p className={styles.path}>{serverStatus.database.filePath}</p>
          <p className={styles.timestamp}>
            最終更新: {new Date(serverStatus.database.lastModified).toLocaleString('ja-JP')}
          </p>
        </div>

        <div className={styles.statusCard}>
          <h4>ストレージ</h4>
          <p>ファイル数: {serverStatus.storage.fileCount}</p>
          <p>合計サイズ: {formatFileSize(serverStatus.storage.totalSize)}</p>
          <p className={styles.path}>{serverStatus.storage.uploadDirectory}</p>
        </div>

        <div className={styles.statusCard}>
          <h4>管理者アカウント</h4>
          <p>ユーザー名: {serverStatus.adminAccount.username}</p>
          <p>表示名: {serverStatus.adminAccount.displayName}</p>
        </div>
      </div>

      <div className={styles.filesSection}>
        <h4>アップロードファイル一覧</h4>
        <div className={styles.filesList}>
          {serverStatus.storage.files.length === 0 ? (
            <p className={styles.noFiles}>ファイルがありません</p>
          ) : (
            <table className={styles.filesTable}>
              <thead>
                <tr>
                  <th>ファイル名</th>
                  <th>サイズ</th>
                  <th>作成日時</th>
                </tr>
              </thead>
              <tbody>
                {serverStatus.storage.files.map((file, index) => (
                  <tr key={index}>
                    <td className={styles.fileName}>{file.name}</td>
                    <td>{formatFileSize(file.size)}</td>
                    <td>{new Date(file.created).toLocaleString('ja-JP')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerStatusPanel;
