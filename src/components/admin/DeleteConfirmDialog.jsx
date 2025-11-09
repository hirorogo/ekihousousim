// 削除確認ダイアログコンポーネント
import React from 'react';
import styles from '../../css/admin/DeleteConfirmDialog.module.css';

const DeleteConfirmDialog = ({ material, onConfirm, onCancel }) => {
  if (!material) return null;

  return (
    <div className={styles.dialogOverlay} onClick={onCancel}>
      <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dialogHeader}>
          <h2>削除の確認</h2>
        </div>

        <div className={styles.dialogBody}>
          <p className={styles.warningText}>本当にこの資料を削除しますか？</p>
          
          <div className={styles.materialInfo}>
            <p><strong>タイトル:</strong> {material.title}</p>
            <p><strong>ファイル名:</strong> {material.fileName}</p>
            <p><strong>投稿者:</strong> {material.uploader}</p>
            <p><strong>アップロード日時:</strong> {new Date(material.uploadDate).toLocaleString('ja-JP')}</p>
          </div>

          <p className={styles.cautionText}>この操作は取り消せません。</p>
        </div>

        <div className={styles.dialogActions}>
          <button onClick={onCancel} className={styles.cancelButton}>
            キャンセル
          </button>
          <button onClick={() => onConfirm(material.id)} className={styles.deleteButton}>
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
