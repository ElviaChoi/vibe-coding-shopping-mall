import { BrowserRouter as Router } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { AppRoutes } from './routes'
import './styles/index.js'

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </CartProvider>
    </Router>
  )
}

export default App
