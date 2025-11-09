// 管理者サイドバーナビゲーションコンポーネント
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from '../../css/admin/AdminSidebar.module.css';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

  // アクティブなリンクを判定
  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>管理者パネル</h2>
      </div>
      
      <nav className={styles.navigation}>
        <Link to="/admin" className={`${styles.navItem} ${isActive('/admin')}`}>
          <span className={styles.icon}>📊</span>
          <span>ダッシュボード</span>
        </Link>
        
        <Link to="/admin/materials" className={`${styles.navItem} ${isActive('/admin/materials')}`}>
          <span className={styles.icon}>📚</span>
          <span>資料管理</span>
        </Link>
        
        <Link to="/admin/statistics" className={`${styles.navItem} ${isActive('/admin/statistics')}`}>
          <span className={styles.icon}>📈</span>
          <span>統計情報</span>
        </Link>
        
        <Link to="/admin/settings" className={`${styles.navItem} ${isActive('/admin/settings')}`}>
          <span className={styles.icon}>⚙️</span>
          <span>設定</span>
        </Link>
        
        <div className={styles.divider}></div>
        
        <Link to="/" className={styles.navItem}>
          <span className={styles.icon}>🏠</span>
          <span>ホームに戻る</span>
        </Link>
        
        <button onClick={handleLogout} className={styles.logoutButton}>
          <span className={styles.icon}>🚪</span>
          <span>ログアウト</span>
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
