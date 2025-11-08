// 資料アップロードページコンポーネント（複数ファイル対応・フロントエンドOCR・PDF変換機能付き）
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { PDFDocument, rgb } from 'pdf-lib';
import styles from '../css/MaterialUpload.module.css';
import { SUBJECTS } from '../utils/constants';

// フロントエンドPDF変換関数（進捗表示対応）
const convertToPDF = async (file, onProgress) => {
  try {
    if (file.type === 'application/pdf') {
      // 既にPDFの場合はそのまま返す
      if (onProgress) onProgress(100);
      return file;
    }

    const pdfDoc = await PDFDocument.create();
    
    if (onProgress) onProgress(20);
    
    if (file.type.startsWith('image/')) {
      // 画像ファイルの場合
      const arrayBuffer = await file.arrayBuffer();
      let image;
      
      if (onProgress) onProgress(40);
      
      if (file.type === 'image/png') {
        image = await pdfDoc.embedPng(arrayBuffer);
      } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        image = await pdfDoc.embedJpg(arrayBuffer);
      } else {
        throw new Error('サポートされていない画像形式です');
      }
      
      if (onProgress) onProgress(60);
      
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const imageAspectRatio = image.width / image.height;
      const pageAspectRatio = width / height;
      
      let imageWidth, imageHeight;
      if (imageAspectRatio > pageAspectRatio) {
        imageWidth = width - 40;
        imageHeight = imageWidth / imageAspectRatio;
      } else {
        imageHeight = height - 40;
        imageWidth = imageHeight * imageAspectRatio;
      }
      
      const x = (width - imageWidth) / 2;
      const y = (height - imageHeight) / 2;
      
      page.drawImage(image, {
        x,
        y,
        width: imageWidth,
        height: imageHeight,
      });
      
      if (onProgress) onProgress(80);
    } else if (file.type.includes('document') || file.type.includes('word')) {
      // Wordファイル等のテキストファイル（簡易対応）
      try {
        const text = await file.text();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        
        page.drawText(text, {
          x: 50,
          y: height - 50,
          size: 12,
          color: rgb(0, 0, 0),
          maxWidth: width - 100,
        });
        
        if (onProgress) onProgress(80);
      } catch (error) {
        throw new Error('テキストファイルの読み込みに失敗しました');
      }
    } else {
      throw new Error('サポートされていないファイル形式です。画像またはPDFファイルを選択してください。');
    }
    
    const pdfBytes = await pdfDoc.save();
    if (onProgress) onProgress(100);
    
    // PDFファイルとして新しいFileオブジェクトを作成
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfFileName = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
    return new File([pdfBlob], pdfFileName, { type: 'application/pdf' });
    
  } catch (error) {
    console.error('PDF変換エラー:', error);
    throw new Error(`PDF変換に失敗しました: ${error.message}`);
  }
};

// 複数PDFファイルを一つに結合する関数（進捗表示対応）
const mergePDFs = async (pdfFiles, onProgress, title = '結合された資料') => {
  try {
    if (pdfFiles.length === 1) {
      if (onProgress) onProgress(100);
      return pdfFiles[0];
    }
    
    const mergedPdf = await PDFDocument.create();
    
    for (let i = 0; i < pdfFiles.length; i++) {
      const file = pdfFiles[i];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      
      copiedPages.forEach((page) => mergedPdf.addPage(page));
      
      if (onProgress) {
        onProgress(Math.round(((i + 1) / pdfFiles.length) * 100));
      }
    }
    
    // メタデータを設定
    mergedPdf.setTitle(title);
    mergedPdf.setCreator('テスト過去問・プリント共有サイト');
    mergedPdf.setCreationDate(new Date());
    
    const mergedPdfBytes = await mergedPdf.save();
    
    // 結合されたファイル名を生成
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const fileName = `${title}_${timestamp}.pdf`;
    
    return new File([mergedPdfBytes], fileName, { type: 'application/pdf' });
    
  } catch (error) {
    console.error('PDF結合エラー:', error);
    throw new Error(`PDF結合に失敗しました: ${error.message}`);
  }
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
  const [mergedPdf, setMergedPdf] = useState(null); // 結合されたPDFファイル
  const [enableOCR, setEnableOCR] = useState(false); // OCR実行フラグ
  const [enableMerge, setEnableMerge] = useState(true); // PDF結合フラグ
  const [ocrResults, setOcrResults] = useState([]); // OCR結果
  const [ocrProgress, setOcrProgress] = useState({}); // OCR進捗
  const [pdfProgress, setPdfProgress] = useState({}); // PDF変換進捗
  const [mergeProgress, setMergeProgress] = useState(0); // PDF結合進捗

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
      // 1. すべてのファイルをPDFに変換（進捗表示付き）
      const pdfFiles = [];
      for (let i = 0; i < formData.files.length; i++) {
        const file = formData.files[i];
        setPdfProgress(prev => ({ ...prev, [i]: 0 }));
        
        try {
          const pdfFile = await convertToPDF(file, (progress) => {
            setPdfProgress(prev => ({ ...prev, [i]: progress }));
          });
          pdfFiles.push(pdfFile);
        } catch (error) {
          console.error(`${file.name}のPDF変換エラー:`, error);
          alert(`${file.name}のPDF変換に失敗しました: ${error.message}`);
          setUploading(false);
          return;
        }
      }
      setConvertedFiles(pdfFiles);
      
      // 2. PDF結合処理（複数ファイルかつ結合が有効な場合）
      let finalPdf = null;
      if (enableMerge && pdfFiles.length > 1) {
        setMergeProgress(0);
        try {
          finalPdf = await mergePDFs(pdfFiles, (progress) => {
            setMergeProgress(progress);
          }, formData.title || '結合された資料');
          setMergedPdf(finalPdf);
        } catch (error) {
          console.error('PDF結合エラー:', error);
          alert(`PDF結合に失敗しました: ${error.message}`);
          setUploading(false);
          return;
        }
      } else {
        // 結合しない場合は最初のPDFファイルを使用
        finalPdf = pdfFiles[0];
      }
      
      // 3. OCRが有効な場合、テキスト抽出を実行
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
      
      // 4. TODO: 最終的なPDFファイルをサーバーにアップロードする処理
      console.log('アップロード対象ファイル:', finalPdf);
      
      setUploading(false);
      alert(`資料をアップロードしました！${enableOCR ? '（OCR処理完了）' : ''}${enableMerge && pdfFiles.length > 1 ? '（PDF結合完了）' : ''}`);
      
      // フォームリセット
      setFormData({
        title: '',
        subject: SUBJECTS[0].name,
        description: '',
        files: [],
      });
      setConvertedFiles([]);
      setMergedPdf(null);
      setOcrResults([]);
      setOcrProgress({});
      setPdfProgress({});
      setMergeProgress(0);
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
        
        {/* PDF結合オプション */}
        {formData.files.length > 1 && (
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={enableMerge}
                onChange={(e) => setEnableMerge(e.target.checked)}
                className={styles.checkbox}
              />
              複数ファイルを一つのPDFに結合する
            </label>
            <p className={styles.ocrNote}>
              ※ すべてのファイルをPDF変換後、一つのファイルに結合します。無効にすると個別にアップロードされます。
            </p>
          </div>
        )}
        
        <button type="submit" className={styles.submitBtn} disabled={uploading}>
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
        
        {/* PDF変換進捗表示 */}
        {uploading && Object.keys(pdfProgress).length > 0 && (
          <div className={styles.ocrProgressContainer}>
            <h3>PDF変換進捗</h3>
            {Object.entries(pdfProgress).map(([index, progress]) => (
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
        
        {/* PDF結合進捗表示 */}
        {uploading && enableMerge && formData.files.length > 1 && mergeProgress > 0 && (
          <div className={styles.ocrProgressContainer}>
            <h3>PDF結合進捗</h3>
            <div className={styles.progressItem}>
              <span>ファイル結合中...</span>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${mergeProgress}%` }}
                ></div>
              </div>
              <span>{mergeProgress}%</span>
            </div>
          </div>
        )}
        
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
        
        {/* PDF変換後ファイル名の表示 */}
        {convertedFiles.length > 0 && (
          <div className={styles.convertedInfo}>
            <p>PDF変換済みファイル: {convertedFiles.length}個</p>
            <ul>
              {convertedFiles.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 結合されたPDF情報表示 */}
        {mergedPdf && (
          <div className={styles.mergedInfo}>
            <p>PDF結合完了!</p>
            <div className={styles.fileName}>
              結合ファイル: {mergedPdf.name}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              サイズ: {(mergedPdf.size / 1024 / 1024).toFixed(2)} MB
            </div>
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
