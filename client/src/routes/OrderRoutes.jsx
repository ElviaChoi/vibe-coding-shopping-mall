import { Route } from 'react-router-dom'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import OrderCompletePage from '../pages/OrderCompletePage'
import OrderFailPage from '../pages/OrderFailPage'
import OrderDetailPage from '../pages/OrderDetailPage'

export const orderRoutes = [
  <Route key="cart" path="/cart" element={<CartPage />} />,
  <Route key="checkout" path="/checkout" element={<CheckoutPage />} />,
  <Route key="order-complete" path="/order-complete" element={<OrderCompletePage />} />,
  <Route key="order-fail" path="/order-fail" element={<OrderFailPage />} />,
  <Route key="orders" path="/orders" element={<OrderDetailPage />} />
]
