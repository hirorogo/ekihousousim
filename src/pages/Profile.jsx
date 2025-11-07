import React from 'react';
import styles from '../css/Profile.module.css';

const Profile = () => {
  return (
    <div className={styles.container}>
      <h1>プロフィール</h1>
      <p>ここにユーザーのプロフィール情報が表示されます。</p>
    </div>
  );
};

export default Profile;
