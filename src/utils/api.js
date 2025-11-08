// API呼び出し用のユーティリティ関数
import { API_ENDPOINTS } from './constants.js';

// 基本的なHTTPリクエスト関数
const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// GET リクエスト
export const fetchData = async (endpoint) => {
  return makeRequest(endpoint);
};

// POST リクエスト（JSON）
export const postData = async (endpoint, data) => {
  return makeRequest(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// POST リクエスト（FormData - ファイルアップロード用）
export const postFormData = async (url, formData) => {
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    // fetch は multipart/form-data のヘッダを自動設定するので Content-Type は不要
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// PUT リクエスト
export const putData = async (endpoint, data) => {
  return makeRequest(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// DELETE リクエスト
export const deleteData = async (endpoint) => {
  return makeRequest(endpoint, {
    method: 'DELETE',
  });
};

// === 具体的なAPI関数 ===

// 資料関連
export const getMaterials = async () => {
  const res = await fetch(API_ENDPOINTS.materials);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};
export const getMaterial = (id) => fetchData(`${API_ENDPOINTS.materials}/${id}`);
export const uploadMaterial = (formData) => postFormData(API_ENDPOINTS.upload, formData);
export const deleteMaterial = (id) => deleteData(`${API_ENDPOINTS.materials}/${id}`);

// コメント関連
export const getComments = (materialId) => fetchData(`${API_ENDPOINTS.comments}?materialId=${materialId}`);
export const postComment = (commentData) => postData(API_ENDPOINTS.comments, commentData);

// 評価関連
export const getRatingStats = (materialId) => fetchData(`${API_ENDPOINTS.ratings}/stats/${materialId}`);
export const postRating = (ratingData) => postData(API_ENDPOINTS.ratings, ratingData);

// ユーザー関連
export const getUsers = () => fetchData(API_ENDPOINTS.users);
export const getUser = (id) => fetchData(`${API_ENDPOINTS.users}/${id}`);
export const createUser = (userData) => postData(API_ENDPOINTS.users, userData);
export const updateUser = (id, userData) => putData(`${API_ENDPOINTS.users}/${id}`, userData);

// OCR関連
export const runOCR = (ocrData) => postData(API_ENDPOINTS.ocr, ocrData);
