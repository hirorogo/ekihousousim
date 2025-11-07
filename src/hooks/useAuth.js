// ユーザー認証状態管理のカスタムフック
import { useState, useCallback } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ログイン処理
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // 仮のログイン処理（実際にはAPI呼び出し）
      if (email && password) {
        setUser({ email, nickname: 'ユーザー' });
      } else {
        throw new Error('メールアドレスとパスワードが必要です');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ログアウト処理
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // ユーザー情報更新
  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };
};
