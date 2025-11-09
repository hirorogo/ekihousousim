// filepath: src/components/FileViewer.jsx
// ファイルビューアーコンポーネント（PDF、画像、テキストファイル対応）
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from '../css/FileViewer.module.css';

// PDF.js の worker を設定
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// PDFのオプション設定
const pdfOptions = {
  cMapUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/cmaps/',
  cMapPacked: true,
};

const FileViewer = ({ fileUrl, fileName, fileType }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textContent, setTextContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // PDFドキュメント読み込み完了時の処理
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  // PDFドキュメント読み込みエラー時の処理
  function onDocumentLoadError(error) {
    console.error('PDF読み込みエラー:', error);
    setError('PDFファイルの読み込みに失敗しました');
  }

  // テキストファイル読み込み
  useEffect(() => {
    if (fileType === 'text/plain' && fileUrl) {
      setLoading(true);
      fetch(fileUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('ファイルの取得に失敗しました');
          }
          return response.text();
        })
        .then(text => {
          setTextContent(text);
          setLoading(false);
        })
        .catch(error => {
          console.error('テキストファイル読み込みエラー:', error);
          setError('テキストファイルの読み込みに失敗しました');
          setLoading(false);
        });
    }
  }, [fileUrl, fileType]);

  // ファイルダウンロード処理
  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('ダウンロードエラー:', error);
      setError('ファイルのダウンロードに失敗しました');
    }
  };

  // PDFビューワーのレンダリング
  const renderPdfViewer = () => (
    <div className={styles.pdfContainer}>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        options={pdfOptions}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      {numPages > 1 && (
        <div className={styles.pdfControls}>
          <button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
          >
            前のページ
          </button>
          <span>
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
          >
            次のページ
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.fileViewer}>
      <div className={styles.toolbar}>
        <button onClick={handleDownload} className={styles.downloadButton}>
          ダウンロード
        </button>
      </div>
      
      {loading && <div>読み込み中...</div>}
      {error && <div className={styles.error}>{error}</div>}
      
      {!loading && !error && (
        <>
          {fileType === 'application/pdf' && renderPdfViewer()}
          {fileType.startsWith('image/') && (
            <img src={fileUrl} alt={fileName} className={styles.image} />
          )}
          {fileType === 'text/plain' && (
            <pre className={styles.textContent}>{textContent}</pre>
          )}
        </>
      )}
    </div>
  );
};

export default FileViewer;
