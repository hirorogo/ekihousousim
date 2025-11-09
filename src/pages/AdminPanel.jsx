// 管理者ダッシュボードページ
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import StatsCard from '../components/admin/StatsCard';
import ServerStatusPanel from '../components/admin/ServerStatusPanel';
import styles from '../css/AdminPanel.module.css';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 管理者認証チェック
    const isAdmin = localStorage.getItem('adminAuth') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/admin/dashboard/stats`);
      
      if (!response.ok) {
        throw new Error('統計情報の取得に失敗しました');
      }
      
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>データを読み込み中...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className={styles.error}>エラー: {error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <h1>ダッシュボード</h1>

        {/* 統計カード */}
        <div className={styles.statsGrid}>
          <StatsCard
            title="総資料数"
            value={stats.totalMaterials}
            icon="📚"
            color="#3498db"
          />
          <StatsCard
            title="総閲覧数"
            value={stats.totalViews}
            icon="👁️"
            color="#9b59b6"
          />
          <StatsCard
            title="総ダウンロード数"
            value={stats.totalDownloads}
            icon="⬇️"
            color="#e67e22"
          />
          <StatsCard
            title="アクティブ科目数"
            value={Object.keys(stats.subjectStats).length}
            icon="📖"
            color="#27ae60"
          />
        </div>

        {/* 科目別統計 */}
        <div className={styles.section}>
          <h2>科目別資料数</h2>
          <div className={styles.subjectStats}>
            {Object.entries(stats.subjectStats).map(([subject, count]) => (
              <div key={subject} className={styles.subjectItem}>
                <span className={styles.subjectName}>{subject}</span>
                <span className={styles.subjectCount}>{count}件</span>
              </div>
            ))}
          </div>
        </div>

        {/* ファイル形式別統計 */}
        <div className={styles.section}>
          <h2>ファイル形式別資料数</h2>
          <div className={styles.fileTypeStats}>
            {Object.entries(stats.fileTypeStats).map(([type, count]) => (
              <div key={type} className={styles.fileTypeItem}>
                <span className={styles.fileTypeName}>{type}</span>
                <span className={styles.fileTypeCount}>{count}件</span>
              </div>
            ))}
          </div>
        </div>

        {/* 最近のアップロード */}
        <div className={styles.section}>
          <h2>最近のアップロード（最新10件）</h2>
          <div className={styles.recentUploads}>
            {stats.recentUploads.length === 0 ? (
              <p className={styles.noData}>アップロードがありません</p>
            ) : (
              <table className={styles.uploadsTable}>
                <thead>
                  <tr>
                    <th>タイトル</th>
                    <th>科目</th>
                    <th>投稿者</th>
                    <th>IPアドレス</th>
                    <th>日時</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUploads.map((upload) => (
                    <tr key={upload.id}>
                      <td className={styles.titleCell}>{upload.title}</td>
                      <td>{upload.subject}</td>
                      <td>{upload.uploader}</td>
                      <td className={styles.ipCell}>{upload.ipAddress}</td>
                      <td>{new Date(upload.uploadDate).toLocaleString('ja-JP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* サーバー状態パネル */}
        <div className={styles.section}>
          <ServerStatusPanel />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;
