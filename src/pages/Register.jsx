import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nickname) newErrors.nickname = 'ニックネームは必須です';
    if (!formData.email) newErrors.email = 'メールアドレスは必須です';
    if (!formData.password) newErrors.password = 'パスワードは必須です';
    if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上である必要があります';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      console.log('登録:', formData);
      alert('ユーザー登録が完了しました！');
      navigate('/login');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerCard}>
        <h1 className={styles.title}>ユーザー登録</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>ニックネーム</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="ニックネームを入力"
            />
            {errors.nickname && <span className={styles.error}>{errors.nickname}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>メールアドレス</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="メールアドレスを入力"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>パスワード</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="パスワードを入力"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>パスワード確認</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="パスワードを再入力"
            />
            {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className={styles.submitBtn}>
            登録
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
