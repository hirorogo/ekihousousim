// 設定ページ
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import styles from '../css/AdminSettings.module.css';

const AdminSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 管理者認証チェック
    const isAdmin = localStorage.getItem('adminAuth') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // バリデーション
    if (newPassword !== confirmPassword) {
      setError('新しいパスワードが一致しません');
      return;
    }

    if (newPassword.length < 4) {
      setError('パスワードは4文字以上で入力してください');
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/admin/settings/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('パスワードを変更しました');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'パスワード変更に失敗しました');
      }
    } catch (err) {
      setError('サーバーエラー: ' + err.message);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.settingsPage}>
        <h1>設定</h1>

        {/* パスワード変更セクション */}
        <div className={styles.section}>
          <h2>パスワード変更</h2>
          <form onSubmit={handlePasswordChange} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword">現在のパスワード</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword">新しいパスワード</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={4}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">新しいパスワード（確認）</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={4}
                className={styles.input}
              />
            </div>

            {message && <div className={styles.success}>{message}</div>}
            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitButton}>
              パスワードを変更
            </button>
          </form>
        </div>

        {/* システム設定セクション */}
        <div className={styles.section}>
          <h2>システム設定</h2>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>最大ファイルサイズ:</span>
            <span className={styles.settingValue}>50MB</span>
          </div>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>許可するファイル形式:</span>
            <span className={styles.settingValue}>PDF, JPEG, PNG, TXT</span>
          </div>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>ページあたりの表示件数:</span>
            <span className={styles.settingValue}>20件</span>
          </div>
        </div>

        {/* アカウント情報セクション */}
        <div className={styles.section}>
          <h2>アカウント情報</h2>
          <div className={styles.accountInfo}>
            <p>ユーザー名: <strong>admin</strong></p>
            <p>表示名: <strong>管理者</strong></p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
