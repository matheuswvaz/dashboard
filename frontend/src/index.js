import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importe os componentes que funcionarão como páginas
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';
import AdminRoute from './AdminRoute'; // Componente para proteger rotas
import "./styles/App.css"

// Define o título da página
document.title = "Dashboard Matheus";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter> {/* 1. Envolve toda a aplicação no Router */}
      <Routes> {/* 2. Define a área onde as rotas serão trocadas */}
        
        {/* Rota pública para a página de login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Rota protegida para o dashboard. O AdminRoute verifica se o usuário está logado */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Rota raiz do site, que também leva para o dashboard protegido */}
        <Route
          path="/"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);