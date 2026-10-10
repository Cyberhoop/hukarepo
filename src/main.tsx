import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NavigationProvider } from './context/NavigationContext';
import { ProductsProvider } from './context/ProductsContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <NavigationProvider>
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  </NavigationProvider>
);

