import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, ContactConfig } from '../services/api';
import { CONTACT_INFO } from '../data/productsData';

export const DEFAULT_CONTACT_CONFIG: ContactConfig = {
  phone: CONTACT_INFO.phone || '+91 98765 43210',
  secondaryPhone: '+91 98301 22419',
  whatsappNumber: CONTACT_INFO.phone || '+91 98765 43210',
  whatsappUrl: CONTACT_INFO.whatsappUrl || 'https://wa.me/919876543210',
  email: CONTACT_INFO.email || 'bookings@shisharent.in',
  address: 'Park Street & Salt Lake Sector V Concierge Hubs, Kolkata',
  city: CONTACT_INFO.city || 'Kolkata',
  areasServed:
    CONTACT_INFO.areasServed ||
    'Salt Lake, New Town, Park Street, Ballygunge, Alipore, Howrah, Behala & all across Kolkata',
  hours: CONTACT_INFO.hours || 'Open Daily · 11:00 AM to 3:00 AM (Late Night Service)',
  instagramUrl: 'https://instagram.com/shisharentkolkata',
  facebookUrl: 'https://facebook.com/shisharentkolkata',
  googleMapsUrl: 'https://maps.google.com/?q=Park+Street+Kolkata',
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};

interface ContactContextType {
  contactConfig: ContactConfig;
  refreshContactConfig: () => Promise<void>;
  getWhatsAppLink: (message?: string) => string;
}

const ContactContext = createContext<ContactContextType>({
  contactConfig: DEFAULT_CONTACT_CONFIG,
  refreshContactConfig: async () => {},
  getWhatsAppLink: (message?: string) => {
    const base = DEFAULT_CONTACT_CONFIG.whatsappUrl;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  },
});

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contactConfig, setContactConfig] = useState<ContactConfig>(DEFAULT_CONTACT_CONFIG);

  const refreshContactConfig = useCallback(async () => {
    try {
      const res = await api.getContactSettings();
      if (res?.success && res.data) {
        setContactConfig({
          ...DEFAULT_CONTACT_CONFIG,
          ...res.data,
        });
      }
    } catch {
      // Fallback to default contact config
    }
  }, []);

  useEffect(() => {
    refreshContactConfig();
  }, [refreshContactConfig]);

  const getWhatsAppLink = useCallback(
    (message?: string) => {
      const rawDigits = (contactConfig.whatsappNumber || contactConfig.phone || '').replace(/\D/g, '');
      const normalizedDigits =
        rawDigits.length === 10 ? `91${rawDigits}` : rawDigits || '919876543210';
      const base =
        contactConfig.whatsappUrl && contactConfig.whatsappUrl.startsWith('http')
          ? contactConfig.whatsappUrl.split('?')[0]
          : `https://wa.me/${normalizedDigits}`;

      if (!message) return base;
      return `${base}?text=${encodeURIComponent(message)}`;
    },
    [contactConfig]
  );

  return (
    <ContactContext.Provider value={{ contactConfig, refreshContactConfig, getWhatsAppLink }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => useContext(ContactContext);
