import React, { useState } from 'react';
import styles from '../css/MaterialUpload.module.css';
import { SUBJECTS } from '../utils/constants';

// ダミー: ファイルをPDFに変換する関数（実際はサーバー/ワーカーで実装）
const convertToPDF = async (file) => {
  // TODO: 画像やWordファイルをPDFに変換する処理を実装
  // ここでは元ファイルをそのまま返す（ダミー）
  return file;
};

const MaterialUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: SUBJECTS[0].name,
    description: '',
    files: [], // 複数ファイル対応
  });
  const [uploading, setUploading] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState([]); // PDF変換後ファイル

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
      files: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    // すべてのファイルをPDFに変換
    const pdfFiles = await Promise.all(
      formData.files.map(async (file) => await convertToPDF(file))
    );
    setConvertedFiles(pdfFiles);
    // TODO: PDFファイルをアップロードする処理をここに実装
    // 将来的にOCR処理をここで呼び出し、本文テキストを抽出・保存
    // 例: const ocrText = await runOCR(pdfFile);
    setUploading(false);
    alert('資料をアップロードしました！（全ファイルPDF変換済み）');
    setFormData({
      title: '',
      subject: SUBJECTS[0].name,
      description: '',
      files: [],
    });
    setConvertedFiles([]);
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
          <label className={styles.label}>ファイルを選択（複数可・自動PDF変換）</label>
          <input
            type="file"
            onChange={handleFileChange}
            className={styles.fileInput}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            multiple
            required
          />
          {formData.files.length > 0 && (
            <ul className={styles.fileList}>
              {formData.files.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className={styles.submitBtn} disabled={uploading}>
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
        {/* PDF変換後ファイル名の表示（デバッグ用） */}
        {convertedFiles.length > 0 && (
          <div className={styles.convertedInfo}>
            <p>PDF変換済みファイル:</p>
            <ul>
              {convertedFiles.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default MaterialUpload;
