// 資料アップロードページコンポーネント（複数ファイル対応・フロントエンドOCR機能付き）
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import styles from '../css/MaterialUpload.module.css';
import { SUBJECTS } from '../utils/constants';

// ダミー: ファイルをPDFに変換する関数（実際はサーバー/ワーカーで実装）
const convertToPDF = async (file) => {
  // TODO: 画像やWordファイルをPDFに変換する処理を実装
  // ここでは元ファイルをそのまま返す（ダミー）
  return file;
};

// フロントエンドOCR関数（tesseract.js使用）
const runOCR = async (file, onProgress) => {
  try {
    const worker = await Tesseract.createWorker('jpn', 1, {
      logger: m => {
        if (onProgress && m.status === 'recognizing text') {
          onProgress(Math.round(m.progress * 100));
        }
      }
    });
    const { data: { text } } = await worker.recognize(file);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('OCRエラー:', error);
    throw new Error('OCR処理に失敗しました');
  }
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
  const [enableOCR, setEnableOCR] = useState(false); // OCR実行フラグ
  const [ocrResults, setOcrResults] = useState([]); // OCR結果
  const [ocrProgress, setOcrProgress] = useState({}); // OCR進捗

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
    
    try {
      // すべてのファイルをPDFに変換
      const pdfFiles = await Promise.all(
        formData.files.map(async (file) => await convertToPDF(file))
      );
      setConvertedFiles(pdfFiles);
      
      // OCRが有効な場合、テキスト抽出を実行
      if (enableOCR) {
        const ocrResultsArray = [];
        for (let i = 0; i < formData.files.length; i++) {
          const file = formData.files[i];
          // 画像ファイルのみOCR実行
          if (file.type.startsWith('image/')) {
            try {
              setOcrProgress(prev => ({ ...prev, [i]: 0 }));
              const text = await runOCR(file, (progress) => {
                setOcrProgress(prev => ({ ...prev, [i]: progress }));
              });
              ocrResultsArray.push({ fileName: file.name, text, success: true });
            } catch (error) {
              ocrResultsArray.push({ 
                fileName: file.name, 
                text: `エラー: ${error.message}`, 
                success: false 
              });
            }
          } else {
            ocrResultsArray.push({ 
              fileName: file.name, 
              text: '画像ファイルではないためOCR処理をスキップしました', 
              success: false 
            });
          }
        }
        setOcrResults(ocrResultsArray);
      }
      
      // TODO: PDFファイルをアップロードする処理をここに実装
      setUploading(false);
      alert(`資料をアップロードしました！${enableOCR ? '（OCR処理完了）' : ''}`);
      
      // フォームリセット
      setFormData({
        title: '',
        subject: SUBJECTS[0].name,
        description: '',
        files: [],
      });
      setConvertedFiles([]);
      setOcrResults([]);
      setOcrProgress({});
    } catch (error) {
      console.error('アップロードエラー:', error);
      alert('アップロードに失敗しました');
      setUploading(false);
    }
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
                <li key={idx}>
                  {file.name}
                  {file.type.startsWith('image/') && (
                    <span className={styles.ocrIndicator}>（OCR対応）</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* OCRオプション */}
        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={enableOCR}
              onChange={(e) => setEnableOCR(e.target.checked)}
              className={styles.checkbox}
            />
            OCR（光学文字認識）を実行して画像からテキストを抽出する
          </label>
          <p className={styles.ocrNote}>
            ※ 画像ファイルから文字を読み取り、検索可能にします。処理に時間がかかる場合があります。
          </p>
        </div>
        <button type="submit" className={styles.submitBtn} disabled={uploading}>
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
        
        {/* OCR進捗表示 */}
        {uploading && enableOCR && Object.keys(ocrProgress).length > 0 && (
          <div className={styles.ocrProgressContainer}>
            <h3>OCR処理進捗</h3>
            {Object.entries(ocrProgress).map(([index, progress]) => (
              <div key={index} className={styles.progressItem}>
                <span>{formData.files[index]?.name}</span>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span>{progress}%</span>
              </div>
            ))}
          </div>
        )}
        
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
        
        {/* OCR結果表示 */}
        {ocrResults.length > 0 && (
          <div className={styles.ocrResultsContainer}>
            <h3>OCR処理結果</h3>
            {ocrResults.map((result, idx) => (
              <div key={idx} className={styles.ocrResult}>
                <h4>{result.fileName}</h4>
                <div className={`${styles.ocrText} ${result.success ? styles.success : styles.error}`}>
                  <pre>{result.text}</pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default MaterialUpload;
