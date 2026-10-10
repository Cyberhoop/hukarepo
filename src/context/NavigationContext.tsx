import React, { createContext, useContext, useState, useEffect } from 'react';

export type PageId = 'home' | 'products' | 'services' | 'about' | 'gallery' | 'track' | 'contact' | 'account';

interface NavigationContextType {
  currentPage: PageId;
  selectedCategoryFilter: string;
  navigateTo: (page: PageId, categoryFilter?: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const PATH_MAP: Record<string, PageId> = {
  '/': 'home',
  '/products': 'products',
  '/services': 'services',
  '/about': 'about',
  '/gallery': 'gallery',
  '/track': 'track',
  '/contact': 'contact',
  '/account': 'account',
};

const PAGE_TO_PATH: Record<PageId, string> = {
  home: '/',
  products: '/products',
  services: '/services',
  about: '/about',
  gallery: '/gallery',
  track: '/track',
  contact: '/contact',
  account: '/account',
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      return PATH_MAP[path] || 'home';
    }
    return 'home';
  });

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      setCurrentPage(PATH_MAP[path] || 'home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: PageId, categoryFilter?: string) => {
    setCurrentPage(page);
    if (categoryFilter !== undefined) {
      setSelectedCategoryFilter(categoryFilter);
    }
    const targetPath = PAGE_TO_PATH[page] || '/';
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        selectedCategoryFilter,
        navigateTo,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
