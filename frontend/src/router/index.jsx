import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminProtectedRoute } from './AdminProtectedRoute';
import { UserProtectedRoute } from './UserProtectedRoute';
import { HomePage } from '../pages/public/HomePage';
import { ProductsPage } from '../pages/public/ProductsPage';
import { ProductDetailPage } from '../pages/public/ProductDetailPage';
import { BlogsPage } from '../pages/public/BlogsPage';
import { BlogDetailPage } from '../pages/public/BlogDetailPage';
import { DynamicPage } from '../pages/public/DynamicPage';
import { ContactPage } from '../pages/public/ContactPage';
import { UserLoginPage } from '../pages/public/UserLoginPage';
import { UserSignupPage } from '../pages/public/UserSignupPage';
import { AccountPage } from '../pages/public/AccountPage';
import { OrderRequestPage } from '../pages/public/OrderRequestPage';
import { MyOrdersPage } from '../pages/public/MyOrdersPage';
import { OrderDetailPage } from '../pages/public/OrderDetailPage';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ResourcePage } from '../pages/admin/ResourcePage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminHomepagePage } from '../pages/admin/AdminHomepagePage';

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
      { path: 'login', element: <UserLoginPage /> },
      { path: 'signup', element: <UserSignupPage /> },
      {
        element: <UserProtectedRoute />,
        children: [
          { path: 'account', element: <AccountPage /> },
          { path: 'account/order', element: <OrderRequestPage /> },
          { path: 'account/orders', element: <MyOrdersPage /> },
          { path: 'account/orders/:id', element: <OrderDetailPage /> },
        ],
      },
      { path: ':slug', element: <DynamicPage /> },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    element: <AdminProtectedRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'homepage', element: <AdminHomepagePage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: ':resource', element: <ResourcePage /> },
        ],
      },
    ],
  },
]);
