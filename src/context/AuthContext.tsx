import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, CustomerUser, SavedAddress } from '../services/api';

interface AuthContextType {
  user: CustomerUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  authCheckoutReason: string | null;
  openAuthModal: (tab?: 'login' | 'register', reason?: string | null, onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    area?: string;
    addressLine?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (data: {
    email: string;
    name?: string;
    phone?: string;
    area?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (
    updates: Partial<CustomerUser> & { newPassword?: string }
  ) => Promise<{ success: boolean; error?: string }>;
  addOrUpdateSavedAddress: (address: Omit<SavedAddress, 'id'> & { id?: string }) => Promise<{ success: boolean; error?: string }>;
  removeSavedAddress: (addressId: string) => Promise<{ success: boolean; error?: string }>;
  setDefaultSavedAddress: (addressId: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(() => {
    try {
      const cached = localStorage.getItem('sr_customer_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [authCheckoutReason, setAuthCheckoutReason] = useState<string | null>(null);
  const [pendingSuccessCallback, setPendingSuccessCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('sr_customer_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    api
      .getCustomerMe()
      .then((res) => {
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('sr_customer_user', JSON.stringify(res.user));
        } else {
          localStorage.removeItem('sr_customer_token');
          localStorage.removeItem('sr_customer_user');
          setUser(null);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const openAuthModal = (
    tab: 'login' | 'register' = 'login',
    reason: string | null = null,
    onSuccess?: () => void
  ) => {
    setAuthModalTab(tab);
    setAuthCheckoutReason(reason);
    setPendingSuccessCallback(() => onSuccess || null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthCheckoutReason(null);
    setPendingSuccessCallback(null);
  };

  const handleAuthSuccess = (authenticatedUser: CustomerUser, token: string) => {
    localStorage.setItem('sr_customer_token', token);
    localStorage.setItem('sr_customer_user', JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    setIsAuthModalOpen(false);
    setAuthCheckoutReason(null);
    if (pendingSuccessCallback) {
      const cb = pendingSuccessCallback;
      setPendingSuccessCallback(null);
      setTimeout(() => cb(), 50);
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      const res = await api.customerLogin(identifier, password);
      if (res.success && res.user && res.token) {
        handleAuthSuccess(res.user, res.token);
        return { success: true };
      }
      return { success: false, error: res.error || 'Invalid credentials' };
    } catch {
      return { success: false, error: 'Network error while signing in.' };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    area?: string;
    addressLine?: string;
  }) => {
    try {
      const res = await api.customerRegister(data);
      if (res.success && res.user && res.token) {
        handleAuthSuccess(res.user, res.token);
        return { success: true };
      }
      return { success: false, error: res.error || 'Registration failed' };
    } catch {
      return { success: false, error: 'Network error while creating account.' };
    }
  };

  const loginWithGoogle = async (data: {
    email: string;
    name?: string;
    phone?: string;
    area?: string;
  }) => {
    try {
      const res = await api.customerGoogleAuth(data);
      if (res.success && res.user && res.token) {
        handleAuthSuccess(res.user, res.token);
        return { success: true };
      }
      return { success: false, error: res.error || 'Google sign-in failed' };
    } catch {
      return { success: false, error: 'Network error during Google sign-in.' };
    }
  };

  const updateProfile = async (updates: Partial<CustomerUser> & { newPassword?: string }) => {
    try {
      const res = await api.updateCustomerProfile(updates);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('sr_customer_user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to update profile' };
    } catch {
      return { success: false, error: 'Network error updating profile.' };
    }
  };

  const addOrUpdateSavedAddress = async (addrInput: Omit<SavedAddress, 'id'> & { id?: string }) => {
    if (!user) return { success: false, error: 'Not signed in' };
    const currentList = [...(user.savedAddresses || [])];
    const id = addrInput.id || `addr-${Date.now()}`;
    const newAddr: SavedAddress = {
      id,
      label: addrInput.label,
      area: addrInput.area,
      addressLine: addrInput.addressLine,
      landmark: addrInput.landmark,
      isDefault: addrInput.isDefault || currentList.length === 0,
    };

    let nextAddresses: SavedAddress[];
    const existingIdx = currentList.findIndex((a) => a.id === id);
    if (existingIdx !== -1) {
      nextAddresses = currentList.map((a, idx) => (idx === existingIdx ? newAddr : a));
    } else {
      nextAddresses = [...currentList, newAddr];
    }

    if (newAddr.isDefault) {
      nextAddresses = nextAddresses.map((a) => ({
        ...a,
        isDefault: a.id === newAddr.id,
      }));
    }

    return updateProfile({ savedAddresses: nextAddresses });
  };

  const removeSavedAddress = async (addressId: string) => {
    if (!user) return { success: false, error: 'Not signed in' };
    let nextAddresses = (user.savedAddresses || []).filter((a) => a.id !== addressId);
    if (nextAddresses.length > 0 && !nextAddresses.some((a) => a.isDefault)) {
      nextAddresses[0] = { ...nextAddresses[0], isDefault: true };
    }
    return updateProfile({ savedAddresses: nextAddresses });
  };

  const setDefaultSavedAddress = async (addressId: string) => {
    if (!user) return { success: false, error: 'Not signed in' };
    const nextAddresses = (user.savedAddresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    return updateProfile({ savedAddresses: nextAddresses });
  };

  const logout = () => {
    localStorage.removeItem('sr_customer_token');
    localStorage.removeItem('sr_customer_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        authCheckoutReason,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        updateProfile,
        addOrUpdateSavedAddress,
        removeSavedAddress,
        setDefaultSavedAddress,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
