import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MaterialList from './pages/MaterialList';
import MaterialUpload from './pages/MaterialUpload';
import MaterialDetail from './pages/MaterialDetail';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import './App.css';

const App = () => {
  return (
    <Router basename="/ekihousousim">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/materials" element={<MaterialList />} />
          <Route path="/materials/upload" element={<MaterialUpload />} />
          <Route path="/materials/:id" element={<MaterialDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

