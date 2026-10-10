import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ALL_PRODUCTS, ProductItem } from '../data/productsData';

// Supabase client instance (server-side with service role or anon key)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_K ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

export let supabase: SupabaseClient | null = null;

const isPlaceholder =
  !supabaseUrl ||
  supabaseUrl.includes('your-supabase-project') ||
  supabaseUrl.includes('demo.shisharent.supabase.co') ||
  !supabaseKey ||
  supabaseKey.includes('your-supabase') ||
  supabaseKey.includes('demo_');

if (!isPlaceholder) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('[Database] Connected to remote Supabase project:', supabaseUrl);
  } catch (err) {
    console.warn('[Database] Failed to initialize Supabase client:', err);
  }
} else {
  console.log('[Database] Running with integrated local persistent store.');
}

// Local Persistent Store fallback
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

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
  passwordHash: string;
  authProvider: 'local' | 'google';
  avatarUrl?: string;
  preferredFlavour?: string;
  savedAddresses: SavedAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface CookieConsentRecord {
  id: string;
  visitorId: string;
  userId?: string;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  seoPersonalization: boolean;
  utmSource?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  updatedAt: string;
}

export interface BookingRecord {
  id: string;
  userId?: string;
  customerEmail?: string;
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

export interface AdminAuditLog {
  id: string;
  action: string;
  details: any;
  adminEmail: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AdminCredentials {
  email: string;
  passwordHash: string;
  name: string;
  updatedAt: string;
}

export interface DatabaseState {
  adminCredentials: AdminCredentials;
  paymentConfig: PaymentConfig;
  products: ProductItem[];
  bookings: BookingRecord[];
  termsAcceptances: TermsAcceptanceRecord[];
  auditLogs: AdminAuditLog[];
  users: CustomerUser[];
  cookieConsents: CookieConsentRecord[];
}

function getInitialState(): DatabaseState {
  return {
    adminCredentials: {
      email: process.env.ADMIN_EMAIL || 'admin@shisharent.in',
      passwordHash: process.env.ADMIN_PASSWORD_HASH || 'admin123',
      name: 'Shisha Rent Operations Manager',
      updatedAt: new Date().toISOString(),
    },
    paymentConfig: {
      id: 'active_config',
      upiId: 'shisharent@upi',
      payeeName: 'Shisha Rent Kolkata',
      qrImageUrl: '',
      qrStoragePath: '',
      isActive: true,
      codEnabled: true,
      instructions:
        'Scan with any UPI App (GPay, PhonePe, Paytm, BHIM). Share transaction screenshot on WhatsApp for instant priority confirmation.',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system_init',
    },
    products: ALL_PRODUCTS,
    bookings: [
      {
        id: 'SR-KOL-1001',
        domain: 'shisharent.in',
        customerName: 'Aman Singhania',
        customerPhone: '+91 98301 22419',
        eventDate: '2026-10-12',
        eventTime: '20:00',
        deliveryArea: 'Salt Lake Sector 5',
        customAddress: 'Infinity Benchmark Tower B, Rooftop Terrace',
        potCount: '3',
        requestedItems: [
          ALL_PRODUCTS[0], // Al Fakir
          ALL_PRODUCTS[7], // Royal
          ALL_PRODUCTS[16], // Maya Hookah
          ALL_PRODUCTS[25], // Mud / Mitti Chilam
          ALL_PRODUCTS[36], // Coconut Coal
        ],
        includeBartender: true,
        includeCook: false,
        specialInstructions: 'Please deliver coals pre-cut with extra tongs.',
        paymentMethod: 'qr',
        paymentStatus: 'verified',
        transactionReference: 'UPI/261012984102/AXIS',
        bookingStatus: 'confirmed',
        termsAccepted: true,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'SR-KOL-1002',
        domain: 'shisharent.com',
        customerName: 'Rhea Sen',
        customerPhone: '+91 98310 88204',
        eventDate: '2026-10-13',
        eventTime: '18:30',
        deliveryArea: 'Alipore',
        customAddress: 'Burdwan Road, Residence 4A',
        potCount: '2',
        requestedItems: [
          ALL_PRODUCTS[17], // Coco Aaya Hookah
          ALL_PRODUCTS[5],  // Afzal
          ALL_PRODUCTS[24], // Silicone Chilam
          ALL_PRODUCTS[33], // Heater Burner
        ],
        includeBartender: false,
        includeCook: false,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        bookingStatus: 'pending',
        termsAccepted: true,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    termsAcceptances: [
      {
        id: 'term-init-01',
        bookingId: 'SR-KOL-1001',
        customerName: 'Aman Singhania',
        customerPhone: '+91 98301 22419',
        domain: 'shisharent.in',
        termsVersion: '2026-v1.0',
        policySnippet: 'Customer booking ke time apni requirement ke according Flavour Brand request kar sakta hai...',
        customerIp: '103.220.14.88',
        userAgent: 'Mozilla/5.0 Chrome/130.0',
        acceptedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'term-init-02',
        bookingId: 'SR-KOL-1002',
        customerName: 'Rhea Sen',
        customerPhone: '+91 98310 88204',
        domain: 'shisharent.com',
        termsVersion: '2026-v1.0',
        policySnippet: 'Customer booking ke time apni requirement ke according Flavour Brand request kar sakta hai...',
        customerIp: '103.220.14.92',
        userAgent: 'Mozilla/5.0 Safari/18.0',
        acceptedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    auditLogs: [],
    users: [
      {
        id: 'usr-kol-1001',
        name: 'Aman Singhania',
        email: 'aman@example.com',
        phone: '+91 98301 22419',
        passwordHash: '123456',
        authProvider: 'local',
        preferredFlavour: 'Kolkata Meetha Paan',
        savedAddresses: [
          {
            id: 'addr-1',
            label: 'Party Venue',
            area: 'Salt Lake (Sector 1 - 5)',
            addressLine: 'Infinity Benchmark Tower B, Rooftop Terrace',
            landmark: 'Sector 5 Electronics Complex',
            isDefault: true,
          },
        ],
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ],
    cookieConsents: [],
  };
}

// In-memory cache synced to disk
let dbState: DatabaseState = getInitialState();

export function initDatabase(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      dbState = JSON.parse(data);

      if (!dbState.adminCredentials || !dbState.adminCredentials.email) {
        dbState.adminCredentials = getInitialState().adminCredentials;
      }
      if (!Array.isArray(dbState.users)) {
        dbState.users = getInitialState().users;
      }
      if (!Array.isArray(dbState.cookieConsents)) {
        dbState.cookieConsents = [];
      }

      // Ensure all products have complete fields (images, price, rating, brand, specs)
      if (Array.isArray(dbState.products)) {
        const defaultMap = new Map(ALL_PRODUCTS.map((p) => [p.id, p]));
        dbState.products = dbState.products.map((p) => {
          const def = defaultMap.get(p.id);
          return {
            ...(def || {}),
            ...p,
            brand: p.brand || def?.brand || 'Shisha Rent Kolkata',
            price: typeof p.price === 'number' ? p.price : (def?.price ?? 499),
            rating: typeof p.rating === 'number' ? p.rating : (def?.rating ?? 4.9),
            reviewsCount: typeof p.reviewsCount === 'number' ? p.reviewsCount : (def?.reviewsCount ?? 50),
            images: Array.isArray(p.images) && p.images.length > 0
              ? p.images
              : (def?.images || ['/src/assets/images/hero_luxury_hookah_1791648599431.jpg']),
            specs: p.specs && typeof p.specs === 'object'
              ? p.specs
              : (def?.specs || { Origin: 'Authentic Luxury Grade', KolkataDelivery: 'Express 45-60 min' }),
          };
        });
      } else {
        dbState.products = ALL_PRODUCTS;
      }

      if (dbState.paymentConfig?.qrImageUrl?.startsWith('/uploads/')) {
        const localFilePath = path.resolve(process.cwd(), dbState.paymentConfig.qrImageUrl.replace(/^\//, ''));
        if (!fs.existsSync(localFilePath)) {
          dbState.paymentConfig.qrImageUrl = '';
          dbState.paymentConfig.qrStoragePath = '';
        }
      }
      saveDatabase();
      console.log('[Database] Loaded and normalized existing database state from', DB_FILE);
    } else {
      saveDatabase();
      console.log('[Database] Created new initialized database at', DB_FILE);
    }
  } catch (err) {
    console.error('[Database] Failed to read database file, initializing defaults:', err);
    dbState = getInitialState();
  }
}

export function saveDatabase(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Database] Failed to save database to disk:', err);
  }
}

export function getDatabase(): DatabaseState {
  return dbState;
}

export function updateAdminCredentials(updates: Partial<AdminCredentials>): AdminCredentials {
  dbState.adminCredentials = {
    ...dbState.adminCredentials,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase();
  return dbState.adminCredentials;
}

export function updatePaymentConfig(config: Partial<PaymentConfig>, adminUser: string): PaymentConfig {
  dbState.paymentConfig = {
    ...dbState.paymentConfig,
    ...config,
    updatedAt: new Date().toISOString(),
    updatedBy: adminUser,
  };
  saveDatabase();

  // If Supabase is connected, sync to PostgreSQL
  if (supabase) {
    supabase
      .from('payment_settings')
      .upsert({
        id: 'active_config',
        upi_id: dbState.paymentConfig.upiId,
        payee_name: dbState.paymentConfig.payeeName,
        qr_image_url: dbState.paymentConfig.qrImageUrl,
        qr_storage_path: dbState.paymentConfig.qrStoragePath,
        is_active: dbState.paymentConfig.isActive,
        cod_enabled: dbState.paymentConfig.codEnabled,
        instructions: dbState.paymentConfig.instructions,
        updated_at: dbState.paymentConfig.updatedAt,
        updated_by: adminUser,
      })
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to sync payment settings:', error);
      });
  }

  return dbState.paymentConfig;
}

export function addBooking(booking: BookingRecord, termsSnippet: string, ip?: string, userAgent?: string): BookingRecord {
  dbState.bookings.unshift(booking);

  // Record immutable terms acceptance
  const acceptance: TermsAcceptanceRecord = {
    id: 'term-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    bookingId: booking.id,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    domain: booking.domain,
    termsVersion: '2026-v1.0',
    policySnippet: termsSnippet,
    customerIp: ip,
    userAgent,
    acceptedAt: new Date().toISOString(),
  };
  dbState.termsAcceptances.unshift(acceptance);
  saveDatabase();

  // Sync to Supabase if available
  if (supabase) {
    supabase
      .from('bookings')
      .insert({
        id: booking.id,
        domain: booking.domain,
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        event_date: booking.eventDate,
        event_time: booking.eventTime,
        delivery_area: booking.deliveryArea,
        custom_address: booking.customAddress,
        pot_count: booking.potCount,
        requested_items: booking.requestedItems,
        include_bartender: booking.includeBartender,
        include_cook: booking.includeCook,
        special_instructions: booking.specialInstructions,
        payment_method: booking.paymentMethod,
        payment_status: booking.paymentStatus,
        transaction_reference: booking.transactionReference,
        booking_status: booking.bookingStatus,
        terms_accepted: booking.termsAccepted,
        created_at: booking.createdAt,
        updated_at: booking.updatedAt,
      })
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to sync booking:', error);
      });

    supabase
      .from('terms_acceptances')
      .insert({
        id: acceptance.id,
        booking_id: acceptance.bookingId,
        customer_name: acceptance.customerName,
        customer_phone: acceptance.customerPhone,
        domain: acceptance.domain,
        terms_version: acceptance.termsVersion,
        policy_snippet: acceptance.policySnippet,
        customer_ip: acceptance.customerIp,
        user_agent: acceptance.userAgent,
        accepted_at: acceptance.acceptedAt,
      })
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to sync terms acceptance:', error);
      });
  }

  return booking;
}

export function updateBooking(bookingId: string, updates: Partial<BookingRecord>): BookingRecord | null {
  const index = dbState.bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return null;

  dbState.bookings[index] = {
    ...dbState.bookings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase();

  if (supabase) {
    supabase
      .from('bookings')
      .update({
        booking_status: dbState.bookings[index].bookingStatus,
        payment_status: dbState.bookings[index].paymentStatus,
        transaction_reference: dbState.bookings[index].transactionReference,
        payment_proof_url: dbState.bookings[index].paymentProofUrl,
        substitution_offered: dbState.bookings[index].substitutionOffered,
        substitution_note: dbState.bookings[index].substitutionNote,
        substitution_customer_confirmed: dbState.bookings[index].substitutionCustomerConfirmed,
        substitution_action_at: dbState.bookings[index].substitutionActionAt,
        updated_at: dbState.bookings[index].updatedAt,
      })
      .eq('id', bookingId)
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to update booking:', error);
      });
  }

  return dbState.bookings[index];
}

export function logAudit(action: string, details: any, adminEmail: string, ipAddress?: string): void {
  const log: AdminAuditLog = {
    id: 'audit-' + Date.now(),
    action,
    details,
    adminEmail,
    ipAddress,
    createdAt: new Date().toISOString(),
  };
  dbState.auditLogs.unshift(log);
  saveDatabase();
}

export function addProduct(product: ProductItem): ProductItem {
  dbState.products.unshift(product);
  saveDatabase();

  if (supabase) {
    supabase
      .from('products')
      .insert({
        id: product.id,
        name: product.name,
        category: product.category,
        category_label: product.categoryLabel,
        type: product.type,
        brand: product.brand,
        price: product.price,
        rental_rate: product.rentalRate,
        description: product.description,
        highlight: product.highlight,
        in_stock: product.inStock,
        rental_or_sale: product.rentalOrSale,
        rating: product.rating,
        reviews_count: product.reviewsCount,
        images: product.images,
        specs: product.specs,
        is_best_seller: product.isBestSeller,
        is_new: product.isNew,
      })
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to add product:', error);
      });
  }

  return product;
}

export function updateProduct(id: string, updates: Partial<ProductItem>): ProductItem | null {
  const index = dbState.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  dbState.products[index] = {
    ...dbState.products[index],
    ...updates,
  };
  saveDatabase();

  if (supabase) {
    supabase
      .from('products')
      .update({
        name: dbState.products[index].name,
        category: dbState.products[index].category,
        type: dbState.products[index].type,
        brand: dbState.products[index].brand,
        price: dbState.products[index].price,
        rental_rate: dbState.products[index].rentalRate,
        description: dbState.products[index].description,
        in_stock: dbState.products[index].inStock,
        rating: dbState.products[index].rating,
        images: dbState.products[index].images,
        is_best_seller: dbState.products[index].isBestSeller,
      })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to update product:', error);
      });
  }

  return dbState.products[index];
}

export function deleteProduct(id: string): boolean {
  const index = dbState.products.findIndex((p) => p.id === id);
  if (index === -1) return false;

  dbState.products.splice(index, 1);
  saveDatabase();

  if (supabase) {
    supabase
      .from('products')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('[Supabase Sync] Failed to delete product from Supabase:', error);
      });
  }

  return true;
}

export function normalizePhone(phone: string): string {
  return (phone || '').replace(/\D/g, '').slice(-10);
}

export function findCustomerUserByIdentifier(identifier: string): CustomerUser | undefined {
  const clean = (identifier || '').trim().toLowerCase();
  const cleanDigits = normalizePhone(identifier);
  return dbState.users.find(
    (u) =>
      u.email.toLowerCase() === clean ||
      (cleanDigits.length >= 10 && normalizePhone(u.phone) === cleanDigits)
  );
}

export function findCustomerUserById(userId: string): CustomerUser | undefined {
  return dbState.users.find((u) => u.id === userId);
}

export function createCustomerUser(user: CustomerUser): CustomerUser {
  dbState.users.unshift(user);
  saveDatabase();
  return user;
}

export function updateCustomerUser(userId: string, updates: Partial<CustomerUser>): CustomerUser | null {
  const index = dbState.users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  dbState.users[index] = {
    ...dbState.users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase();
  return dbState.users[index];
}

export function getCustomerBookings(user: CustomerUser): BookingRecord[] {
  const userDigits = normalizePhone(user.phone);
  return dbState.bookings.filter((b) => {
    if (b.userId && b.userId === user.id) return true;
    if (b.customerEmail && b.customerEmail.toLowerCase() === user.email.toLowerCase()) return true;
    if (userDigits.length >= 10 && normalizePhone(b.customerPhone) === userDigits) return true;
    return false;
  });
}

export function saveCookieConsent(record: CookieConsentRecord): CookieConsentRecord {
  const existingIdx = dbState.cookieConsents.findIndex((c) => c.visitorId === record.visitorId);
  if (existingIdx !== -1) {
    dbState.cookieConsents[existingIdx] = record;
  } else {
    dbState.cookieConsents.unshift(record);
  }
  saveDatabase();
  return record;
}

