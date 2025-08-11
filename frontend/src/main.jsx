import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminRoute from './AdminRoute';
import './styles/AdminDashboard.css'; 

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="admin-dashboard/*" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);