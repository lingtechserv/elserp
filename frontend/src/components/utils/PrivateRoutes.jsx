import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!user;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoutes;