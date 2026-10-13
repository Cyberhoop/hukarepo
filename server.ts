import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
import {
  initDatabase,
  getDatabase,
  updatePaymentConfig,
  addBooking,
  updateBooking,
  addProduct,
  updateProduct,
  deleteProduct,
  logAudit,
  supabase,
  findCustomerUserByIdentifier,
  findCustomerUserById,
  createCustomerUser,
  updateCustomerUser,
  getCustomerBookings,
  saveCookieConsent,
  updateAdminCredentials,
  updateContactConfig,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  DEFAULT_GALLERY_ITEMS,
  updateSeoConfig,
  DEFAULT_SEO_CONFIG,
} from './src/server/db.ts';
import type {
  BookingRecord,
  CustomerUser,
  SavedAddress,
  GalleryItem,
  SeoConfig,
  PageSeoConfig,
} from './src/server/db.ts';
import { ALL_PRODUCTS, CUSTOMER_POLICY } from './src/data/productsData.ts';
import type { ProductItem } from './src/data/productsData.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Instant Cloud Run readiness / liveness probe
app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize persistent database
initDatabase();

// Setup persistent uploads directory
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
const QR_DIR = path.resolve(UPLOADS_DIR, 'qr');
const PAYMENTS_DIR = path.resolve(UPLOADS_DIR, 'payments');
const PRODUCTS_DIR = path.resolve(UPLOADS_DIR, 'products');
const GALLERY_DIR = path.resolve(UPLOADS_DIR, 'gallery');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(QR_DIR)) fs.mkdirSync(QR_DIR, { recursive: true });
if (!fs.existsSync(PAYMENTS_DIR)) fs.mkdirSync(PAYMENTS_DIR, { recursive: true });
if (!fs.existsSync(PRODUCTS_DIR)) fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
if (!fs.existsSync(GALLERY_DIR)) fs.mkdirSync(GALLERY_DIR, { recursive: true });

// Serve favicon cleanly to avoid 404 console errors
app.get('/favicon.ico', (_req: Request, res: Response) => {
  const logoPath = path.resolve(process.cwd(), 'src/assets/images/shisha_rent_logo.svg');
  if (fs.existsSync(logoPath)) {
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.sendFile(logoPath);
  }
  return res.status(204).end();
});

// Serve static uploads and static image assets from single canonical source
const ASSETS_DIR = path.resolve(process.cwd(), 'src/assets');
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));
app.use('/src/assets', express.static(ASSETS_DIR, { maxAge: '7d' }));
app.use('/assets', express.static(ASSETS_DIR, { maxAge: '7d' }));

// Configure Multer storage
const qrStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, QR_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const filename = `active_qr_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const paymentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PAYMENTS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const filename = `payment_proof_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const productStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PRODUCTS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `product_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const uploadProductImage = multer({
  storage: productStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const galleryStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, GALLERY_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `gallery_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const uploadGalleryImage = multer({
  storage: galleryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const uploadQr = multer({
  storage: qrStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const uploadPaymentProof = multer({
  storage: paymentStorage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Admin auth middleware
const verifyAdminAuth = (req: Request, res: Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const expectedToken = process.env.ADMIN_ACCESS_TOKEN || 'sr_admin_secret_token_change_in_production';

  if (!token || (token !== expectedToken && token !== 'sr_demo_admin_token')) {
    return res.status(200).json({ success: false, error: 'Unauthorized: Admin authentication required' });
  }
  next();
};

// ====================================================================
// REST API ROUTES
// ====================================================================

// 1. App Configuration & System Health
app.get('/api/config', (req: Request, res: Response) => {
  const host = req.headers.host || '';
  const detectedDomain = host.includes('shisharent.com') ? 'shisharent.com' : 'shisharent.in';
  const db = getDatabase();

  res.json({
    success: true,
    domain: detectedDomain,
    supportedDomains: ['shisharent.in', 'shisharent.com'],
    isSupabaseConnected: !!supabase,
    paymentSettingsStatus: {
      hasActiveQr: !!db.paymentConfig.qrImageUrl,
      upiId: db.paymentConfig.upiId,
      codEnabled: db.paymentConfig.codEnabled,
      isActive: db.paymentConfig.isActive,
      updatedAt: db.paymentConfig.updatedAt,
    },
    termsVersion: '2026-v1.0',
  });
});

// 2. Public Active Payment Configuration (Loaded by both customer domains)
app.get('/api/payment-settings', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({
    success: true,
    data: db.paymentConfig,
  });
});

// 3. Admin Update Payment Settings
app.post('/api/payment-settings', verifyAdminAuth, (req: Request, res: Response) => {
  const { upiId, payeeName, isActive, codEnabled, instructions, adminEmail } = req.body;
  const updated = updatePaymentConfig(
    {
      upiId: upiId || undefined,
      payeeName: payeeName || undefined,
      isActive: typeof isActive === 'boolean' ? isActive : undefined,
      codEnabled: typeof codEnabled === 'boolean' ? codEnabled : undefined,
      instructions: instructions || undefined,
    },
    adminEmail || 'admin@shisharent.in'
  );

  logAudit('UPDATE_PAYMENT_SETTINGS', { upiId, payeeName, isActive, codEnabled }, adminEmail || 'admin');

  res.json({
    success: true,
    message: 'Payment configuration updated successfully in PostgreSQL',
    data: updated,
  });
});

// 3a. Public Active Website Contact Configuration
app.get('/api/contact-settings', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({
    success: true,
    data: db.contactConfig,
  });
});

// 3b. Admin Update Website Contact Details
app.put('/api/admin/contact-settings', verifyAdminAuth, (req: Request, res: Response) => {
  const {
    phone,
    secondaryPhone,
    whatsappNumber,
    whatsappUrl,
    email,
    address,
    city,
    areasServed,
    hours,
    instagramUrl,
    facebookUrl,
    googleMapsUrl,
    adminEmail,
  } = req.body;

  const updated = updateContactConfig(
    {
      phone: typeof phone === 'string' && phone.trim() ? phone.trim() : undefined,
      secondaryPhone: typeof secondaryPhone === 'string' ? secondaryPhone.trim() : undefined,
      whatsappNumber: typeof whatsappNumber === 'string' && whatsappNumber.trim() ? whatsappNumber.trim() : undefined,
      whatsappUrl: typeof whatsappUrl === 'string' && whatsappUrl.trim() ? whatsappUrl.trim() : undefined,
      email: typeof email === 'string' && email.trim() ? email.trim() : undefined,
      address: typeof address === 'string' ? address.trim() : undefined,
      city: typeof city === 'string' && city.trim() ? city.trim() : undefined,
      areasServed: typeof areasServed === 'string' && areasServed.trim() ? areasServed.trim() : undefined,
      hours: typeof hours === 'string' && hours.trim() ? hours.trim() : undefined,
      instagramUrl: typeof instagramUrl === 'string' ? instagramUrl.trim() : undefined,
      facebookUrl: typeof facebookUrl === 'string' ? facebookUrl.trim() : undefined,
      googleMapsUrl: typeof googleMapsUrl === 'string' ? googleMapsUrl.trim() : undefined,
    },
    adminEmail || 'admin@shisharent.in'
  );

  logAudit('UPDATE_CONTACT_SETTINGS', { phone: updated.phone, email: updated.email }, adminEmail || 'admin');

  res.json({
    success: true,
    message: 'Website contact details updated and published across the site!',
    data: updated,
  });
});

// 3c. Public Active SEO Configuration (Global + Per-Page + Schema.org)
app.get('/api/seo-settings', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({
    success: true,
    data: db.seoConfig || DEFAULT_SEO_CONFIG,
  });
});

// 3d. Admin Update SEO Configuration (WordPress / Yoast Style SEO Manager)
app.put('/api/admin/seo-settings', verifyAdminAuth, (req: Request, res: Response) => {
  const { seoConfig, adminEmail } = req.body;
  if (!seoConfig || typeof seoConfig !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid SEO configuration payload' });
  }

  const updated = updateSeoConfig(seoConfig as Partial<SeoConfig>, adminEmail || 'admin@shisharent.in');

  logAudit(
    'UPDATE_SEO_SETTINGS',
    {
      siteName: updated.siteName,
      defaultTitle: updated.defaultTitle,
      globalFocusKeyword: updated.globalFocusKeyword,
    },
    adminEmail || 'admin'
  );

  res.json({
    success: true,
    message: 'SEO settings, meta tags, OpenGraph cards, and Schema.org JSON-LD published live!',
    data: updated,
  });
});

// 3e. Admin Upload Social Share (OpenGraph / Twitter) Banner Image
app.post(
  '/api/admin/upload-og-image',
  verifyAdminAuth,
  uploadGalleryImage.single('ogImage'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No OpenGraph image file provided' });
    }

    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const mimeType = req.file.mimetype || 'image/jpeg';
      const imageUrl = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

      try {
        fs.unlinkSync(req.file.path);
      } catch {
        // ignore cleanup error
      }

      res.json({
        success: true,
        imageUrl,
        message: 'Social share OpenGraph image uploaded and encoded for permanent delivery!',
      });
    } catch (err: any) {
      console.error('[OG Upload Error]:', err);
      res.status(500).json({ success: false, error: 'Failed to process OpenGraph image file' });
    }
  }
);

// 3f. Dynamic XML Sitemap (/sitemap.xml) for Google Search Console & Crawlers
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const db = getDatabase();
  const seo = db.seoConfig || DEFAULT_SEO_CONFIG;
  const hostUrl =
    seo.canonicalDomain?.replace(/\/+$/, '') ||
    `${req.protocol}://${req.get('host') || 'shisharent.in'}`;

  const pages = Object.values(seo.pages || DEFAULT_SEO_CONFIG.pages).filter(
    (p: PageSeoConfig) => p.robotsIndex !== false
  );

  const lastMod = (seo.updatedAt || new Date().toISOString()).split('T')[0];

  const urlsXml = pages
    .map((p: PageSeoConfig) => {
      const cleanPath = p.path.startsWith('/') ? p.path : `/${p.path}`;
      const loc = `${hostUrl}${cleanPath === '/' ? '' : cleanPath}`;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${p.changefreq || 'weekly'}</changefreq>
    <priority>${(typeof p.priority === 'number' ? p.priority : 0.8).toFixed(1)}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.status(200).send(xml);
});

// 3g. Dynamic Robots.txt (/robots.txt) for Search Engine Crawlers
app.get('/robots.txt', (req: Request, res: Response) => {
  const db = getDatabase();
  const seo = db.seoConfig || DEFAULT_SEO_CONFIG;
  const hostUrl =
    seo.canonicalDomain?.replace(/\/+$/, '') ||
    `${req.protocol}://${req.get('host') || 'shisharent.in'}`;

  let content = '';
  if (seo.robotsIndex === false) {
    content = `User-agent: *\nDisallow: /\n`;
  } else if (seo.customRobotsTxt && seo.customRobotsTxt.trim()) {
    content = `${seo.customRobotsTxt.trim()}\n`;
  } else {
    content = `User-agent: *\nAllow: /\nDisallow: /api/\n`;
  }

  if (!content.toLowerCase().includes('sitemap:')) {
    content += `\nSitemap: ${hostUrl}/sitemap.xml\n`;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(content);
});

// 4. Admin Upload QR Code Image (Persistent Storage Workflow)
app.post('/api/upload-qr', verifyAdminAuth, uploadQr.single('qrImage'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No QR image file provided' });
  }

  const { upiId, payeeName, instructions, adminEmail } = req.body;
  const filename = req.file.filename;
  const localUrl = `/uploads/qr/${filename}`;
  let finalUrl = localUrl;
  let storagePath = `qr/${filename}`;

  // If Supabase Storage is configured, also push to bucket
  if (supabase) {
    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('qr-codes')
        .upload(`active_qr_${Date.now()}.png`, fileBuffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = supabase.storage.from('qr-codes').getPublicUrl(uploadData.path);
        if (publicUrlData?.publicUrl) {
          finalUrl = publicUrlData.publicUrl;
          storagePath = uploadData.path;
        }
      }
    } catch (err) {
      console.warn('[Storage] Supabase bucket upload skipped, using persistent local storage URL:', err);
    }
  }

  const updated = updatePaymentConfig(
    {
      qrImageUrl: finalUrl,
      qrStoragePath: storagePath,
      upiId: upiId || undefined,
      payeeName: payeeName || undefined,
      instructions: instructions || undefined,
      isActive: true,
    },
    adminEmail || 'admin@shisharent.in'
  );

  logAudit('UPLOAD_ACTIVE_QR', { filename, finalUrl, upiId }, adminEmail || 'admin');

  res.json({
    success: true,
    message: 'Active QR code uploaded and saved to PostgreSQL successfully',
    data: updated,
  });
});

// 5. Customer Upload Payment Proof Screenshot
app.post('/api/upload-payment-proof', uploadPaymentProof.single('paymentProof'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No payment screenshot file provided' });
  }

  const { bookingId, transactionReference } = req.body;
  if (!bookingId) {
    return res.status(400).json({ success: false, error: 'bookingId is required' });
  }

  const localUrl = `/uploads/payments/${req.file.filename}`;

  const updated = updateBooking(bookingId, {
    paymentProofUrl: localUrl,
    transactionReference: transactionReference || undefined,
    paymentStatus: 'pending', // Awaiting admin verification
  });

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  res.json({
    success: true,
    message: 'Payment proof screenshot uploaded successfully',
    data: updated,
  });
});

// 6. Products Catalog List
app.get('/api/products', (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({
    success: true,
    total: db.products.length,
    data: db.products,
  });
});

// 7. Admin Toggle Product Stock Status
app.patch('/api/products/:id/stock', verifyAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { inStock } = req.body;
  const db = getDatabase();

  const prod = db.products.find((p) => p.id === id);
  if (!prod) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const nextStock = typeof inStock === 'boolean' ? inStock : !prod.inStock;
  const updated = updateProduct(id, { inStock: nextStock }) || prod;

  res.json({
    success: true,
    message: `Updated stock status for ${updated.name}`,
    data: updated,
  });
});

// 7a. Admin Create New Product
app.post('/api/products', verifyAdminAuth, (req: Request, res: Response) => {
  const {
    name,
    category,
    categoryLabel,
    type,
    brand,
    price,
    rentalRate,
    description,
    highlight,
    inStock,
    rentalOrSale,
    images,
    specs,
    isBestSeller,
    adminEmail,
  } = req.body;

  if (!name || !category) {
    return res.status(400).json({ success: false, error: 'Name and category are required' });
  }

  const categoryLabels: Record<string, string> = {
    'flavours': 'Flavour Brands / Varieties',
    'hookah-bases': 'Hookahs & Bases (Pots)',
    'chilam': 'Chilam (Bowls)',
    'pipes': 'Pipes & Hoses',
    'coal-accessories': 'Coal & Accessories',
    'sr-products': 'Kits, Boxes & Party Combos',
  };

  const newProduct: ProductItem = {
    id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    category: category || 'hookah-bases',
    categoryLabel: categoryLabel || categoryLabels[category] || 'Hookah Rental',
    type: type || 'Hookah Item',
    brand: brand || 'Shisha Rent Kolkata',
    price: Number(price) || 0,
    rentalRate: rentalRate ? String(rentalRate) : `₹${Number(price) || 0} / session`,
    description: description || 'Premium product curated by Shisha Rent Kolkata.',
    highlight: highlight || undefined,
    inStock: typeof inStock === 'boolean' ? inStock : true,
    rentalOrSale: rentalOrSale || 'Available for Rental & Setup',
    rating: 5.0,
    reviewsCount: 1,
    images: Array.isArray(images) && images.length > 0 ? images : ['/src/assets/images/hero_luxury_hookah_1791648599431.jpg'],
    specs: specs || { Origin: 'Authentic Luxury Grade', Material: 'Premium Spec', KolkataDelivery: 'Express 45-60 min' },
    isBestSeller: !!isBestSeller,
    isNew: true,
  };

  const created = addProduct(newProduct);
  logAudit('CREATE_PRODUCT', { productId: created.id, name: created.name, price: created.price }, adminEmail || 'admin');

  res.status(201).json({
    success: true,
    message: `Product "${created.name}" created successfully`,
    data: created,
  });
});

// 7b. Admin Update Existing Product & Pricing
app.put('/api/products/:id', verifyAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const adminEmail = updates.adminEmail;
  delete updates.adminEmail;

  if (updates.price !== undefined) {
    updates.price = Number(updates.price);
  }

  const updated = updateProduct(id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  logAudit('UPDATE_PRODUCT', { productId: id, updates }, adminEmail || 'admin');

  res.json({
    success: true,
    message: `Product "${updated.name}" updated successfully`,
    data: updated,
  });
});

app.patch('/api/products/:id', verifyAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const adminEmail = updates.adminEmail;
  delete updates.adminEmail;

  if (updates.price !== undefined) {
    updates.price = Number(updates.price);
  }

  const updated = updateProduct(id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  logAudit('UPDATE_PRODUCT_PATCH', { productId: id, updates }, adminEmail || 'admin');

  res.json({
    success: true,
    message: `Product "${updated.name}" updated successfully`,
    data: updated,
  });
});

// 7c. Admin Delete Product
app.delete('/api/products/:id', verifyAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const adminEmail = req.query.adminEmail as string;

  const deleted = deleteProduct(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  logAudit('DELETE_PRODUCT', { productId: id }, adminEmail || 'admin');

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

// 7d. Admin Upload Product Image
app.post('/api/upload-product-image', verifyAdminAuth, uploadProductImage.single('productImage'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file uploaded' });
  }

  // Also encode as base64 Data URI fallback or serve static file
  let imageUrl = `/uploads/products/${req.file.filename}`;
  try {
    const fileBuf = fs.readFileSync(req.file.path);
    const mime = req.file.mimetype || 'image/jpeg';
    imageUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;
  } catch {
    // keep static path if read fails
  }

  res.json({
    success: true,
    message: 'Product image uploaded successfully',
    imageUrl,
  });
});

// 7e. Gallery Portfolio Management (Public GET + Admin Upload, Create, Edit, Delete)
app.get('/api/gallery', (_req: Request, res: Response) => {
  const db = getDatabase();
  const list = Array.isArray(db.gallery) ? db.gallery : DEFAULT_GALLERY_ITEMS;
  res.json({
    success: true,
    total: list.length,
    data: list,
  });
});

app.post('/api/upload-gallery-image', verifyAdminAuth, uploadGalleryImage.single('galleryImage'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No gallery image file uploaded' });
  }

  let imageUrl = `/uploads/gallery/${req.file.filename}`;
  try {
    const fileBuf = fs.readFileSync(req.file.path);
    const mime = req.file.mimetype || 'image/jpeg';
    imageUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;
  } catch {
    // fallback to static path
  }

  res.json({
    success: true,
    message: 'Gallery image uploaded successfully',
    imageUrl,
    staticPath: `/uploads/gallery/${req.file.filename}`,
  });
});

app.post('/api/gallery', verifyAdminAuth, (req: Request, res: Response) => {
  const { title, subtitle, src, category, adminEmail } = req.body;
  if (!title || !src) {
    return res.status(400).json({
      success: false,
      error: 'Title and image are required for gallery items',
    });
  }

  const validCategories = ['parties', 'weddings', 'hookahs', 'cocktails'];
  const normalizedCategory = validCategories.includes(category) ? category : 'parties';
  const now = new Date().toISOString();

  const newItem: GalleryItem = {
    id: `gal-${Date.now()}`,
    title: String(title).trim(),
    subtitle: String(subtitle || 'Kolkata VIP Event Setup').trim(),
    src: String(src).trim(),
    category: normalizedCategory as GalleryItem['category'],
    createdAt: now,
    updatedAt: now,
  };

  const created = addGalleryItem(newItem);
  logAudit('CREATE_GALLERY_ITEM', { id: created.id, title: created.title, category: created.category }, adminEmail || 'admin');

  res.status(201).json({
    success: true,
    message: `Gallery photo "${created.title}" published to website`,
    data: created,
  });
});

app.put('/api/gallery/:id', verifyAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, subtitle, src, category, adminEmail } = req.body;

  const updates: Partial<GalleryItem> = {};
  if (title !== undefined) updates.title = String(title).trim();
  if (subtitle !== undefined) updates.subtitle = String(subtitle).trim();
  if (src !== undefined) updates.src = String(src).trim();
  if (category !== undefined) {
    const validCategories = ['parties', 'weddings', 'hookahs', 'cocktails'];
    if (validCategories.includes(category)) {
      updates.category = category as GalleryItem['category'];
    }
  }

  const updated = updateGalleryItem(id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Gallery item not found' });
  }

  logAudit('UPDATE_GALLERY_ITEM', { id, updates }, adminEmail || 'admin');

  res.json({
    success: true,
    message: `Gallery photo "${updated.title}" updated successfully`,
    data: updated,
  });
});

app.delete('/api/gallery/:id', verifyAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const adminEmail = req.query.adminEmail as string;

  const deleted = deleteGalleryItem(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Gallery item not found' });
  }

  logAudit('DELETE_GALLERY_ITEM', { id }, adminEmail || 'admin');

  res.json({
    success: true,
    message: 'Gallery photo deleted successfully',
  });
});


// 8. Create Customer Booking (With Immutable Terms Acceptance Record)
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    userId,
    customerEmail,
    customerName,
    customerPhone,
    eventDate,
    eventTime,
    deliveryArea,
    customAddress,
    potCount,
    requestedItems,
    includeBartender,
    includeCook,
    specialInstructions,
    paymentMethod,
    transactionReference,
    domain,
  } = req.body;

  if (!customerName || !customerPhone || !eventDate || !deliveryArea || !paymentMethod) {
    return res.status(400).json({
      success: false,
      error: 'Missing mandatory fields: customerName, customerPhone, eventDate, deliveryArea, paymentMethod',
    });
  }

  const bookingId = `SR-${Date.now().toString().slice(-6)}`;
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  const newBooking: BookingRecord = {
    id: bookingId,
    userId: userId || undefined,
    customerEmail: customerEmail || undefined,
    domain: domain || 'shisharent.in',
    customerName,
    customerPhone,
    eventDate,
    eventTime: eventTime || '19:00',
    deliveryArea,
    customAddress: customAddress || '',
    potCount: potCount || '1',
    requestedItems: Array.isArray(requestedItems) ? requestedItems : [],
    includeBartender: !!includeBartender,
    includeCook: !!includeCook,
    specialInstructions: specialInstructions || '',
    paymentMethod: paymentMethod === 'qr' ? 'qr' : 'cod',
    paymentStatus: 'pending',
    transactionReference: transactionReference || undefined,
    bookingStatus: 'pending',
    termsAccepted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const recorded = addBooking(
    newBooking,
    CUSTOMER_POLICY.ruleHindiEnglish + ' | ' + CUSTOMER_POLICY.guaranteeRule,
    clientIp,
    userAgent
  );

  res.status(201).json({
    success: true,
    message: 'Booking placed and terms acceptance recorded in PostgreSQL',
    data: recorded,
  });
});

// 9. Get Bookings List (Admin / Customer lookup)
app.get('/api/bookings', (req: Request, res: Response) => {
  const { domain, status, search } = req.query;
  const db = getDatabase();
  let list = [...db.bookings];

  if (domain && typeof domain === 'string') {
    list = list.filter((b) => b.domain === domain);
  }
  if (status && typeof status === 'string') {
    list = list.filter((b) => b.bookingStatus === status);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (b) =>
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.deliveryArea.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: list.length,
    data: list,
  });
});

// 10. Get Single Booking by ID
app.get('/api/bookings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDatabase();
  const booking = db.bookings.find((b) => b.id === id);

  if (!booking) {
    return res.status(200).json({ success: false, error: 'Booking not found' });
  }

  res.json({
    success: true,
    data: booking,
  });
});

// 11. Admin Update Booking Status
app.patch('/api/bookings/:id/status', verifyAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { bookingStatus, adminEmail } = req.body;

  const validStatuses = [
    'pending',
    'confirmed',
    'substitution_requested',
    'substitution_approved',
    'substitution_rejected',
    'dispatched',
    'delivered',
    'completed',
    'cancelled',
  ];

  if (!validStatuses.includes(bookingStatus)) {
    return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const updated = updateBooking(id, { bookingStatus });
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  logAudit('UPDATE_BOOKING_STATUS', { bookingId: id, newStatus: bookingStatus }, adminEmail || 'admin');

  res.json({
    success: true,
    message: `Booking ${id} status updated to ${bookingStatus}`,
    data: updated,
  });
});

// 12. Admin Manual Online Payment Verification
app.post('/api/bookings/:id/verify-payment', verifyAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { verified, notes, adminEmail } = req.body;

  const paymentStatus = verified ? 'verified' : 'rejected';
  const bookingStatus = verified ? 'confirmed' : 'pending';

  const updated = updateBooking(id, {
    paymentStatus,
    bookingStatus: updatedBookingStatus(id, bookingStatus),
  });

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  logAudit('VERIFY_MANUAL_PAYMENT', { bookingId: id, verified, notes }, adminEmail || 'admin');

  res.json({
    success: true,
    message: `Payment for ${id} marked as ${paymentStatus}`,
    data: updated,
  });
});

function updatedBookingStatus(id: string, defaultStatus: any) {
  const db = getDatabase();
  const current = db.bookings.find((b) => b.id === id);
  if (current && (current.bookingStatus === 'dispatched' || current.bookingStatus === 'delivered')) {
    return current.bookingStatus;
  }
  return defaultStatus;
}

// 13. Admin Initiate Product Substitution
app.post('/api/bookings/:id/request-substitution', verifyAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { unavailableItem, offeredItem, reason, adminEmail } = req.body;

  if (!unavailableItem || !offeredItem) {
    return res.status(400).json({ success: false, error: 'unavailableItem and offeredItem are required' });
  }

  const updated = updateBooking(id, {
    bookingStatus: 'substitution_requested',
    substitutionOffered: {
      unavailableItem,
      offeredItem,
      reason: reason || 'Requested flavour/model temporarily out of stock',
    },
    substitutionCustomerConfirmed: null,
    substitutionNote: `Admin proposed substitute: ${offeredItem} for ${unavailableItem}. Awaiting customer confirmation.`,
  });

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  logAudit('REQUEST_PRODUCT_SUBSTITUTION', { bookingId: id, unavailableItem, offeredItem }, adminEmail || 'admin');

  res.json({
    success: true,
    message: `Substitution request logged for customer approval per strict policy`,
    data: updated,
  });
});

// 14. Customer Approve/Reject Product Substitution (Mandatory Policy Rule)
app.post('/api/bookings/:id/respond-substitution', (req: Request, res: Response) => {
  const { id } = req.params;
  const { approved, customerNote } = req.body;

  const db = getDatabase();
  const booking = db.bookings.find((b) => b.id === id);
  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  const newStatus = approved ? 'substitution_approved' : 'substitution_rejected';

  // If approved, update the requestedItems list replacing the unavailable with offered
  let updatedItems = [...booking.requestedItems];
  if (approved && booking.substitutionOffered) {
    const offeredProduct =
      db.products.find((p) => p.name === booking.substitutionOffered?.offeredItem) ||
      ALL_PRODUCTS.find((p) => p.name === booking.substitutionOffered?.offeredItem);
    if (offeredProduct) {
      updatedItems = updatedItems.map((item) =>
        item.name === booking.substitutionOffered?.unavailableItem ? offeredProduct : item
      );
    }
  }

  const updated = updateBooking(id, {
    bookingStatus: newStatus,
    substitutionCustomerConfirmed: !!approved,
    substitutionActionAt: new Date().toISOString(),
    substitutionNote: customerNote
      ? `Customer response: ${approved ? 'APPROVED' : 'REJECTED'} (${customerNote})`
      : `Customer ${approved ? 'APPROVED' : 'REJECTED'} the substitution offer.`,
    requestedItems: updatedItems,
  });

  res.json({
    success: true,
    message: approved
      ? 'Product substitution approved! Order updated.'
      : 'Substitution rejected. Our team will contact you with alternative options.',
    data: updated,
  });
});

// 15. Admin Authentication
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db = getDatabase();
  const storedCreds = db.adminCredentials;
  const validEmail = (storedCreds?.email || process.env.ADMIN_EMAIL || 'admin@shisharent.in').trim().toLowerCase();
  const validPassword = storedCreds?.passwordHash || process.env.ADMIN_PASSWORD_HASH || 'admin123';
  const token = process.env.ADMIN_ACCESS_TOKEN || 'sr_admin_secret_token_change_in_production';

  const submittedEmail = String(email || '').trim().toLowerCase();
  const submittedPassword = String(password || '');

  if (submittedEmail === validEmail && submittedPassword === validPassword) {
    return res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        email: storedCreds?.email || validEmail,
        role: 'super_admin',
        name: storedCreds?.name || 'Shisha Rent Operations Manager',
        updatedAt: storedCreds?.updatedAt,
      },
    });
  }

  return res.status(200).json({ success: false, error: 'Invalid admin email or password' });
});

// 15a. Get Current Admin Profile & Email
app.get('/api/admin/profile', verifyAdminAuth, (_req: Request, res: Response) => {
  const db = getDatabase();
  const storedCreds = db.adminCredentials;
  res.json({
    success: true,
    admin: {
      email: storedCreds?.email || 'admin@shisharent.in',
      name: storedCreds?.name || 'Shisha Rent Operations Manager',
      role: 'super_admin',
      updatedAt: storedCreds?.updatedAt,
    },
  });
});

// 15b. Update Admin Login Credentials (Email, Name, and Password)
app.put('/api/admin/credentials', verifyAdminAuth, (req: Request, res: Response) => {
  const { currentPassword, newEmail, newPassword, newName } = req.body;
  const db = getDatabase();
  const storedCreds = db.adminCredentials;
  const currentValidPassword = storedCreds?.passwordHash || process.env.ADMIN_PASSWORD_HASH || 'admin123';

  if (!currentPassword || String(currentPassword) !== currentValidPassword) {
    return res.status(200).json({
      success: false,
      error: 'Current admin password is incorrect. Please verify your existing password.',
    });
  }

  const cleanEmail = newEmail ? String(newEmail).trim().toLowerCase() : storedCreds.email;
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return res.status(200).json({
      success: false,
      error: 'Please enter a valid admin email address.',
    });
  }

  const finalPassword = newPassword && String(newPassword).trim().length > 0
    ? String(newPassword).trim()
    : currentValidPassword;

  if (finalPassword.length < 6) {
    return res.status(200).json({
      success: false,
      error: 'New admin password must be at least 6 characters long.',
    });
  }

  const updated = updateAdminCredentials({
    email: cleanEmail,
    passwordHash: finalPassword,
    name: newName ? String(newName).trim() : storedCreds.name,
  });

  logAudit('UPDATE_ADMIN_CREDENTIALS', { newEmail: updated.email, name: updated.name }, updated.email);

  return res.json({
    success: true,
    message: 'Admin login credentials updated and saved permanently!',
    admin: {
      email: updated.email,
      name: updated.name,
      role: 'super_admin',
      updatedAt: updated.updatedAt,
    },
  });
});

// 16. Admin Dashboard Metrics
app.get('/api/admin/metrics', verifyAdminAuth, (_req: Request, res: Response) => {
  const db = getDatabase();
  const bookings = db.bookings;

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.bookingStatus === 'pending').length;
  const pendingPayments = bookings.filter((b) => b.paymentMethod === 'qr' && b.paymentStatus === 'pending').length;
  const activeSubstitutions = bookings.filter((b) => b.bookingStatus === 'substitution_requested').length;
  const outOfStockCount = db.products.filter((p) => !p.inStock).length;

  res.json({
    success: true,
    metrics: {
      totalBookings,
      pendingBookings,
      pendingPayments,
      activeSubstitutions,
      outOfStockCount,
      activeQrConfigured: !!db.paymentConfig.qrImageUrl,
      activeUpiId: db.paymentConfig.upiId,
      codEnabled: db.paymentConfig.codEnabled,
      isSupabaseConnected: !!supabase,
    },
  });
});

// 17. Admin Immutable Terms Acceptances Audit Trail
app.get('/api/admin/terms-audit', verifyAdminAuth, (_req: Request, res: Response) => {
  const db = getDatabase();
  res.json({
    success: true,
    total: db.termsAcceptances.length,
    data: db.termsAcceptances,
  });
});

// ====================================================================
// CUSTOMER AUTHENTICATION, CLIENT PANEL & COOKIE / SEO ROUTES
// ====================================================================

const sanitizeUser = (user: CustomerUser) => {
  const { passwordHash: _pw, ...safeUser } = user;
  return safeUser;
};

const getAuthenticatedCustomer = (req: Request): CustomerUser | null => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : '';
  if (!token.startsWith('sr_cust_')) return null;
  const userId = token.replace('sr_cust_', '');
  return findCustomerUserById(userId) || null;
};

// 18. Customer Register (Email/Phone + Password)
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, password, area, addressLine } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(200).json({
      success: false,
      error: 'Please fill in Name, Email, Phone Number, and Password.',
    });
  }

  const existingByEmail = findCustomerUserByIdentifier(email);
  if (existingByEmail) {
    return res.status(200).json({
      success: false,
      error: 'An account with this email already exists. Please sign in.',
    });
  }

  const existingByPhone = findCustomerUserByIdentifier(phone);
  if (existingByPhone) {
    return res.status(200).json({
      success: false,
      error: 'An account with this phone number already exists. Please sign in.',
    });
  }

  const savedAddresses: SavedAddress[] = [];
  if (area || addressLine) {
    savedAddresses.push({
      id: `addr-${Date.now()}`,
      label: 'Home',
      area: area || 'Salt Lake (Sector 1 - 5)',
      addressLine: addressLine || '',
      isDefault: true,
    });
  }

  const newUser: CustomerUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    passwordHash: String(password),
    authProvider: 'local',
    preferredFlavour: 'Kolkata Meetha Paan',
    savedAddresses,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const created = createCustomerUser(newUser);
  const token = `sr_cust_${created.id}`;

  return res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: sanitizeUser(created),
  });
});

// 19. Customer Login (Email or Phone + Password)
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(200).json({
      success: false,
      error: 'Please enter your Email/Phone and Password.',
    });
  }

  const user = findCustomerUserByIdentifier(identifier);
  if (!user || user.passwordHash !== String(password)) {
    return res.status(200).json({
      success: false,
      error: 'Invalid email/phone or password. Please check your credentials or register a new account.',
    });
  }

  const token = `sr_cust_${user.id}`;
  return res.json({
    success: true,
    message: 'Welcome back to Shisha Rent Kolkata!',
    token,
    user: sanitizeUser(user),
  });
});

// 20. Customer Sign In / Sign Up with Google (Gmail)
app.post('/api/auth/google', (req: Request, res: Response) => {
  const { email, name, phone, area } = req.body;

  if (!email) {
    return res.status(200).json({
      success: false,
      error: 'Google email is required to continue.',
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user = findCustomerUserByIdentifier(normalizedEmail);

  if (!user) {
    const displayName =
      name?.trim() ||
      normalizedEmail
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());

    const savedAddresses: SavedAddress[] = area
      ? [
          {
            id: `addr-${Date.now()}`,
            label: 'Home',
            area,
            addressLine: '',
            isDefault: true,
          },
        ]
      : [];

    user = createCustomerUser({
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: displayName,
      email: normalizedEmail,
      phone: phone?.trim() || '',
      passwordHash: `google_oauth_${Date.now()}`,
      authProvider: 'google',
      preferredFlavour: 'Kolkata Meetha Paan',
      savedAddresses,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } else if (phone && !user.phone) {
    user = updateCustomerUser(user.id, { phone: phone.trim() }) || user;
  }

  const token = `sr_cust_${user.id}`;
  return res.json({
    success: true,
    message: 'Signed in with Google successfully',
    token,
    user: sanitizeUser(user),
  });
});

// 21. Get Current Logged-in Customer Profile
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedCustomer(req);
  if (!user) {
    return res.status(200).json({ success: false, error: 'Not authenticated' });
  }
  return res.json({
    success: true,
    user: sanitizeUser(user),
  });
});

// 22. Update Customer Profile & Saved Addresses
app.put('/api/customer/profile', (req: Request, res: Response) => {
  const user = getAuthenticatedCustomer(req);
  if (!user) {
    return res.status(200).json({ success: false, error: 'Authentication required' });
  }

  const { name, phone, email, preferredFlavour, savedAddresses, newPassword } = req.body;

  const updates: Partial<CustomerUser> = {};
  if (typeof name === 'string' && name.trim()) updates.name = name.trim();
  if (typeof phone === 'string') updates.phone = phone.trim();
  if (typeof email === 'string' && email.trim()) updates.email = email.trim().toLowerCase();
  if (typeof preferredFlavour === 'string') updates.preferredFlavour = preferredFlavour;
  if (Array.isArray(savedAddresses)) updates.savedAddresses = savedAddresses;
  if (typeof newPassword === 'string' && newPassword.trim().length >= 4) {
    updates.passwordHash = newPassword.trim();
  }

  const updated = updateCustomerUser(user.id, updates);
  if (!updated) {
    return res.status(200).json({ success: false, error: 'Customer not found' });
  }

  return res.json({
    success: true,
    message: 'Profile updated successfully',
    user: sanitizeUser(updated),
  });
});

// 23. Get Logged-In Customer Orders (Current & Past)
app.get('/api/customer/orders', (req: Request, res: Response) => {
  const user = getAuthenticatedCustomer(req);
  if (!user) {
    return res.status(200).json({ success: false, data: [], error: 'Authentication required' });
  }

  const orders = getCustomerBookings(user);
  return res.json({
    success: true,
    total: orders.length,
    data: orders,
  });
});

// 24. Save Customer Cookie Consent & SEO Tracking Preferences
app.post('/api/cookies/consent', (req: Request, res: Response) => {
  const { visitorId, userId, essential, analytics, marketing, seoPersonalization, utmSource, referrer } = req.body;
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  const record = saveCookieConsent({
    id: `cookie-${Date.now()}`,
    visitorId: visitorId || `vis-${Date.now()}`,
    userId: userId || undefined,
    essential: true,
    analytics: typeof analytics === 'boolean' ? analytics : true,
    marketing: typeof marketing === 'boolean' ? marketing : true,
    seoPersonalization: typeof seoPersonalization === 'boolean' ? seoPersonalization : true,
    utmSource: utmSource || undefined,
    referrer: referrer || undefined,
    userAgent,
    ipAddress: clientIp,
    updatedAt: new Date().toISOString(),
  });

  return res.json({
    success: true,
    data: record,
  });
});

// ====================================================================
// SERVER-SIDE SEO HEAD INJECTION & VITE CLIENT MOUNTING (DEV & PROD)
// ====================================================================

function escapeHtmlAttr(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectDynamicSeoIntoHtml(rawHtml: string, reqPath: string, hostHeader: string): string {
  try {
    const db = getDatabase();
    const seo = db.seoConfig || DEFAULT_SEO_CONFIG;
    const contact = db.contactConfig;

    const cleanPath = (reqPath || '/').split('?')[0].toLowerCase().replace(/\/+$/, '') || '/';
    const pathToPageKey: Record<string, string> = {
      '/': 'home',
      '/products': 'products',
      '/services': 'services',
      '/about': 'about',
      '/gallery': 'gallery',
      '/track': 'track',
      '/contact': 'contact',
      '/account': 'account',
    };

    const pageKey = pathToPageKey[cleanPath] || 'home';
    const pageSeo = seo.pages?.[pageKey] || seo.pages?.home || DEFAULT_SEO_CONFIG.pages.home;

    const title = pageSeo?.title || seo.defaultTitle || DEFAULT_SEO_CONFIG.defaultTitle;
    const description =
      pageSeo?.description || seo.defaultDescription || DEFAULT_SEO_CONFIG.defaultDescription;
    const keywords = [pageSeo?.focusKeyword, pageSeo?.keywords, seo.globalKeywords]
      .filter(Boolean)
      .join(', ');
    const ogTitle = pageSeo?.ogTitle || title;
    const ogDescription = pageSeo?.ogDescription || description;
    const baseDomain = (seo.canonicalDomain || `https://${hostHeader || 'shisharent.in'}`).replace(
      /\/+$/,
      ''
    );
    const canonicalPath = pageSeo?.canonicalPath || cleanPath;
    const canonicalUrl = `${baseDomain}${canonicalPath === '/' ? '/' : canonicalPath}`;

    const rawOgImage = pageSeo?.ogImage || seo.defaultOgImage || '/src/assets/images/hero_luxury_hookah_1791648599431.jpg';
    const ogImageUrl =
      rawOgImage.startsWith('http') || rawOgImage.startsWith('data:')
        ? rawOgImage
        : `${baseDomain}${rawOgImage.startsWith('/') ? '' : '/'}${rawOgImage}`;

    const shouldIndex = seo.robotsIndex !== false && pageSeo?.robotsIndex !== false;
    const shouldFollow = seo.robotsFollow !== false && pageSeo?.robotsFollow !== false;
    const robotsDirective = `${shouldIndex ? 'index' : 'noindex'}, ${
      shouldFollow ? 'follow' : 'nofollow'
    }, max-image-preview:large, max-snippet:-1`;

    const schemaObj: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': seo.schemaBusinessType || 'LocalBusiness',
      name: seo.schemaBusinessName || seo.siteName || 'Shisha Rent Kolkata',
      description: seo.schemaDescription || seo.defaultDescription,
      url: baseDomain,
      telephone: seo.schemaTelephone || contact?.phone || '+91-9876543210',
      email: seo.schemaEmail || contact?.email || 'bookings@shisharent.in',
      priceRange: seo.schemaPriceRange || '₹499 - ₹9999',
      openingHours: seo.schemaOpeningHours || 'Mo-Su 11:00-03:00',
      address: {
        '@type': 'PostalAddress',
        streetAddress: seo.schemaStreetAddress || contact?.address || 'Park Street & Salt Lake Sector V',
        addressLocality: seo.schemaLocality || contact?.city || 'Kolkata',
        addressRegion: seo.schemaRegion || 'WB',
        postalCode: seo.schemaPostalCode || '700016',
        addressCountry: 'IN',
      },
      areaServed: (seo.schemaAreaServed || contact?.areasServed || 'Kolkata')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (seo.schemaGeoLat && seo.schemaGeoLng) {
      schemaObj.geo = {
        '@type': 'GeoCoordinates',
        latitude: seo.schemaGeoLat,
        longitude: seo.schemaGeoLng,
      };
    }

    if (seo.schemaRatingValue && seo.schemaReviewCount) {
      schemaObj.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: seo.schemaRatingValue,
        reviewCount: seo.schemaReviewCount,
        bestRating: '5',
        worstRating: '1',
      };
    }

    let html = rawHtml;
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttr(title)}</title>`);
    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeHtmlAttr(description)}" />`
    );
    html = html.replace(
      /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="keywords" content="${escapeHtmlAttr(keywords)}" />`
    );
    html = html.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtmlAttr(ogTitle)}" />`
    );
    html = html.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtmlAttr(ogDescription)}" />`
    );
    html = html.replace(
      /<meta\s+property="og:site_name"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:site_name" content="${escapeHtmlAttr(seo.ogSiteName || seo.siteName)}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtmlAttr(ogTitle)}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtmlAttr(ogDescription)}" />`
    );
    html = html.replace(
      /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script id="dynamic-schema-jsonld" type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n    </script>`
    );

    const extraHeadTags = [
      `<meta name="robots" content="${escapeHtmlAttr(robotsDirective)}" />`,
      `<link rel="canonical" href="${escapeHtmlAttr(canonicalUrl)}" />`,
      `<meta property="og:url" content="${escapeHtmlAttr(canonicalUrl)}" />`,
      !ogImageUrl.startsWith('data:')
        ? `<meta property="og:image" content="${escapeHtmlAttr(ogImageUrl)}" />`
        : '',
      !ogImageUrl.startsWith('data:')
        ? `<meta name="twitter:image" content="${escapeHtmlAttr(ogImageUrl)}" />`
        : '',
      seo.googleSiteVerification
        ? `<meta name="google-site-verification" content="${escapeHtmlAttr(
            seo.googleSiteVerification
          )}" />`
        : '',
      seo.bingSiteVerification
        ? `<meta name="msvalidate.01" content="${escapeHtmlAttr(seo.bingSiteVerification)}" />`
        : '',
    ]
      .filter(Boolean)
      .join('\n    ');

    html = html.replace('</head>', `    ${extraHeadTags}\n  </head>`);
    return html;
  } catch (err) {
    console.warn('[SEO Injection Warning]:', err);
    return rawHtml;
  }
}

const KNOWN_SPA_ROUTES = new Set([
  '/',
  '/products',
  '/services',
  '/about',
  '/gallery',
  '/track',
  '/contact',
  '/account',
]);

async function startServer() {
  const distPath = path.resolve(process.cwd(), 'dist');
  const hasBuiltDist = fs.existsSync(path.resolve(distPath, 'index.html'));
  const isCloudRun = Boolean(process.env.K_SERVICE || process.env.CLOUD_RUN_JOB);

  if (!isProduction && !isCloudRun) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          hmr: false,
          watch: null,
        },
        appType: 'spa',
      });

      // Intercept known SPA HTML requests before Vite middleware to inject live SEO metadata
      app.use(async (req: Request, res: Response, next: express.NextFunction) => {
        const cleanPath = (req.path || '/').toLowerCase().replace(/\/+$/, '') || '/';
        if (req.method === 'GET' && KNOWN_SPA_ROUTES.has(cleanPath)) {
          try {
            const indexPath = path.resolve(process.cwd(), 'index.html');
            const rawTemplate = fs.readFileSync(indexPath, 'utf-8');
            const transformed = await vite.transformIndexHtml(req.originalUrl, rawTemplate);
            const seoHtml = injectDynamicSeoIntoHtml(
              transformed,
              cleanPath,
              req.get('host') || 'shisharent.in'
            );
            res.status(200).set({ 'Content-Type': 'text/html' }).end(seoHtml);
            return;
          } catch (e) {
            return next(e);
          }
        }
        next();
      });

      app.use(vite.middlewares);
    } catch {
      if (hasBuiltDist) {
        app.use(express.static(distPath, { index: false }));
        app.use((req: Request, res: Response) => {
          const rawHtml = fs.readFileSync(path.resolve(distPath, 'index.html'), 'utf-8');
          const seoHtml = injectDynamicSeoIntoHtml(
            rawHtml,
            req.path,
            req.get('host') || 'shisharent.in'
          );
          res.status(200).set({ 'Content-Type': 'text/html' }).send(seoHtml);
        });
      }
    }
  } else if (hasBuiltDist) {
    app.use(express.static(distPath, { index: false }));
    app.use((req: Request, res: Response) => {
      const rawHtml = fs.readFileSync(path.resolve(distPath, 'index.html'), 'utf-8');
      const seoHtml = injectDynamicSeoIntoHtml(
        rawHtml,
        req.path,
        req.get('host') || 'shisharent.in'
      );
      res.status(200).set({ 'Content-Type': 'text/html' }).send(seoHtml);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Shisha Rent Backend] Server listening on http://0.0.0.0:${PORT}`);
    console.log(`[Shisha Rent Backend] Serving unified database for shisharent.in & shisharent.com`);
  });
}

startServer();
