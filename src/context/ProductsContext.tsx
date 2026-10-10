import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ALL_PRODUCTS, ProductItem } from '../data/productsData';
import { api } from '../services/api';

interface ProductsContextType {
  products: ProductItem[];
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
  updateProductInState: (updated: ProductItem) => void;
  addProductToState: (newProd: ProductItem) => void;
  removeProductFromState: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ProductItem[]>(ALL_PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.getProducts();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setProducts(res.data);
      }
    } catch (err) {
      console.warn('[ProductsContext] Failed to load remote products, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const updateProductInState = (updated: ProductItem) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const addProductToState = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const removeProductFromState = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        refreshProducts,
        updateProductInState,
        addProductToState,
        removeProductFromState,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
