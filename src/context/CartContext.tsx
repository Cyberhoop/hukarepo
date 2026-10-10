import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductItem } from '../data/productsData';

export interface CartItem {
  product: ProductItem;
  quantity: number;
  isRental?: boolean;
  rentalDate?: string;
  rentalDuration?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: ProductItem, quantity?: number, isRental?: boolean, rentalDate?: string, rentalDuration?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  recentlyViewed: ProductItem[];
  addRecentlyViewed: (product: ProductItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sr_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('sr_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sr_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sr_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Sync recently viewed
  useEffect(() => {
    try {
      localStorage.setItem('sr_recent', JSON.stringify(recentlyViewed));
    } catch {}
  }, [recentlyViewed]);

  const addToCart = (
    product: ProductItem,
    quantity: number = 1,
    isRental: boolean = false,
    rentalDate?: string,
    rentalDuration?: string
  ) => {
    setCartItems((prev) => {
      const index = prev.findIndex((item) => item.product.id === product.id);
      if (index > -1) {
        const next = [...prev];
        next[index] = {
          ...next[index],
          quantity: next[index].quantity + quantity,
          isRental: isRental ?? next[index].isRental,
          rentalDate: rentalDate ?? next[index].rentalDate,
          rentalDuration: rentalDuration ?? next[index].rentalDuration,
        };
        return next;
      } else {
        return [...prev, { product, quantity, isRental, rentalDate, rentalDuration }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addRecentlyViewed = (product: ProductItem) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  const totalItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const subtotal = cartItems.reduce((acc, curr) => {
    const itemPrice = curr.isRental && curr.product.rentalRate
      ? parseInt(curr.product.rentalRate.replace(/\D/g, ''), 10) || curr.product.price
      : curr.product.price;
    return acc + itemPrice * curr.quantity;
  }, 0);

  // Free delivery across Kolkata for orders >= ₹999, else flat ₹149
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 149;

  // Coupon application logic
  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'KOLKATA10') {
      setCouponCode('KOLKATA10');
      setDiscountAmount(Math.round(subtotal * 0.1));
      return true;
    } else if (trimmed === 'SHISHA100') {
      setCouponCode('SHISHA100');
      setDiscountAmount(Math.min(100, subtotal));
      return true;
    } else if (trimmed === 'VIP20' && subtotal >= 2500) {
      setCouponCode('VIP20');
      setDiscountAmount(Math.round(subtotal * 0.2));
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
  };

  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        deliveryFee,
        discountAmount,
        couponCode,
        applyCoupon,
        removeCoupon,
        total,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        recentlyViewed,
        addRecentlyViewed,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
