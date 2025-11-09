// 資料管理ページ
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import MaterialTable from '../components/admin/MaterialTable';
import EditMaterialModal from '../components/admin/EditMaterialModal';
import DeleteConfirmDialog from '../components/admin/DeleteConfirmDialog';
import styles from '../css/AdminMaterials.module.css';

const AdminMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [deletingMaterial, setDeletingMaterial] = useState(null);
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

  useEffect(() => {
    // 検索とフィルター処理
    let filtered = [...materials];

    // 検索処理
    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.uploader.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 科目フィルター
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(m => m.subject === subjectFilter);
    }

    setFilteredMaterials(filtered);
  }, [materials, searchTerm, subjectFilter]);

  const fetchMaterials = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/materials`);
      
      if (!response.ok) {
        throw new Error('資料の取得に失敗しました');
      }
      
      const data = await response.json();
      setMaterials(data);
      setFilteredMaterials(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
  };

  const handleSaveEdit = async (id, formData) => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/admin/materials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('資料の更新に失敗しました');
      }

      await fetchMaterials();
      setEditingMaterial(null);
      alert('資料を更新しました');
    } catch (err) {
      alert('エラー: ' + err.message);
    }
  };

  const handleDelete = (material) => {
    setDeletingMaterial(material);
  };

  const handleConfirmDelete = async (id) => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/admin/materials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('資料の削除に失敗しました');
      }

      await fetchMaterials();
      setDeletingMaterial(null);
      alert('資料を削除しました');
    } catch (err) {
      alert('エラー: ' + err.message);
    }
  };

  // ユニークな科目一覧を取得
  const subjects = ['all', ...new Set(materials.map(m => m.subject))];

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
      <div className={styles.materialsPage}>
        <h1>資料管理</h1>

        {/* 検索・フィルター */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="タイトル、説明文、投稿者で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterBox}>
            <label htmlFor="subjectFilter">科目:</label>
            <select
              id="subjectFilter"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">すべて</option>
              {subjects.filter(s => s !== 'all').map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 資料テーブル */}
        <MaterialTable
          materials={filteredMaterials}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* 編集モーダル */}
        {editingMaterial && (
          <EditMaterialModal
            material={editingMaterial}
            onSave={handleSaveEdit}
            onClose={() => setEditingMaterial(null)}
          />
        )}

        {/* 削除確認ダイアログ */}
        {deletingMaterial && (
          <DeleteConfirmDialog
            material={deletingMaterial}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeletingMaterial(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMaterials;
