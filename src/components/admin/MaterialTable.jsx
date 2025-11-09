// 資料一覧テーブルコンポーネント
import React, { useState } from 'react';
import styles from '../../css/admin/MaterialTable.module.css';

const MaterialTable = ({ materials, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ソート処理
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // データをソート
  const sortedMaterials = [...materials].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'uploadDate') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // ページネーション
  const totalPages = Math.ceil(sortedMaterials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMaterials = sortedMaterials.slice(startIndex, startIndex + itemsPerPage);

  // ファイルサイズをフォーマット
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // 日付をフォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} className={styles.sortable}>
              ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('title')} className={styles.sortable}>
              タイトル {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('subject')} className={styles.sortable}>
              科目 {sortField === 'subject' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('uploader')} className={styles.sortable}>
              投稿者 {sortField === 'uploader' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>IPアドレス</th>
            <th onClick={() => handleSort('fileSize')} className={styles.sortable}>
              サイズ {sortField === 'fileSize' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('uploadDate')} className={styles.sortable}>
              日時 {sortField === 'uploadDate' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('viewCount')} className={styles.sortable}>
              閲覧数 {sortField === 'viewCount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('downloadCount')} className={styles.sortable}>
              DL数 {sortField === 'downloadCount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {currentMaterials.map((material) => (
            <tr key={material.id}>
              <td>{material.id}</td>
              <td className={styles.titleCell}>{material.title}</td>
              <td>{material.subject}</td>
              <td>{material.uploader}</td>
              <td className={styles.ipCell}>{material.ipAddress || '未記録'}</td>
              <td>{formatFileSize(material.fileSize)}</td>
              <td>{formatDate(material.uploadDate)}</td>
              <td>{material.viewCount || 0}</td>
              <td>{material.downloadCount || 0}</td>
              <td className={styles.actionCell}>
                <button 
                  className={styles.editButton}
                  onClick={() => onEdit(material)}
                >
                  編集
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => onDelete(material)}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ページネーション */}
      <div className={styles.pagination}>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          前へ
        </button>
        <span className={styles.pageInfo}>
          {currentPage} / {totalPages} ページ ({materials.length}件)
        </span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          次へ
        </button>
      </div>
    </div>
  );
};

export default MaterialTable;
