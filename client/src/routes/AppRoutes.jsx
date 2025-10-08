import { Routes } from 'react-router-dom'
import { mainRoutes } from './MainRoutes'
import { authRoutes } from './AuthRoutes'
import { productRoutes } from './ProductRoutes'
import { orderRoutes } from './OrderRoutes'
import { adminRoutes } from './AdminRoutes'

export const AppRoutes = () => {
  return (
    <Routes>
      {mainRoutes}
      {authRoutes}
      {productRoutes}
      {orderRoutes}
      {adminRoutes}
    </Routes>
  )
}
