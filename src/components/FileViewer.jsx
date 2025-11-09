// filepath: src/components/FileViewer.jsx
// ファイルビューアーコンポーネント（PDF、画像、テキストファイル対応）
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from '../css/FileViewer.module.css';

// PDF.js の worker を設定
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

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

  // PDFビューアー
  if (fileType === 'application/pdf') {
    return (
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <button 
            onClick={() => setPageNumber(pageNumber > 1 ? pageNumber - 1 : 1)}
            disabled={pageNumber <= 1}
            className={styles.navButton}
          >
            前のページ
          </button>
          <span className={styles.pageInfo}>
            ページ {pageNumber} / {numPages || '-'}
          </span>
          <button 
            onClick={() => setPageNumber(pageNumber < numPages ? pageNumber + 1 : numPages)}
            disabled={pageNumber >= numPages}
            className={styles.navButton}
          >
            次のページ
          </button>
        </div>

        {error ? (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        ) : (
          <div className={styles.pdfContainer}>
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className={styles.loading}>PDF読み込み中...</div>}
            >
              <Page 
                pageNumber={pageNumber}
                width={Math.min(800, window.innerWidth - 40)}
                loading={<div className={styles.loading}>ページ読み込み中...</div>}
              />
            </Document>
          </div>
        )}
      </div>
    );
  }

  // 画像ビューアー
  if (fileType && fileType.startsWith('image/')) {
    return (
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img 
            src={fileUrl} 
            alt={fileName}
            className={styles.image}
            onError={(e) => {
              e.target.style.display = 'none';
              setError('画像ファイルの読み込みに失敗しました');
            }}
          />
          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // テキストビューアー
  if (fileType === 'text/plain') {
    return (
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loading}>テキストファイル読み込み中...</div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        ) : (
          <div className={styles.textContainer}>
            <pre className={styles.textContent}>{textContent}</pre>
          </div>
        )}
      </div>
    );
  }

  // サポートされていないファイル形式
  return (
    <div className={styles.container}>
      <div className={styles.unsupported}>
        <h3>プレビューに対応していないファイル形式です</h3>
        <p>ファイル形式: {fileType}</p>
        <p>ファイル名: {fileName}</p>
        <button 
          className={styles.downloadButton}
          onClick={() => {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          ダウンロード
        </button>
      </div>
    </div>
  );
};

export default FileViewer;
