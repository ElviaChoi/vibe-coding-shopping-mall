import { Route } from 'react-router-dom'
import RecommendedPage from '../pages/RecommendedPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import CategoryPage from '../pages/CategoryPage'

export const productRoutes = [
  <Route key="recommended" path="/recommended" element={<RecommendedPage />} />,
  <Route key="product-detail" path="/product/:id" element={<ProductDetailPage />} />,
  <Route key="women" path="/women" element={<CategoryPage />} />,
  <Route key="men" path="/men" element={<CategoryPage />} />,
  <Route key="accessories" path="/accessories" element={<CategoryPage />} />
]
