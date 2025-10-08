import { Route } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminOrders from '../pages/admin/AdminOrders'
import AdminProducts from '../pages/admin/AdminProducts'
import AddProductPage from '../pages/admin/AddProductPage'

export const adminRoutes = [
  <Route key="admin-dashboard" path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />,
  <Route key="admin-orders" path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />,
  <Route key="admin-products" path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />,
  <Route key="admin-add-product" path="/admin/add-product" element={<AdminLayout><AddProductPage /></AdminLayout>} />
]
