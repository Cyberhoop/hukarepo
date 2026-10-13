import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NavigationProvider } from './context/NavigationContext';
import { ProductsProvider } from './context/ProductsContext';
import { ContactProvider } from './context/ContactContext';
import { SeoProvider } from './context/SeoContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <NavigationProvider>
    <AuthProvider>
      <ContactProvider>
        <SeoProvider>
          <ProductsProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </ProductsProvider>
        </SeoProvider>
      </ContactProvider>
    </AuthProvider>
  </NavigationProvider>
);


