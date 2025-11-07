// 資料一覧ページコンポーネント
import React, { useState } from 'react';
import styles from '../css/MaterialList.module.css';
import SearchBar from '../components/SearchBar';
import MaterialCard from '../components/MaterialCard';
import { INITIAL_MATERIALS } from '../utils/constants';

const MaterialList = () => {
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [filteredMaterials, setFilteredMaterials] = useState(INITIAL_MATERIALS);

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
    </div>
  );
};

export default MaterialList;
