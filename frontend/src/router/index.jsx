import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { HomePage } from '../pages/public/HomePage';
import { ProductsPage } from '../pages/public/ProductsPage';
import { ProductDetailPage } from '../pages/public/ProductDetailPage';
import { BlogsPage } from '../pages/public/BlogsPage';
import { BlogDetailPage } from '../pages/public/BlogDetailPage';
import { DynamicPage } from '../pages/public/DynamicPage';
import { ContactPage } from '../pages/public/ContactPage';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ResourcePage } from '../pages/admin/ResourcePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'blogs', element: <BlogsPage /> },
      { path: 'blogs/:slug', element: <BlogDetailPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: ':slug', element: <DynamicPage /> },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: ':resource', element: <ResourcePage /> },
        ],
      },
    ],
  },

]);
