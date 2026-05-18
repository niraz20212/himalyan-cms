import { Navigate, Outlet } from 'react-router-dom';
import authStorage from '../utils/authStorage';

export function AdminProtectedRoute() {
  const token = authStorage.getAccessToken();
  const user = authStorage.getUser();
  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user?.role);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/account" replace />;
}
