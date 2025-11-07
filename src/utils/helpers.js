// 共通のヘルパー関数

// 日付をフォーマット
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP');
};

// 文字列を切り詰める
export const truncateString = (str, length) => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

// パスワードのバリデーション
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers
  );
};

// メールアドレスのバリデーション
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 科目の色を取得
export const getSubjectColor = (subjectName, subjects) => {
  const subject = subjects.find(s => s.name === subjectName);
  return subject ? subject.color : '#999';
};
