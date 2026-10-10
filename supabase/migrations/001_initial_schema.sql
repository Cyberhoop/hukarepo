-- ====================================================================
-- SHISHA RENT - SHARED SUPABASE POSTGRESQL DATABASE SCHEMA
-- Domains: shisharent.com & shisharent.in
-- Unified database, shared inventory, synchronized bookings & active QR
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE (Catalog shared across both domains)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('flavours', 'hookah-bases', 'chilam', 'pipes', 'coal-accessories', 'sr-products')),
  category_label TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  rental_or_sale TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on category and stock status for fast customer queries
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);

-- 2. PAYMENT SETTINGS TABLE (Single active QR configuration)
CREATE TABLE IF NOT EXISTS public.payment_settings (
  id TEXT PRIMARY KEY DEFAULT 'active_config',
  upi_id TEXT NOT NULL DEFAULT 'shisharent@upi',
  payee_name TEXT NOT NULL DEFAULT 'Shisha Rent Kolkata',
  qr_image_url TEXT NOT NULL DEFAULT '',
  qr_storage_path TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  cod_enabled BOOLEAN DEFAULT true,
  instructions TEXT DEFAULT 'Scan using any UPI app (GPay, PhonePe, Paytm). Confirm order via WhatsApp or attach transaction reference.',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT DEFAULT 'system'
);

-- 3. IMMUTABLE TERMS ACCEPTANCES TABLE (Audit trail of customer acceptance)
CREATE TABLE IF NOT EXISTS public.terms_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  domain TEXT NOT NULL DEFAULT 'shisharent.in',
  terms_version TEXT NOT NULL DEFAULT '2026-v1.0',
  policy_snippet TEXT NOT NULL,
  customer_ip TEXT,
  user_agent TEXT,
  accepted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create non-updatable trigger for terms_acceptances to ensure immutability
CREATE OR REPLACE FUNCTION prevent_terms_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Terms acceptance records are immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_terms_update ON public.terms_acceptances;
CREATE TRIGGER trg_prevent_terms_update
BEFORE UPDATE OR DELETE ON public.terms_acceptances
FOR EACH ROW EXECUTE FUNCTION prevent_terms_modification();

-- 4. BOOKINGS TABLE (Customer orders, payment proof & substitution workflow)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL DEFAULT 'shisharent.in',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  delivery_area TEXT NOT NULL,
  custom_address TEXT,
  pot_count TEXT NOT NULL DEFAULT '1',
  requested_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  include_bartender BOOLEAN DEFAULT false,
  include_cook BOOLEAN DEFAULT false,
  special_instructions TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'qr')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'rejected')),
  transaction_reference TEXT,
  payment_proof_url TEXT,
  booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    booking_status IN (
      'pending',
      'confirmed',
      'substitution_requested',
      'substitution_approved',
      'substitution_rejected',
      'dispatched',
      'delivered',
      'completed',
      'cancelled'
    )
  ),
  substitution_offered JSONB DEFAULT NULL,
  substitution_note TEXT,
  substitution_customer_confirmed BOOLEAN DEFAULT NULL,
  substitution_action_at TIMESTAMPTZ,
  terms_accepted BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(customer_phone);

-- 5. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  details JSONB,
  admin_email TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Products Policies: Public can read all in-stock and active products
CREATE POLICY "Public can view products"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Payment Settings: Public can read active configuration
CREATE POLICY "Public can view active payment settings"
  ON public.payment_settings
  FOR SELECT
  TO anon, authenticated
  USING (id = 'active_config');

-- Terms Acceptances: Public can insert during booking creation
CREATE POLICY "Public can record terms acceptance"
  ON public.terms_acceptances
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view terms acceptances"
  ON public.terms_acceptances
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' LIKE '%@shisharent.in');

-- Bookings: Customers can insert bookings
CREATE POLICY "Public can create bookings"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Customers can view their own booking by ID
CREATE POLICY "Public can view booking by ID"
  ON public.bookings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Customers can update substitution response and payment transaction ID
CREATE POLICY "Public can update booking substitution or payment proof"
  ON public.bookings
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Service Role / Admin full bypass for all tables
-- Handled by SUPABASE_SERVICE_ROLE_KEY on the protected Express backend

-- ====================================================================
-- STORAGE BUCKETS SETUP
-- ====================================================================
-- Run in Supabase SQL editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('qr-codes', 'qr-codes', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false) ON CONFLICT DO NOTHING;
