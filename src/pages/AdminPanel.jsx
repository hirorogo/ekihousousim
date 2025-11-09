import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { API_ENDPOINTS } from '../utils/constants';
import { apiRequest } from '../utils/api';
import styles from '../css/AdminPanel.module.css';

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('materials');
  const [editingItem, setEditingItem] = useState(null);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalUsers: 0,
    totalViews: 0,
    totalDownloads: 0
  });

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [materialsRes, usersRes] = await Promise.all([
        apiRequest(API_ENDPOINTS.materials),
        apiRequest(API_ENDPOINTS.users)
      ]);

      setMaterials(materialsRes);
      setUsers(usersRes);

      // 統計情報の計算
      const totalViews = materialsRes.reduce((sum, material) => sum + (material.viewCount || 0), 0);
      const totalDownloads = materialsRes.reduce((sum, material) => sum + (material.downloadCount || 0), 0);
      
      setStats({
        totalMaterials: materialsRes.length,
        totalUsers: usersRes.length,
        totalViews,
        totalDownloads
      });
    } catch (err) {
      setError('データの読み込みに失敗しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (id) => {
    if (!confirm('この資料を削除しますか？')) return;
    
    try {
      await apiRequest(`${API_ENDPOINTS.materials}/${id}`, {
        method: 'DELETE'
      });
      setMaterials(materials.filter(m => m.id !== id));
    } catch (err) {
      setError('削除に失敗しました: ' + err.message);
    }
  };

  const updateMaterial = async (id, updatedData) => {
    try {
      const updated = await apiRequest(`${API_ENDPOINTS.materials}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      });
      setMaterials(materials.map(m => m.id === id ? updated : m));
      setEditingItem(null);
    } catch (err) {
      setError('更新に失敗しました: ' + err.message);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('このユーザーを削除しますか？')) return;
    
    try {
      await apiRequest(`${API_ENDPOINTS.users}/${id}`, {
        method: 'DELETE'
      });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      setError('ユーザー削除に失敗しました: ' + err.message);
    }
  };

  const updateUser = async (id, updatedData) => {
    try {
      const updated = await apiRequest(`${API_ENDPOINTS.users}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      });
      setUsers(users.map(u => u.id === id ? updated : u));
      setEditingItem(null);
    } catch (err) {
      setError('ユーザー更新に失敗しました: ' + err.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <h2>アクセス拒否</h2>
          <p>この機能を利用するには管理者権限が必要です。</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>管理者パネル</h1>
        <p>システム全体のデータを管理できます</p>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* 統計カード */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>総資料数</h3>
          <div className={styles.statNumber}>{stats.totalMaterials}</div>
        </div>
        <div className={styles.statCard}>
          <h3>総ユーザー数</h3>
          <div className={styles.statNumber}>{stats.totalUsers}</div>
        </div>
        <div className={styles.statCard}>
          <h3>総閲覧数</h3>
          <div className={styles.statNumber}>{stats.totalViews.toLocaleString()}</div>
        </div>
        <div className={styles.statCard}>
          <h3>総ダウンロード数</h3>
          <div className={styles.statNumber}>{stats.totalDownloads.toLocaleString()}</div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className={styles.tabNav}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'materials' ? styles.active : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          資料管理
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          ユーザー管理
        </button>
      </div>

      {/* 資料管理タブ */}
      {activeTab === 'materials' && (
        <div className={styles.tabContent}>
          <div className={styles.sectionHeader}>
            <h2>資料管理</h2>
            <button className={styles.refreshBtn} onClick={loadData}>
              更新
            </button>
          </div>
          
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div>ID</div>
              <div>タイトル</div>
              <div>科目</div>
              <div>ファイル名</div>
              <div>サイズ</div>
              <div>アップロード者</div>
              <div>アップロード日</div>
              <div>閲覧数</div>
              <div>DL数</div>
              <div>操作</div>
            </div>
            
            {materials.map(material => (
              <div key={material.id} className={styles.tableRow}>
                {editingItem === material.id ? (
                  <EditMaterialRow 
                    material={material} 
                    onSave={(data) => updateMaterial(material.id, data)}
                    onCancel={() => setEditingItem(null)}
                  />
                ) : (
                  <>
                    <div>{material.id}</div>
                    <div>{material.title}</div>
                    <div>{material.subject}</div>
                    <div>{material.fileName}</div>
                    <div>{formatFileSize(material.fileSize)}</div>
                    <div>{material.uploader}</div>
                    <div>{formatDate(material.uploadDate)}</div>
                    <div>{material.viewCount}</div>
                    <div>{material.downloadCount}</div>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editBtn}
                        onClick={() => setEditingItem(material.id)}
                      >
                        編集
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => deleteMaterial(material.id)}
                      >
                        削除
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ユーザー管理タブ */}
      {activeTab === 'users' && (
        <div className={styles.tabContent}>
          <div className={styles.sectionHeader}>
            <h2>ユーザー管理</h2>
            <button className={styles.refreshBtn} onClick={loadData}>
              更新
            </button>
          </div>
          
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div>ID</div>
              <div>ユーザー名</div>
              <div>メールアドレス</div>
              <div>登録日</div>
              <div>最終ログイン</div>
              <div>役割</div>
              <div>操作</div>
            </div>
            
            {users.map(user => (
              <div key={user.id} className={styles.tableRow}>
                {editingItem === `user-${user.id}` ? (
                  <EditUserRow 
                    user={user} 
                    onSave={(data) => updateUser(user.id, data)}
                    onCancel={() => setEditingItem(null)}
                  />
                ) : (
                  <>
                    <div>{user.id}</div>
                    <div>{user.username}</div>
                    <div>{user.email}</div>
                    <div>{formatDate(user.registrationDate)}</div>
                    <div>{user.lastLogin ? formatDate(user.lastLogin) : '-'}</div>
                    <div>{user.role || 'user'}</div>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editBtn}
                        onClick={() => setEditingItem(`user-${user.id}`)}
                      >
                        編集
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => deleteUser(user.id)}
                      >
                        削除
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 資料編集用行コンポーネント
const EditMaterialRow = ({ material, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: material.title,
    subject: material.subject,
    description: material.description,
    uploader: material.uploader
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div>{material.id}</div>
      <div>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className={styles.editInput}
        />
      </div>
      <div>
        <select
          value={formData.subject}
          onChange={(e) => setFormData({...formData, subject: e.target.value})}
          className={styles.editSelect}
        >
          <option value="数学">数学</option>
          <option value="英語">英語</option>
          <option value="言語文化">言語文化</option>
          <option value="物理">物理</option>
          <option value="科学と人間生活">科学と人間生活</option>
          <option value="電気回路">電気回路</option>
          <option value="その他">その他</option>
          <option value="配布プリント">配布プリント</option>
        </select>
      </div>
      <div>{material.fileName}</div>
      <div>{material.fileSize}</div>
      <div>
        <input
          type="text"
          value={formData.uploader}
          onChange={(e) => setFormData({...formData, uploader: e.target.value})}
          className={styles.editInput}
        />
      </div>
      <div>{material.uploadDate}</div>
      <div>{material.viewCount}</div>
      <div>{material.downloadCount}</div>
      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn}>保存</button>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </form>
  );
};

// ユーザー編集用行コンポーネント  
const EditUserRow = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    role: user.role || 'user'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div>{user.id}</div>
      <div>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          className={styles.editInput}
        />
      </div>
      <div>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={styles.editInput}
        />
      </div>
      <div>{user.registrationDate}</div>
      <div>{user.lastLogin || '-'}</div>
      <div>
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          className={styles.editSelect}
        >
          <option value="user">一般ユーザー</option>
          <option value="teacher">教師</option>
          <option value="admin">管理者</option>
        </select>
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn}>保存</button>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </form>
  );
};

export default AdminPanel;
