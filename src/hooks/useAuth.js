// ユーザー認証状態管理のカスタムフック
import { useState, useCallback, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 初期化時にローカルストレージから認証情報を復元
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const adminAuth = localStorage.getItem('adminAuth');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (adminAuth === 'true') {
          userData.role = 'admin';
        }
        setUser(userData);
      } catch (err) {
        console.error('ユーザー情報の復元に失敗:', err);
      }
    } else if (adminAuth === 'true') {
      // 管理者認証のみの場合
      setUser({
        email: 'admin@example.com',
        nickname: '管理者',
        role: 'admin'
      });
    }
  }, []);

  // ログイン処理
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // 仮のログイン処理（実際にはAPI呼び出し）
      if (email && password) {
        const userData = { 
          email, 
          nickname: email.split('@')[0] || 'ユーザー',
          role: 'user'
        };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } else {
        throw new Error('メールアドレスとパスワードが必要です');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 管理者ログイン
  const adminLogin = useCallback((password) => {
    if (password === 'admin123') {
      const adminUser = {
        email: 'admin@example.com',
        nickname: '管理者',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }
    return false;
  }, []);

  // ログアウト処理
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminAuth');
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
    adminLogin,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
};
