import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/App.css'
import MainPage from './pages/MainPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AddProductPage from './pages/admin/AddProductPage'
import RecommendedPage from './pages/RecommendedPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderCompletePage from './pages/OrderCompletePage'
import OrderFailPage from './pages/OrderFailPage'
import OrderDetailPage from './pages/OrderDetailPage'
import { CartProvider } from './contexts/CartContext'

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recommended" element={<RecommendedPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/women" element={<CategoryPage />} />
            <Route path="/men" element={<CategoryPage />} />
            <Route path="/accessories" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-complete" element={<OrderCompletePage />} />
            <Route path="/order-fail" element={<OrderFailPage />} />
            <Route path="/orders" element={<OrderDetailPage />} />
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
            <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
            <Route path="/admin/add-product" element={<AdminLayout><AddProductPage /></AdminLayout>} />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  )
}

export default App
