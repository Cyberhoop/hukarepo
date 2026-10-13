import { ProductItem } from '../data/productsData';

export interface PaymentConfig {
  id: string;
  upiId: string;
  payeeName: string;
  qrImageUrl: string;
  qrStoragePath: string;
  isActive: boolean;
  codEnabled: boolean;
  instructions: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ContactConfig {
  phone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  whatsappUrl: string;
  email: string;
  address: string;
  city: string;
  areasServed: string;
  hours: string;
  instagramUrl: string;
  facebookUrl: string;
  googleMapsUrl: string;
  updatedAt: string;
  updatedBy: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  category: 'parties' | 'weddings' | 'hookahs' | 'cocktails';
  createdAt: string;
  updatedAt: string;
}

export interface PageSeoConfig {
  pageId: 'home' | 'products' | 'services' | 'about' | 'gallery' | 'track' | 'contact' | 'account';
  pageLabel: string;
  path: string;
  title: string;
  description: string;
  focusKeyword: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalPath: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
}

export interface SeoConfig {
  siteName: string;
  titleSeparator: string;
  siteTagline: string;
  defaultTitle: string;
  defaultDescription: string;
  globalFocusKeyword: string;
  globalKeywords: string;
  canonicalDomain: string;
  ogSiteName: string;
  ogType: string;
  defaultOgImage: string;
  twitterCard: 'summary_large_image' | 'summary';
  twitterHandle: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  googleSiteVerification: string;
  bingSiteVerification: string;
  googleAnalyticsId: string;
  schemaBusinessType: string;
  schemaBusinessName: string;
  schemaDescription: string;
  schemaPriceRange: string;
  schemaOpeningHours: string;
  schemaTelephone: string;
  schemaEmail: string;
  schemaStreetAddress: string;
  schemaLocality: string;
  schemaRegion: string;
  schemaPostalCode: string;
  schemaGeoLat: string;
  schemaGeoLng: string;
  schemaAreaServed: string;
  schemaRatingValue: string;
  schemaReviewCount: string;
  customRobotsTxt: string;
  pages: Record<string, PageSeoConfig>;
  updatedAt: string;
  updatedBy: string;
}

export interface Booking {
  id: string;
  domain: string;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  eventTime: string;
  deliveryArea: string;
  customAddress?: string;
  potCount: string;
  requestedItems: ProductItem[];
  includeBartender: boolean;
  includeCook: boolean;
  specialInstructions?: string;
  paymentMethod: 'cod' | 'qr';
  paymentStatus: 'pending' | 'verified' | 'rejected';
  transactionReference?: string;
  paymentProofUrl?: string;
  bookingStatus:
    | 'pending'
    | 'confirmed'
    | 'substitution_requested'
    | 'substitution_approved'
    | 'substitution_rejected'
    | 'dispatched'
    | 'delivered'
    | 'completed'
    | 'cancelled';
  substitutionOffered?: {
    unavailableItem: string;
    offeredItem: string;
    reason: string;
  } | null;
  substitutionNote?: string;
  substitutionCustomerConfirmed?: boolean | null;
  substitutionActionAt?: string;
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TermsAcceptanceRecord {
  id: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  domain: string;
  termsVersion: string;
  policySnippet: string;
  customerIp?: string;
  userAgent?: string;
  acceptedAt: string;
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Party Venue' | 'Office' | 'Other';
  area: string;
  addressLine: string;
  landmark?: string;
  isDefault: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  authProvider: 'local' | 'google';
  avatarUrl?: string;
  preferredFlavour?: string;
  savedAddresses: SavedAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface CookieConsentPreferences {
  visitorId: string;
  userId?: string;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  seoPersonalization: boolean;
  utmSource?: string;
  referrer?: string;
  updatedAt?: string;
}

const getAdminToken = () => localStorage.getItem('sr_admin_token') || '';
const getCustomerToken = () => localStorage.getItem('sr_customer_token') || '';

export const api = {
  // App Config
  async getConfig() {
    const res = await fetch('/api/config');
    return res.json();
  },

  // Active Payment Settings (Loaded by both customer domains)
  async getPaymentSettings(): Promise<{ success: boolean; data: PaymentConfig }> {
    const res = await fetch('/api/payment-settings');
    return res.json();
  },

  // Admin Update Payment Settings
  async updatePaymentSettings(data: Partial<PaymentConfig>, adminEmail?: string) {
    const res = await fetch('/api/payment-settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ ...data, adminEmail }),
    });
    return res.json();
  },

  // Active Website Contact Settings
  async getContactSettings(): Promise<{ success: boolean; data: ContactConfig }> {
    const res = await fetch('/api/contact-settings');
    return res.json();
  },

  // Admin Update Website Contact Settings
  async updateContactSettings(data: Partial<ContactConfig>, adminEmail?: string) {
    const res = await fetch('/api/admin/contact-settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ ...data, adminEmail }),
    });
    return res.json();
  },

  // Active SEO Settings (Global + Per-Page + Schema.org)
  async getSeoSettings(): Promise<{ success: boolean; data: SeoConfig }> {
    const res = await fetch('/api/seo-settings');
    return res.json();
  },

  // Admin Update SEO Settings
  async updateSeoSettings(seoConfig: Partial<SeoConfig>, adminEmail?: string) {
    const res = await fetch('/api/admin/seo-settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ seoConfig, adminEmail }),
    });
    return res.json();
  },

  // Admin Upload OpenGraph / Social Share Image
  async uploadOgImage(formData: FormData) {
    const res = await fetch('/api/admin/upload-og-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: formData,
    });
    return res.json();
  },

  // Admin Upload Actual QR Image
  async uploadQrImage(formData: FormData) {
    const res = await fetch('/api/upload-qr', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: formData,
    });
    return res.json();
  },

  // Customer Upload Payment Proof
  async uploadPaymentProof(formData: FormData) {
    const res = await fetch('/api/upload-payment-proof', {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  // Products
  async getProducts(): Promise<{ success: boolean; data: ProductItem[] }> {
    const res = await fetch('/api/products');
    return res.json();
  },

  async toggleProductStock(id: string, inStock: boolean) {
    const res = await fetch(`/api/products/${id}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ inStock }),
    });
    return res.json();
  },

  async createProduct(productData: Partial<ProductItem>, adminEmail?: string) {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ ...productData, adminEmail }),
    });
    return res.json();
  },

  async updateProduct(id: string, updates: Partial<ProductItem>, adminEmail?: string) {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ ...updates, adminEmail }),
    });
    return res.json();
  },

  async deleteProduct(id: string, adminEmail?: string) {
    const res = await fetch(`/api/products/${id}?adminEmail=${encodeURIComponent(adminEmail || 'admin')}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });
    return res.json();
  },

  async uploadProductImage(formData: FormData) {
    const res = await fetch('/api/upload-product-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: formData,
    });
    return res.json();
  },

  // Gallery Portfolio
  async getGallery(): Promise<{ success: boolean; data: GalleryItem[] }> {
    const res = await fetch('/api/gallery');
    return res.json();
  },

  async uploadGalleryImage(formData: FormData) {
    const res = await fetch('/api/upload-gallery-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: formData,
    });
    return res.json();
  },

  async createGalleryItem(itemData: Partial<GalleryItem>, adminEmail?: string) {
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ ...itemData, adminEmail }),
    });
    return res.json();
  },

  async updateGalleryItem(id: string, updates: Partial<GalleryItem>, adminEmail?: string) {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ ...updates, adminEmail }),
    });
    return res.json();
  },

  async deleteGalleryItem(id: string, adminEmail?: string) {
    const res = await fetch(`/api/gallery/${id}?adminEmail=${encodeURIComponent(adminEmail || 'admin')}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });
    return res.json();
  },

  // Bookings
  async createBooking(bookingData: any) {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return res.json();
  },

  async getBookings(params?: { domain?: string; status?: string; search?: string }): Promise<{ success: boolean; data: Booking[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`/api/bookings?${query}`);
    return res.json();
  },

  async getBooking(id: string): Promise<{ success: boolean; data: Booking }> {
    const res = await fetch(`/api/bookings/${id}`);
    return res.json();
  },

  async updateBookingStatus(id: string, bookingStatus: string, adminEmail?: string) {
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ bookingStatus, adminEmail }),
    });
    return res.json();
  },

  // Admin Manual Online Payment Verification
  async verifyPayment(id: string, verified: boolean, notes?: string, adminEmail?: string) {
    const res = await fetch(`/api/bookings/${id}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ verified, notes, adminEmail }),
    });
    return res.json();
  },

  // Admin Request Product Substitution
  async requestSubstitution(id: string, unavailableItem: string, offeredItem: string, reason: string, adminEmail?: string) {
    const res = await fetch(`/api/bookings/${id}/request-substitution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ unavailableItem, offeredItem, reason, adminEmail }),
    });
    return res.json();
  },

  // Customer Respond to Product Substitution
  async respondSubstitution(id: string, approved: boolean, customerNote?: string) {
    const res = await fetch(`/api/bookings/${id}/respond-substitution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved, customerNote }),
    });
    return res.json();
  },

  // Admin Authentication & Credential Management
  async adminLogin(email: string, password: string) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async getAdminProfile() {
    const res = await fetch('/api/admin/profile', {
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });
    return res.json();
  },

  async updateAdminCredentials(data: {
    currentPassword: string;
    newEmail: string;
    newPassword?: string;
    newName?: string;
  }) {
    const res = await fetch('/api/admin/credentials', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getAdminMetrics() {
    const res = await fetch('/api/admin/metrics', {
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });
    return res.json();
  },

  async getTermsAudit(): Promise<{ success: boolean; data: TermsAcceptanceRecord[] }> {
    const res = await fetch('/api/admin/terms-audit', {
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });
    return res.json();
  },

  // Customer Authentication & Client Panel
  async customerRegister(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    area?: string;
    addressLine?: string;
  }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async customerLogin(identifier: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return res.json();
  },

  async customerGoogleAuth(data: { email: string; name?: string; phone?: string; area?: string }) {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getCustomerMe(): Promise<{ success: boolean; user?: CustomerUser; error?: string }> {
    const token = getCustomerToken();
    if (!token) return { success: false, error: 'No session token' };
    const res = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  async updateCustomerProfile(updates: Partial<CustomerUser> & { newPassword?: string }) {
    const res = await fetch('/api/customer/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCustomerToken()}`,
      },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async getCustomerOrders(): Promise<{ success: boolean; total?: number; data: Booking[]; error?: string }> {
    const res = await fetch('/api/customer/orders', {
      headers: {
        Authorization: `Bearer ${getCustomerToken()}`,
      },
    });
    return res.json();
  },

  async saveCookieConsent(consent: CookieConsentPreferences) {
    const res = await fetch('/api/cookies/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consent),
    });
    return res.json();
  },
};

