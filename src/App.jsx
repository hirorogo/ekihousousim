// メインアプリケーションコンポーネント
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import MaterialList from './pages/MaterialList';
import MaterialUpload from './pages/MaterialUpload';
import MaterialDetail from './pages/MaterialDetail';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Layout from './components/Layout';
import { SITE_ACCESS_PASSWORD } from './utils/constants';
import './App.css';

const App = () => {
  // サイトアクセス認証状態の管理
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // マウント時にローカルストレージから認証状態を確認
  useEffect(() => {
    const savedAuth = localStorage.getItem('siteAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // ローディング中は何も表示しない
  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  // 認証されていない場合はログインページを表示
  if (!isAuthenticated) {
    return (
      <Router basename="/ekihousousim">
        <Layout>
          <Routes>
            <Route 
              path="*" 
              element={
                <Login 
                  onAuthenticated={() => {
                    setIsAuthenticated(true);
                    localStorage.setItem('siteAuth', 'true');
                  }}
                  requiredPassword={SITE_ACCESS_PASSWORD}
                />
              } 
            />
          </Routes>
        </Layout>
      </Router>
    );
  }

  // 認証されている場合は通常のルートを表示
  return (
    <Router basename="/ekihousousim">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onAuthenticated={() => {}} requiredPassword={SITE_ACCESS_PASSWORD} />} />
          <Route path="/materials" element={<MaterialList />} />
          <Route path="/materials/upload" element={<MaterialUpload />} />
          <Route path="/materials/:id" element={<MaterialDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

