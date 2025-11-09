// 資料編集モーダルコンポーネント
import React, { useState, useEffect } from 'react';
import { SUBJECTS } from '../../utils/constants';
import styles from '../../css/admin/EditMaterialModal.module.css';

const EditMaterialModal = ({ material, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    uploader: '',
    tags: []
  });

  useEffect(() => {
    if (material) {
      setFormData({
        title: material.title || '',
        subject: material.subject || '',
        description: material.description || '',
        uploader: material.uploader || '',
        tags: material.tags || []
      });
    }
  }, [material]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(material.id, formData);
  };

  if (!material) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>資料を編集</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">タイトル *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">科目 *</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className={styles.select}
            >
              {SUBJECTS.map(subject => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">説明文</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="uploader">投稿者名 *</label>
            <input
              type="text"
              id="uploader"
              name="uploader"
              value={formData.uploader}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formInfo}>
            <p>ID: {material.id}</p>
            <p>ファイル名: {material.fileName}</p>
            <p>アップロード日時: {new Date(material.uploadDate).toLocaleString('ja-JP')}</p>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              キャンセル
            </button>
            <button type="submit" className={styles.saveButton}>
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaterialModal;
