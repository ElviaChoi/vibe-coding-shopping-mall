import { Route } from 'react-router-dom'
import SignupPage from '../pages/SignupPage'
import LoginPage from '../pages/LoginPage'

export const authRoutes = [
  <Route key="signup" path="/signup" element={<SignupPage />} />,
  <Route key="login" path="/login" element={<LoginPage />} />
]
