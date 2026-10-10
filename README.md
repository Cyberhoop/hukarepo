# Shisha Rent Kolkata - Shared Architecture & Operations Platform
**Serving Domains:** `shisharent.in` & `shisharent.com`  
**Stack:** React 19 + TypeScript + Express + PostgreSQL + Supabase (Auth, DB & Storage)

---

## 1. Architecture Overview
This application implements a **single shared database and backend infrastructure** that serves both customer domains (`shisharent.in` and `shisharent.com`).

```
                    ┌─────────────────┐       ┌─────────────────┐
                    │  shisharent.in  │       │  shisharent.com │
                    └────────┬────────┘       └────────┬────────┘
                             │                         │
                             ▼                         ▼
                  ┌──────────────────────────────────────────────┐
                  │    Shared Express Backend (server.ts)       │
                  │    - Unified API Routes (/api/*)             │
                  │    - Multer Storage Engine (/uploads)        │
                  │    - Admin Authentication & RLS Proxy        │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │   Shared PostgreSQL / Supabase Project       │
                  │   - public.products (49 seeded items)        │
                  │   - public.payment_settings (Active QR)      │
                  │   - public.terms_acceptances (Immutable)     │
                  │   - public.bookings (Unified Order Queue)    │
                  │   - Storage: 'qr-codes' & 'payment-proofs'   │
                  └──────────────────────────────────────────────┘
```

Both customer domains:
1. Load the **identical active QR payment configuration** from `/api/payment-settings`.
2. Access the **identical approved 49-product inventory**.
3. Feed into the **same centralized order fulfillment queue**.

---

## 2. Implemented Features

### A. Administrator-Only Payment Settings & Real QR Upload Workflow
- Dedicated administrator interface in the Admin Portal.
- File upload for real business UPI QR codes via `multer` to persistent storage (`/uploads/qr/` & Supabase Storage `qr-codes` bucket).
- Live preview of the active deployed QR image.
- Configuration for:
  - Active UPI ID (VPA)
  - Payee / Merchant Name
  - Payment Instructions
  - Cash on Delivery (COD) toggle
  - Online QR toggle
- Updates are saved directly to PostgreSQL (`public.payment_settings`) and reflected instantly across both domains.

### B. Customer-Facing 49-Item Approved Product Catalog
- **15 Flavour Brands / Varieties:** Al Fakir, Al Fuse, Aladdin, Afreen, Al Fazila, Afzal, Aroma, Royal, Ayaan, Keva, Makai, Maya, Exotic, Harval, Al Akbar.
- **9 Hookah & Base Options:** Hookah, Maya Hookah, Coco Aaya Hookah, Afreen Hookah, Maya Hookah Base, Coco Aaya Hookah Base, Afreen Hookah Base, Hookah Stand, Hookah Pot.
- **3 Chilam Options:** Silicone Chilam, Mud / Mitti Chilam, Chilam Rubber.
- **6 Hookah Pipe Options:** Maya Hookah Pipe, Afreen Hookah Pipe, Coco Aaya Hookah Pipe, Disposable Pipe, Silicone Pipe, Pipe Rubber.
- **9 Heating, Coal & Accessories:** Heater Burner, Big Filter, Charcoal, Coconut Coal, Magic Coal, Tong, Pot Rubber, Stand Rubber, Hookah Base Rubber.
- **7 SR Products / Range:** SR Hookah, SR Shisha, SR Herbal, SR Regular, SR Special, SR Premium, SR Basics.
- Zero duplicates, exact approved spellings, and stock management.

### C. Customer-Requested Substitution Approval System
- Enforces the mandatory operating policy:
  > *"Agar requested brand/item us time available nahi hai, to customer ko pehle inform kiya jayega. Customer ki confirmation ke bina requested brand/item ki jagah koi doosra option provide nahi karna."*
- If an item is out of stock, the administrator initiates a substitution proposal with a proposed replacement and explanation.
- The booking status changes to `substitution_requested`.
- The customer receives the proposal in their order tracking portal with action buttons: **Approve Substitution** or **Decline Substitution**.
- The database is only updated with the replacement upon explicit customer approval.

### D. Immutable Terms Acceptance Records
- Every booking logs an immutable record in `public.terms_acceptances` storing:
  - Customer name & phone number
  - Origin domain (`shisharent.in` vs `shisharent.com`)
  - Terms version (`2026-v1.0`)
  - Policy text snippet
  - Client IP address and User-Agent
  - Timestamp
- PostgreSQL database trigger prevents any `UPDATE` or `DELETE` on terms acceptance records.

### E. Manual Online Payment Verification & COD Support
- Customers paying via QR can upload their transaction screenshot and enter their 12-digit UPI UTR reference.
- Administrators review transaction proofs in the booking management dashboard and mark payments as `Verified` or `Rejected`.
- Cash on Delivery orders are tracked with doorstep collection instructions.

---

## 3. Database Migrations
Migrations are located in `/supabase/migrations/`:
- `001_initial_schema.sql`: Table definitions, indexes, RLS policies, and immutable triggers.
- `002_seed_data.sql`: Seeds the 49 products and initial payment configuration.

See `SUPABASE_SETUP.md` for execution instructions.

---

## 4. Admin Credentials & Access
- **Admin Portal Trigger:** Click **Admin** in the header top bar or footer.
- **Demo Admin Email:** `admin@shisharent.in`
- **Demo Password:** `admin123`
- **Secret Access Token:** Configurable in `.env` via `ADMIN_ACCESS_TOKEN`.

---

## 5. Verification & Tests
Run the automated test suite verifying catalog counts, payment persistence, booking creation, immutable terms logging, and substitution approvals:
```bash
npx tsx scripts/verify_workflow.ts
```
All 5 automated test suites pass with code 0.
