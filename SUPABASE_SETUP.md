# Supabase Integration & Setup Guide for Shisha Rent
**Domains:** `shisharent.in` & `shisharent.com`  
**Database:** Single Shared Supabase PostgreSQL Project  

---

## 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a new project (e.g. `shisharent-production`).
2. Choose your cloud region (recommend **Asia South - Mumbai** for lowest latency to Kolkata).
3. Set a strong database password and save it securely.

---

## 2. Execute SQL Database Migrations
Open your Supabase Project dashboard, navigate to **SQL Editor**, and run the migration scripts in this order:

### Step 2.1: Run `supabase/migrations/001_initial_schema.sql`
This creates:
- `public.products`: Catalog shared across `shisharent.com` and `shisharent.in`.
- `public.payment_settings`: Active UPI QR and merchant configuration.
- `public.terms_acceptances`: **Immutable audit table** with PostgreSQL trigger preventing UPDATE or DELETE.
- `public.bookings`: Orders, items, payment statuses, and product substitution workflow.
- `public.admin_audit_logs`: Audit trail for administrative actions.
- Row Level Security (RLS) policies for anon customers and authenticated admins.

### Step 2.2: Run `supabase/migrations/002_seed_data.sql`
This populates:
- The default active payment configuration.
- All **49 approved products** across the 6 categories (Flavours, Hookah & Bases, Chilam, Pipes, Coal & Accessories, and SR Products) with exact spellings and zero duplicate entries.

---

## 3. Configure Supabase Storage Buckets
1. In the Supabase Dashboard, go to **Storage** > **Buckets**.
2. Create Bucket 1:
   - **Bucket Name:** `qr-codes`
   - **Public Bucket:** Enabled (`true`)
   - Purpose: Stores active QR images uploaded by administrators.
3. Create Bucket 2:
   - **Bucket Name:** `payment-proofs`
   - **Public Bucket:** Disabled or authenticated
   - Purpose: Stores customer payment transaction screenshots.

### Run Storage RLS Policy in SQL Editor:
```sql
-- Allow public to view QR codes
CREATE POLICY "Public QR Code Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'qr-codes');

-- Allow authenticated admins to upload QR codes
CREATE POLICY "Admin Upload QR Code"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'qr-codes');

-- Allow customers to upload payment screenshot proofs
CREATE POLICY "Customer Upload Payment Proof"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs');
```

---

## 4. Environment Variables Setup
Copy `.env.example` to `.env` (or configure in your deployment platform environment variables):

```ini
PORT=3000
APP_URL="https://shisharent.in"
PRIMARY_DOMAIN="shisharent.in"
SECONDARY_DOMAIN="shisharent.com"

# Supabase API Settings (Project Settings > API)
SUPABASE_URL="https://<YOUR-PROJECT-REF>.supabase.co"
SUPABASE_ANON_KEY="<YOUR-ANON-PUBLIC-KEY>"
VITE_SUPABASE_URL="https://<YOUR-PROJECT-REF>.supabase.co"
VITE_SUPABASE_ANON_KEY="<YOUR-ANON-PUBLIC-KEY>"

# Protected Server-Side Key (Project Settings > API > service_role)
# NEVER expose this key to client-side code!
SUPABASE_SERVICE_ROLE_KEY="<YOUR-SERVICE-ROLE-KEY>"

# Admin Security
ADMIN_EMAIL="admin@shisharent.in"
ADMIN_PASSWORD_HASH="admin123"
ADMIN_ACCESS_TOKEN="sr_admin_secret_token_change_in_production"
```

---

## 5. Multi-Domain Handling
Both `shisharent.in` and `shisharent.com` connect to this single Supabase instance:
- `shisharent.in` passes `domain: "shisharent.in"` on booking submission.
- `shisharent.com` passes `domain: "shisharent.com"` on booking submission.
- The administrator can filter bookings by domain or view the combined master order queue.
- Both domains query `/api/payment-settings` to display the identical active QR code.
