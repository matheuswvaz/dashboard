import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const location = useLocation(); // Para guardar a rota original (opcional)

  // Verifica apenas a presença do token no localStorage.
  // A validação de expiração/formato ocorrerá nas chamadas de API dentro do `children`.
  const tokenExists = localStorage.getItem('adminToken');

  if (!tokenExists) {
    // Se não há token, redireciona para o login.
    // `replace` evita que a rota atual (protegida) entre no histórico de navegação.
    // `state` pode ser usado para redirecionar de volta após o login (opcional).
    console.warn("AdminRoute: Token não encontrado. Redirecionando para /admin-login.");
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  // Se um token (qualquer string) existe, renderiza o componente filho.
  return children;
};

export default AdminRoute;