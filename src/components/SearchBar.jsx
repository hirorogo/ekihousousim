import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/SearchBar.module.css';
import { SUBJECTS } from '../utils/constants';

const SearchBar = ({ onSearch, onFilterBySubject }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showAdminLink, setShowAdminLink] = useState(false);
  const navigate = useNavigate();

  // 検索キーワードに「admin」が含まれている場合、管理者入口を表示
  useEffect(() => {
    if (searchKeyword.toLowerCase() === 'admin') {
      setShowAdminLink(true);
    } else {
      setShowAdminLink(false);
    }
  }, [searchKeyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    // adminでない場合のみ通常検索を実行
    if (searchKeyword.toLowerCase() !== 'admin') {
      onSearch(searchKeyword);
    }
  };

  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    setSelectedSubject(subject);
    onFilterBySubject(subject === 'all' ? null : subject);
  };

  const handleAdminClick = () => {
    navigate('/admin/login');
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="キーワードで検索..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>検索</button>
      </form>

      {/* 管理者入口 */}
      {showAdminLink && (
        <div className={styles.adminEntry}>
          <button onClick={handleAdminClick} className={styles.adminButton}>
            🔐 管理者パネルへ
          </button>
        </div>
      )}

      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>科目で絞込:</label>
        <select
          value={selectedSubject}
          onChange={handleSubjectChange}
          className={styles.filterSelect}
        >
          <option value="all">すべて</option>
          {SUBJECTS.map(subject => (
            <option key={subject.id} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
