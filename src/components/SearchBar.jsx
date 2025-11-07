import React, { useState } from 'react';
import styles from '../css/SearchBar.module.css';
import { SUBJECTS } from '../utils/constants';

const SearchBar = ({ onSearch, onFilterBySubject }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchKeyword);
  };

  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    setSelectedSubject(subject);
    onFilterBySubject(subject === 'all' ? null : subject);
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
