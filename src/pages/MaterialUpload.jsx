import React, { useState } from 'react';
import styles from '../css/MaterialUpload.module.css';
import { SUBJECTS } from '../utils/constants';

const MaterialUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: SUBJECTS[0].name,
    description: '',
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('アップロード:', formData);
    alert('資料をアップロードしました！');
    setFormData({
      title: '',
      subject: SUBJECTS[0].name,
      description: '',
      file: null,
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>資料アップロード</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>資料のタイトル</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="例: 2024年度 数学 中間テスト"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>科目</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
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
          <label className={styles.label}>説明</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="資料の説明を入力してください"
            rows="4"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>ファイルを選択</label>
          <input
            type="file"
            onChange={handleFileChange}
            className={styles.fileInput}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            required
          />
          {formData.file && (
            <p className={styles.fileName}>選択ファイル: {formData.file.name}</p>
          )}
        </div>

        <button type="submit" className={styles.submitBtn}>
          アップロード
        </button>
      </form>
    </div>
  );
};

export default MaterialUpload;
