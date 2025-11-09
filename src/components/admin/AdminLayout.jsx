// 管理者画面レイアウトコンポーネント
import React from 'react';
import AdminSidebar from './AdminSidebar';
import styles from '../../css/admin/AdminLayout.module.css';

const AdminLayout = ({ children }) => {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
