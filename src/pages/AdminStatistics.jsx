// 統計情報ページ
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import styles from '../css/AdminStatistics.module.css';

const AdminStatistics = () => {
  const [materials, setMaterials] = useState([]);
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

    fetchMaterials();
  }, [navigate]);

  const fetchMaterials = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/materials`);
      
      if (!response.ok) {
        throw new Error('資料の取得に失敗しました');
      }
      
      const data = await response.json();
      setMaterials(data);
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

  // 閲覧数ランキング（TOP 10）
  const viewRanking = [...materials]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 10);

  // ダウンロード数ランキング（TOP 10）
  const downloadRanking = [...materials]
    .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
    .slice(0, 10);

  // 最新アップロードランキング（TOP 10）
  const recentRanking = [...materials]
    .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
    .slice(0, 10);

  return (
    <AdminLayout>
      <div className={styles.statisticsPage}>
        <h1>統計情報</h1>

        {/* 閲覧数ランキング */}
        <div className={styles.section}>
          <h2>閲覧数ランキング（TOP 10）</h2>
          <div className={styles.ranking}>
            {viewRanking.length === 0 ? (
              <p className={styles.noData}>データがありません</p>
            ) : (
              <table className={styles.rankingTable}>
                <thead>
                  <tr>
                    <th>順位</th>
                    <th>タイトル</th>
                    <th>科目</th>
                    <th>閲覧数</th>
                    <th>アップロード日</th>
                  </tr>
                </thead>
                <tbody>
                  {viewRanking.map((material, index) => (
                    <tr key={material.id}>
                      <td className={styles.rank}>{index + 1}</td>
                      <td className={styles.titleCell}>{material.title}</td>
                      <td>{material.subject}</td>
                      <td className={styles.count}>{material.viewCount || 0}回</td>
                      <td>{new Date(material.uploadDate).toLocaleDateString('ja-JP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ダウンロード数ランキング */}
        <div className={styles.section}>
          <h2>ダウンロード数ランキング（TOP 10）</h2>
          <div className={styles.ranking}>
            {downloadRanking.length === 0 ? (
              <p className={styles.noData}>データがありません</p>
            ) : (
              <table className={styles.rankingTable}>
                <thead>
                  <tr>
                    <th>順位</th>
                    <th>タイトル</th>
                    <th>科目</th>
                    <th>ダウンロード数</th>
                    <th>アップロード日</th>
                  </tr>
                </thead>
                <tbody>
                  {downloadRanking.map((material, index) => (
                    <tr key={material.id}>
                      <td className={styles.rank}>{index + 1}</td>
                      <td className={styles.titleCell}>{material.title}</td>
                      <td>{material.subject}</td>
                      <td className={styles.count}>{material.downloadCount || 0}回</td>
                      <td>{new Date(material.uploadDate).toLocaleDateString('ja-JP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 最新アップロードランキング */}
        <div className={styles.section}>
          <h2>最新アップロードランキング（TOP 10）</h2>
          <div className={styles.ranking}>
            {recentRanking.length === 0 ? (
              <p className={styles.noData}>データがありません</p>
            ) : (
              <table className={styles.rankingTable}>
                <thead>
                  <tr>
                    <th>順位</th>
                    <th>タイトル</th>
                    <th>科目</th>
                    <th>投稿者</th>
                    <th>アップロード日時</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRanking.map((material, index) => (
                    <tr key={material.id}>
                      <td className={styles.rank}>{index + 1}</td>
                      <td className={styles.titleCell}>{material.title}</td>
                      <td>{material.subject}</td>
                      <td>{material.uploader}</td>
                      <td>{new Date(material.uploadDate).toLocaleString('ja-JP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;
