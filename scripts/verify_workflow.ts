/**
 * Workflow and Architecture Verification Script for Shisha Rent
 * Validates backend data persistence, API logic, substitution approval,
 * immutable terms logging, and payment settings.
 */

import {
  initDatabase,
  getDatabase,
  updatePaymentConfig,
  addBooking,
  updateBooking,
  BookingRecord,
} from '../src/server/db';
import { ALL_PRODUCTS, CUSTOMER_POLICY } from '../src/data/productsData';

async function runTests() {
  console.log('--- STARTING SHISHA RENT WORKFLOW VERIFICATION ---');

  // Test 1: Seeded Product Inventory Count and Uniqueness
  initDatabase();
  const db = getDatabase();

  console.log(`[Test 1] Checking Seeded Product Catalog...`);
  console.log(`  -> Total products in catalog: ${ALL_PRODUCTS.length}`);
  if (ALL_PRODUCTS.length !== 49) {
    throw new Error(`Expected exactly 49 approved products, got ${ALL_PRODUCTS.length}`);
  }

  // Check for duplicates
  const namesSet = new Set<string>();
  for (const p of ALL_PRODUCTS) {
    if (namesSet.has(p.name)) {
      throw new Error(`Duplicate product name found: ${p.name}`);
    }
    namesSet.add(p.name);
  }
  console.log(`  ✓ PASSED: Exactly 49 unique approved product names verified without duplicates.`);

  // Test 2: Active Payment Configuration
  console.log(`[Test 2] Checking Active Payment Configuration...`);
  const initialConfig = db.paymentConfig;
  console.log(`  -> Active UPI ID: ${initialConfig.upiId}`);
  console.log(`  -> Payee Name: ${initialConfig.payeeName}`);
  console.log(`  -> COD Enabled: ${initialConfig.codEnabled}`);

  const updatedConfig = updatePaymentConfig(
    {
      upiId: 'shisharent.kolkata@okhdfcbank',
      payeeName: 'Shisha Rent Private Limited',
      qrImageUrl: '/uploads/qr/active_qr_test.png',
      qrStoragePath: 'qr/active_qr_test.png',
      codEnabled: true,
      isActive: true,
    },
    'admin@shisharent.in'
  );

  if (updatedConfig.upiId !== 'shisharent.kolkata@okhdfcbank') {
    throw new Error('Payment config update failed');
  }
  console.log(`  ✓ PASSED: Payment configuration updated and persisted.`);

  // Test 3: Booking Placement & Immutable Terms Acceptance
  console.log(`[Test 3] Testing Booking Placement & Immutable Terms Logging...`);
  const testBooking: BookingRecord = {
    id: `TEST-BK-${Date.now()}`,
    domain: 'shisharent.in',
    customerName: 'Priya Sengupta',
    customerPhone: '+91 98305 11982',
    eventDate: '2026-10-15',
    eventTime: '21:00',
    deliveryArea: 'Park Street',
    customAddress: 'Flat 3B, Queens Court',
    potCount: '2',
    requestedItems: [ALL_PRODUCTS[0], ALL_PRODUCTS[16]], // Al Fakir & Maya Hookah
    includeBartender: true,
    includeCook: false,
    specialInstructions: 'Terrace garden setup',
    paymentMethod: 'qr',
    paymentStatus: 'pending',
    bookingStatus: 'pending',
    termsAccepted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const created = addBooking(
    testBooking,
    CUSTOMER_POLICY.ruleHindiEnglish,
    '103.220.14.88',
    'Mozilla/5.0 Test Suite'
  );

  const foundTerms = db.termsAcceptances.find((t) => t.bookingId === created.id);
  if (!foundTerms) {
    throw new Error('Immutable terms acceptance record was not created for booking');
  }
  console.log(`  ✓ PASSED: Booking ${created.id} created.`);
  console.log(`  ✓ PASSED: Immutable Terms record logged (${foundTerms.id}) with IP ${foundTerms.customerIp}.`);

  // Test 4: Product Substitution Workflow (Mandatory Policy Rule)
  console.log(`[Test 4] Testing Product Substitution Approval Rule...`);
  // Admin proposes substitute
  updateBooking(created.id, {
    bookingStatus: 'substitution_requested',
    substitutionOffered: {
      unavailableItem: 'Al Fakir',
      offeredItem: 'Royal',
      reason: 'Batch curing in progress',
    },
    substitutionCustomerConfirmed: null,
  });

  const subBooking = db.bookings.find((b) => b.id === created.id);
  if (subBooking?.bookingStatus !== 'substitution_requested') {
    throw new Error('Failed to set substitution_requested status');
  }
  console.log(`  -> Substitution offer dispatched to customer for booking ${created.id}`);

  // Customer approves substitution
  updateBooking(created.id, {
    bookingStatus: 'substitution_approved',
    substitutionCustomerConfirmed: true,
    substitutionActionAt: new Date().toISOString(),
    substitutionNote: 'Customer approved Royal instead of Al Fakir via web portal',
    requestedItems: [ALL_PRODUCTS[7], ALL_PRODUCTS[16]], // Replaced Al Fakir with Royal
  });

  const approvedBooking = db.bookings.find((b) => b.id === created.id);
  if (approvedBooking?.bookingStatus !== 'substitution_approved') {
    throw new Error('Customer substitution approval failed');
  }
  console.log(`  ✓ PASSED: Customer substitution approved and confirmed in booking record.`);

  // Test 5: Manual Online Payment Verification
  console.log(`[Test 5] Testing Manual Online Payment Verification...`);
  updateBooking(created.id, {
    transactionReference: 'UPI/20261015/HDFC7721',
    paymentProofUrl: '/uploads/payments/test_receipt.png',
    paymentStatus: 'verified',
    bookingStatus: 'confirmed',
  });

  const verifiedBooking = db.bookings.find((b) => b.id === created.id);
  if (verifiedBooking?.paymentStatus !== 'verified' || verifiedBooking?.bookingStatus !== 'confirmed') {
    throw new Error('Payment verification status update failed');
  }
  console.log(`  ✓ PASSED: Payment verified and booking confirmed.`);

  console.log('\n======================================================');
  console.log('ALL WORKFLOW & PERSISTENCE VERIFICATION TESTS PASSED!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('TEST SUITE FAILED:', err);
  process.exit(1);
});
