// 資料一覧ページコンポーネント
import React, { useState, useEffect } from 'react';
import styles from '../css/MaterialList.module.css';
import SearchBar from '../components/SearchBar';
import MaterialCard from '../components/MaterialCard';
import { INITIAL_MATERIALS } from '../utils/constants';
import { getMaterials } from '../utils/api';

const MaterialList = () => {
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [filteredMaterials, setFilteredMaterials] = useState(INITIAL_MATERIALS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API から資料データを取得
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const data = await getMaterials();
        setMaterials(data);
        setFilteredMaterials(data);
        setError(null);
      } catch (err) {
        console.error('資料データの取得に失敗:', err);
        setError('資料データの取得に失敗しました');
        // エラー時はデフォルトデータを使用
        setMaterials(INITIAL_MATERIALS);
        setFilteredMaterials(INITIAL_MATERIALS);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // キーワード検索
  const handleSearch = (keyword) => {
    const filtered = materials.filter(material =>
      material.title.includes(keyword) ||
      material.description.includes(keyword)
    );
    setFilteredMaterials(filtered);
  };

  // 科目でフィルター
  const handleFilterBySubject = (subject) => {
    if (subject === null) {
      setFilteredMaterials(materials);
    } else {
      const filtered = materials.filter(material => material.subject === subject);
      setFilteredMaterials(filtered);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>資料一覧</h1>
      
      <SearchBar
        onSearch={handleSearch}
        onFilterBySubject={handleFilterBySubject}
      />

      {loading ? (
        <div className={styles.loading}>
          <p>資料を読み込み中...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <p>デフォルトの資料を表示しています。</p>
        </div>
      ) : (
        <div className={styles.materialsGrid}>
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map(material => (
              <MaterialCard key={material.id} material={material} />
            ))
          ) : (
            <div className={styles.noResults}>
              <p>該当する資料がありません</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MaterialList;
