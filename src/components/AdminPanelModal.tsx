import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Upload,
  CheckCircle,
  AlertCircle,
  QrCode,
  CreditCard,
  Package,
  Clock,
  ShieldCheck,
  Check,
  RefreshCw,
  Eye,
  FileText,
  Search,
  Globe,
  Database,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Save,
  Filter,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Camera,
} from 'lucide-react';
import { api, PaymentConfig, ContactConfig, GalleryItem, Booking, TermsAcceptanceRecord } from '../services/api';
import { ALL_PRODUCTS, ProductItem } from '../data/productsData';
import { useProducts } from '../context/ProductsContext';
import { useContact } from '../context/ContactContext';
import { UpiQrShowcase } from './UpiQrShowcase';
import { AdminSeoManager } from './AdminSeoManager';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentConfigUpdated?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onPaymentConfigUpdated,
}) => {
  const { refreshProducts: refreshGlobalProducts } = useProducts();
  const { contactConfig: globalContactConfig, refreshContactConfig } = useContact();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'payments' | 'contact' | 'seo' | 'bookings' | 'substitution' | 'catalog' | 'gallery' | 'terms' | 'security'
  >('payments');

  // Gallery Portfolio Management State
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('all');
  const [isGalleryFormOpen, setIsGalleryFormOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galTitle, setGalTitle] = useState('');
  const [galSubtitle, setGalSubtitle] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryItem['category']>('parties');
  const [galImageUrl, setGalImageUrl] = useState('');
  const [galImageFile, setGalImageFile] = useState<File | null>(null);
  const [galPreviewUrl, setGalPreviewUrl] = useState('');
  const [isSavingGallery, setIsSavingGallery] = useState(false);
  const [galleryActionSuccess, setGalleryActionSuccess] = useState('');
  const [galleryActionError, setGalleryActionError] = useState('');

  // Website Contact Details State
  const [contactForm, setContactForm] = useState<Partial<ContactConfig>>({
    phone: globalContactConfig.phone,
    secondaryPhone: globalContactConfig.secondaryPhone,
    whatsappNumber: globalContactConfig.whatsappNumber,
    email: globalContactConfig.email,
    address: globalContactConfig.address,
    city: globalContactConfig.city,
    areasServed: globalContactConfig.areasServed,
    hours: globalContactConfig.hours,
    instagramUrl: globalContactConfig.instagramUrl,
    facebookUrl: globalContactConfig.facebookUrl,
    googleMapsUrl: globalContactConfig.googleMapsUrl,
  });
  const [contactSaving, setContactSaving] = useState(false);
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');

  // Admin Credential Change State
  const [currentAdminProfile, setCurrentAdminProfile] = useState<{ email: string; name: string; updatedAt?: string }>({
    email: 'admin@shisharent.in',
    name: 'Shisha Rent Operations Manager',
  });
  const [credNewName, setCredNewName] = useState('Shisha Rent Operations Manager');
  const [credNewEmail, setCredNewEmail] = useState('');
  const [credCurrentPassword, setCredCurrentPassword] = useState('');
  const [credNewPassword, setCredNewPassword] = useState('');
  const [credConfirmPassword, setCredConfirmPassword] = useState('');
  const [credSaving, setCredSaving] = useState(false);
  const [credSuccess, setCredSuccess] = useState('');
  const [credError, setCredError] = useState('');

  // Product Management & Pricing State
  const [productsList, setProductsList] = useState<ProductItem[]>(ALL_PRODUCTS);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all');
  const [inlinePrices, setInlinePrices] = useState<Record<string, { price: number; rentalRate: string }>>({});
  const [savedBadgeId, setSavedBadgeId] = useState<string | null>(null);

  // Add / Edit Product Modal state
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductItem['category']>('hookah-bases');
  const [formType, setFormType] = useState('German Stainless Hookah');
  const [formBrand, setFormBrand] = useState('Shisha Rent Kolkata');
  const [formPrice, setFormPrice] = useState<number>(1299);
  const [formRentalRate, setFormRentalRate] = useState('₹1,299 / session');
  const [formDescription, setFormDescription] = useState('');
  const [formHighlight, setFormHighlight] = useState('');
  const [formInStock, setFormInStock] = useState(true);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productActionSuccess, setProductActionSuccess] = useState('');
  const [productActionError, setProductActionError] = useState('');

  // Payment Config State
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [upiId, setUpiId] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isActiveQr, setIsActiveQr] = useState(true);
  const [codEnabled, setCodEnabled] = useState(true);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrUploadLoading, setQrUploadLoading] = useState(false);
  const [qrUploadSuccess, setQrUploadSuccess] = useState('');
  const [qrUploadError, setQrUploadError] = useState('');

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingFilterDomain, setBookingFilterDomain] = useState<string>('all');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Substitution State
  const [subBookingId, setSubBookingId] = useState('');
  const [subUnavailableItem, setSubUnavailableItem] = useState('');
  const [subOfferedItem, setSubOfferedItem] = useState('');
  const [subReason, setSubReason] = useState('');
  const [subSuccess, setSubSuccess] = useState('');

  // Terms Audit State
  const [termsAudit, setTermsAudit] = useState<TermsAcceptanceRecord[]>([]);

  // System metrics
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem('sr_admin_token');
    if (token) {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, [isOpen]);

  const loadDashboardData = async () => {
    try {
      const [payRes, contactRes, bookRes, termsRes, metRes, prodRes, galRes, profRes] = await Promise.all([
        api.getPaymentSettings(),
        api.getContactSettings(),
        api.getBookings(),
        api.getTermsAudit(),
        api.getAdminMetrics(),
        api.getProducts(),
        api.getGallery(),
        api.getAdminProfile(),
      ]);

      if (profRes && profRes.success === false) {
        localStorage.removeItem('sr_admin_token');
        setIsAuthenticated(false);
        return;
      }

      if (payRes.success && payRes.data) {
        setPaymentConfig(payRes.data);
        setUpiId(payRes.data.upiId);
        setPayeeName(payRes.data.payeeName);
        setInstructions(payRes.data.instructions);
        setIsActiveQr(payRes.data.isActive);
        setCodEnabled(payRes.data.codEnabled);
      }

      if (contactRes && contactRes.success && contactRes.data) {
        setContactForm(contactRes.data);
      }

      if (bookRes.success && Array.isArray(bookRes.data)) setBookings(bookRes.data);
      if (termsRes.success && Array.isArray(termsRes.data)) setTermsAudit(termsRes.data);
      if (metRes.success) setMetrics(metRes.metrics);
      if (prodRes && prodRes.success && Array.isArray(prodRes.data)) {
        setProductsList(prodRes.data);
      }
      if (galRes && galRes.success && Array.isArray(galRes.data)) {
        setGalleryList(galRes.data);
      }
      if (profRes && profRes.success && profRes.admin) {
        setCurrentAdminProfile(profRes.admin);
        setCredNewEmail(profRes.admin.email);
        setCredNewName(profRes.admin.name || 'Shisha Rent Operations Manager');
        setAdminEmail(profRes.admin.email);
      }
    } catch {
      // handled gracefully
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await api.adminLogin(adminEmail, adminPassword);
      if (res.success && res.token) {
        localStorage.setItem('sr_admin_token', res.token);
        setIsAuthenticated(true);
        setAdminPassword('');
        if (res.admin?.email) {
          setCurrentAdminProfile(res.admin);
          setCredNewEmail(res.admin.email);
          setCredNewName(res.admin.name || 'Shisha Rent Operations Manager');
        }
        loadDashboardData();
      } else {
        setLoginError(res.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Server connection failed. Ensure server.ts is running.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sr_admin_token');
    setIsAuthenticated(false);
    setAdminPassword('');
  };

  const handleSaveAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    if (!credCurrentPassword) {
      setCredError('Please enter your current admin password to authorize this change.');
      return;
    }

    if (credNewPassword && credNewPassword !== credConfirmPassword) {
      setCredError('New password and confirmation password do not match.');
      return;
    }

    if (credNewPassword && credNewPassword.length < 6) {
      setCredError('New admin password must be at least 6 characters long.');
      return;
    }

    setCredSaving(true);
    try {
      const res = await api.updateAdminCredentials({
        currentPassword: credCurrentPassword,
        newEmail: credNewEmail,
        newPassword: credNewPassword || undefined,
        newName: credNewName,
      });

      if (res.success) {
        setCredSuccess(res.message || 'Admin login credentials updated permanently!');
        setCredCurrentPassword('');
        setCredNewPassword('');
        setCredConfirmPassword('');
        if (res.admin) {
          setCurrentAdminProfile(res.admin);
          setAdminEmail(res.admin.email);
          setCredNewEmail(res.admin.email);
          setCredNewName(res.admin.name);
        }
      } else {
        setCredError(res.error || 'Failed to update admin credentials.');
      }
    } catch (err) {
      setCredError('Network error while updating credentials.');
    } finally {
      setCredSaving(false);
    }
  };

  // Upload Real QR Image to Storage & Save to PostgreSQL
  const handleUploadQr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrFile) {
      setQrUploadError('Please select a valid QR image file');
      return;
    }

    setQrUploadLoading(true);
    setQrUploadSuccess('');
    setQrUploadError('');

    try {
      const formData = new FormData();
      formData.append('qrImage', qrFile);
      formData.append('upiId', upiId);
      formData.append('payeeName', payeeName);
      formData.append('instructions', instructions);
      formData.append('adminEmail', adminEmail);

      const res = await api.uploadQrImage(formData);
      if (res.success) {
        setPaymentConfig(res.data);
        setQrUploadSuccess('QR code image uploaded to persistent storage and saved in PostgreSQL!');
        setQrFile(null);
        if (onPaymentConfigUpdated) onPaymentConfigUpdated();
        loadDashboardData();
      } else {
        setQrUploadError(res.error || 'Failed to upload QR code');
      }
    } catch (err) {
      setQrUploadError('Upload failed. Check network connection.');
    } finally {
      setQrUploadLoading(false);
    }
  };

  // Save Text Payment Settings
  const handleSavePaymentSettings = async () => {
    setQrUploadLoading(true);
    try {
      const res = await api.updatePaymentSettings(
        {
          upiId,
          payeeName,
          instructions,
          isActive: isActiveQr,
          codEnabled,
        },
        adminEmail
      );
      if (res.success) {
        setPaymentConfig(res.data);
        setQrUploadSuccess('Payment settings updated in PostgreSQL!');
        if (onPaymentConfigUpdated) onPaymentConfigUpdated();
      }
    } catch (err) {
      setQrUploadError('Failed to save payment settings');
    } finally {
      setQrUploadLoading(false);
    }
  };

  // Save Website Contact Settings
  const handleSaveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSaving(true);
    setContactSuccess('');
    setContactError('');

    try {
      const res = await api.updateContactSettings(contactForm, adminEmail);
      if (res.success && res.data) {
        setContactForm(res.data);
        setContactSuccess('Website contact details saved and synced live across the entire website!');
        await refreshContactConfig();
      } else {
        setContactError(res.error || 'Failed to update contact details');
      }
    } catch {
      setContactError('Network error while saving contact details.');
    } finally {
      setContactSaving(false);
    }
  };

  // Manual Online Payment Verification
  const handleVerifyPayment = async (bookingId: string, verified: boolean) => {
    try {
      const res = await api.verifyPayment(bookingId, verified, verificationNotes, adminEmail);
      if (res.success) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? res.data : b)));
        setSelectedBooking(res.data);
        setVerificationNotes('');
        loadDashboardData();
      }
    } catch {
      // handled gracefully
    }
  };

  // Update Booking Delivery Status
  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const res = await api.updateBookingStatus(bookingId, status, adminEmail);
      if (res.success) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? res.data : b)));
        if (selectedBooking?.id === bookingId) setSelectedBooking(res.data);
        loadDashboardData();
      }
    } catch {
      // handled gracefully
    }
  };

  // Propose Product Substitution
  const handleProposeSubstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subBookingId || !subUnavailableItem || !subOfferedItem) return;

    try {
      const res = await api.requestSubstitution(
        subBookingId,
        subUnavailableItem,
        subOfferedItem,
        subReason || 'Requested item temporarily depleted at central hub',
        adminEmail
      );

      if (res.success) {
        setSubSuccess(`Substitution offer sent for Booking ${subBookingId}! Awaiting customer approval.`);
        setBookings((prev) => prev.map((b) => (b.id === subBookingId ? res.data : b)));
        loadDashboardData();
      }
    } catch {
      // handled gracefully
    }
  };

  // Toggle Stock in Catalog
  const handleToggleStock = async (prodId: string, currentStock: boolean) => {
    try {
      const res = await api.toggleProductStock(prodId, !currentStock);
      if (res.success) {
        setProductsList((prev) =>
          prev.map((p) => (p.id === prodId ? { ...p, inStock: !currentStock } : p))
        );
        refreshGlobalProducts();
      }
    } catch {
      // handled gracefully
    }
  };

  // Inline Price Change
  const handleInlinePriceChange = (prodId: string, field: 'price' | 'rentalRate', val: any) => {
    setInlinePrices((prev) => {
      const current = prev[prodId] || {
        price: productsList.find((p) => p.id === prodId)?.price || 0,
        rentalRate: productsList.find((p) => p.id === prodId)?.rentalRate || '',
      };
      return {
        ...prev,
        [prodId]: {
          ...current,
          [field]: field === 'price' ? Number(val) || 0 : val,
        },
      };
    });
  };

  // Save Inline Price
  const handleSaveInlinePrice = async (prod: ProductItem) => {
    const inline = inlinePrices[prod.id];
    const newPrice = inline?.price !== undefined ? inline.price : prod.price;
    const newRentalRate = inline?.rentalRate !== undefined ? inline.rentalRate : (prod.rentalRate || `₹${newPrice} / session`);

    try {
      const res = await api.updateProduct(prod.id, { price: newPrice, rentalRate: newRentalRate }, adminEmail);
      if (res.success) {
        setProductsList((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, price: newPrice, rentalRate: newRentalRate } : p))
        );
        refreshGlobalProducts();
        setSavedBadgeId(prod.id);
        setTimeout(() => setSavedBadgeId(null), 2500);
      } else {
        setProductActionError(res.error || 'Failed to update pricing');
      }
    } catch {
      setProductActionError('Network error updating price');
    }
  };

  // Open Add Product Dialog
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('hookah-bases');
    setFormType('German Stainless Hookah');
    setFormBrand('Shisha Rent Kolkata');
    setFormPrice(1299);
    setFormRentalRate('₹1,299 / session');
    setFormDescription('Curated premium Russian/German hookah pot for Kolkata events.');
    setFormHighlight('Certified Clean & Sanitized');
    setFormInStock(true);
    setFormIsBestSeller(false);
    setFormImageUrl('/src/assets/images/hero_luxury_hookah_1791648599431.jpg');
    setFormImageFile(null);
    setProductActionSuccess('');
    setProductActionError('');
    setIsProductFormOpen(true);
  };

  // Open Edit Product Dialog
  const handleOpenEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormType(prod.type);
    setFormBrand(prod.brand);
    setFormPrice(prod.price);
    setFormRentalRate(prod.rentalRate || `₹${prod.price} / session`);
    setFormDescription(prod.description);
    setFormHighlight(prod.highlight || '');
    setFormInStock(prod.inStock);
    setFormIsBestSeller(!!prod.isBestSeller);
    setFormImageUrl(prod.images?.[0] || '');
    setFormImageFile(null);
    setProductActionSuccess('');
    setProductActionError('');
    setIsProductFormOpen(true);
  };

  // Save Product Form (Create or Edit)
  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);
    setProductActionError('');
    setProductActionSuccess('');

    try {
      let finalImageUrl = formImageUrl;
      if (formImageFile) {
        const formData = new FormData();
        formData.append('productImage', formImageFile);
        const uploadRes = await api.uploadProductImage(formData);
        if (uploadRes.success && uploadRes.imageUrl) {
          finalImageUrl = uploadRes.imageUrl;
        }
      }

      const categoryLabels: Record<string, string> = {
        'flavours': 'Flavour Brands / Varieties',
        'hookah-bases': 'Hookahs & Bases (Pots)',
        'chilam': 'Chilam (Bowls)',
        'pipes': 'Pipes & Hoses',
        'coal-accessories': 'Coal & Accessories',
        'sr-products': 'Kits, Boxes & Party Combos',
      };

      if (editingProduct) {
        const res = await api.updateProduct(
          editingProduct.id,
          {
            name: formName,
            category: formCategory,
            categoryLabel: categoryLabels[formCategory] || 'Hookah Rental',
            type: formType,
            brand: formBrand,
            price: Number(formPrice),
            rentalRate: formRentalRate,
            description: formDescription,
            highlight: formHighlight,
            inStock: formInStock,
            isBestSeller: formIsBestSeller,
            images: finalImageUrl ? [finalImageUrl] : editingProduct.images,
          },
          adminEmail
        );

        if (res.success) {
          setProductsList((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? res.data : p))
          );
          refreshGlobalProducts();
          setProductActionSuccess(`Product "${formName}" updated successfully!`);
          setTimeout(() => setIsProductFormOpen(false), 900);
        } else {
          setProductActionError(res.error || 'Failed to update product');
        }
      } else {
        const res = await api.createProduct(
          {
            name: formName,
            category: formCategory,
            categoryLabel: categoryLabels[formCategory] || 'Hookah Rental',
            type: formType,
            brand: formBrand,
            price: Number(formPrice),
            rentalRate: formRentalRate,
            description: formDescription,
            highlight: formHighlight,
            inStock: formInStock,
            isBestSeller: formIsBestSeller,
            images: finalImageUrl ? [finalImageUrl] : ['/src/assets/images/hero_luxury_hookah_1791648599431.jpg'],
          },
          adminEmail
        );

        if (res.success) {
          setProductsList((prev) => [res.data, ...prev]);
          refreshGlobalProducts();
          setProductActionSuccess(`New product "${formName}" added successfully to catalog!`);
          setTimeout(() => setIsProductFormOpen(false), 900);
        } else {
          setProductActionError(res.error || 'Failed to create product');
        }
      }
    } catch {
      setProductActionError('Operation failed. Check server connection.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (prodId: string, prodName: string) => {
    try {
      const res = await api.deleteProduct(prodId, adminEmail);
      if (res.success) {
        setProductsList((prev) => prev.filter((p) => p.id !== prodId));
        refreshGlobalProducts();
        setProductActionSuccess(`"${prodName}" has been removed from catalog.`);
      } else {
        setProductActionError(res.error || 'Failed to delete product');
      }
    } catch {
      setProductActionError('Error deleting product');
    }
  };

  // Gallery Management Handlers
  const notifyGallerySynced = () => {
    window.dispatchEvent(new CustomEvent('sr-gallery-updated'));
  };

  const handleOpenAddGalleryModal = () => {
    setEditingGalleryItem(null);
    setGalTitle('');
    setGalSubtitle('Park Street / Salt Lake VIP Lounge');
    setGalCategory('parties');
    setGalImageUrl('');
    setGalImageFile(null);
    setGalPreviewUrl('');
    setGalleryActionSuccess('');
    setGalleryActionError('');
    setIsGalleryFormOpen(true);
  };

  const handleOpenEditGalleryModal = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setGalTitle(item.title);
    setGalSubtitle(item.subtitle);
    setGalCategory(item.category);
    setGalImageUrl(item.src);
    setGalImageFile(null);
    setGalPreviewUrl(item.src);
    setGalleryActionSuccess('');
    setGalleryActionError('');
    setIsGalleryFormOpen(true);
  };

  const handleGalleryFileSelect = (file: File | null) => {
    setGalImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setGalPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setGalPreviewUrl(galImageUrl);
    }
  };

  const handleSaveGalleryForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGallery(true);
    setGalleryActionError('');
    setGalleryActionSuccess('');

    try {
      let finalSrc = galImageUrl.trim();

      if (galImageFile) {
        const formData = new FormData();
        formData.append('galleryImage', galImageFile);
        const uploadRes = await api.uploadGalleryImage(formData);
        if (uploadRes.success && uploadRes.imageUrl) {
          finalSrc = uploadRes.imageUrl;
        } else {
          setGalleryActionError(uploadRes.error || 'Failed to upload gallery image file');
          setIsSavingGallery(false);
          return;
        }
      }

      if (!finalSrc) {
        setGalleryActionError('Please upload an image file from your device or enter an image URL.');
        setIsSavingGallery(false);
        return;
      }

      if (editingGalleryItem) {
        const res = await api.updateGalleryItem(
          editingGalleryItem.id,
          {
            title: galTitle,
            subtitle: galSubtitle,
            category: galCategory,
            src: finalSrc,
          },
          adminEmail
        );

        if (res.success && res.data) {
          setGalleryList((prev) =>
            prev.map((g) => (g.id === editingGalleryItem.id ? res.data : g))
          );
          notifyGallerySynced();
          setGalleryActionSuccess(`Gallery photo "${galTitle}" updated and synced with website!`);
          setTimeout(() => setIsGalleryFormOpen(false), 800);
        } else {
          setGalleryActionError(res.error || 'Failed to update gallery item');
        }
      } else {
        const res = await api.createGalleryItem(
          {
            title: galTitle,
            subtitle: galSubtitle,
            category: galCategory,
            src: finalSrc,
          },
          adminEmail
        );

        if (res.success && res.data) {
          setGalleryList((prev) => [res.data, ...prev]);
          notifyGallerySynced();
          setGalleryActionSuccess(`New gallery photo "${galTitle}" published to main website!`);
          setTimeout(() => setIsGalleryFormOpen(false), 800);
        } else {
          setGalleryActionError(res.error || 'Failed to publish gallery photo');
        }
      }
    } catch {
      setGalleryActionError('Network error while saving gallery photo.');
    } finally {
      setIsSavingGallery(false);
    }
  };

  const handleDeleteGalleryItem = async (id: string, title: string) => {
    setGalleryActionError('');
    setGalleryActionSuccess('');
    try {
      const res = await api.deleteGalleryItem(id, adminEmail);
      if (res.success) {
        setGalleryList((prev) => prev.filter((g) => g.id !== id));
        notifyGallerySynced();
        setGalleryActionSuccess(`"${title}" removed from website gallery.`);
      } else {
        setGalleryActionError(res.error || 'Failed to delete gallery photo');
      }
    } catch {
      setGalleryActionError('Error deleting gallery photo');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#0b0b12] border border-neutral-800 shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-600/50 flex items-center justify-center text-red-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                  Shisha Rent Operations & Admin Portal
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-semibold">
                  PostgreSQL & Supabase
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Synchronized across domains: <strong className="text-neutral-200">shisharent.in</strong> & <strong className="text-neutral-200">shisharent.com</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Admin Login Screen */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-red-500">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white font-heading">
                Administrator Authentication
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your administrative credentials to manage payments, upload active QR codes, verify orders, and review customer substitution approvals.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 text-left flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter administrator email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter administrator password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {isLoggingIn ? 'Authenticating...' : 'Access Admin Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-neutral-800 bg-neutral-950 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('payments')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                  activeTab === 'payments'
                    ? 'border-red-600 text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <QrCode className="w-4 h-4 text-red-500" />
                <span>Payment Settings & Active QR</span>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                  activeTab === 'contact'
                    ? 'border-red-600 text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Website Contact Details</span>
              </button>

              <button
                onClick={() => setActiveTab('seo')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                  activeTab === 'seo'
                    ? 'border-emerald-500 text-white bg-emerald-950/20'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>SEO & Ranking (Yoast)</span>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                  activeTab === 'bookings'
                    ? 'border-red-600 text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Bookings & Payment Verification ({bookings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('substitution')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                  activeTab === 'substitution'
                    ? 'border-red-600 text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Package className="w-4 h-4 text-rose-400" />
                <span>Customer Substitution Workflow</span>
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                  activeTab === 'catalog'
                    ? 'border-red-600 text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Database className="w-4 h-4 text-blue-400" />
                <span>Manage Products & Pricing ({productsList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                  activeTab === 'gallery'
                    ? 'border-red-600 text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Gallery Portfolio ({galleryList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('terms')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                  activeTab === 'terms'
                    ? 'border-red-600 text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Immutable Terms Audit ({termsAudit.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors shrink-0 ${
                  activeTab === 'security'
                    ? 'border-red-600 text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Admin Security & Credentials</span>
              </button>
            </div>

            {/* Tab 1: Payment Settings Screen (Administrator-Only Upload & Config) */}
            {activeTab === 'payments' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-left">
                
                {/* Information Header */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Central Payment Configuration & QR Upload</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Shared Across shisharent.in & shisharent.com
                      </span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Upload your real business UPI QR image. It is persistently stored in storage and the active configuration is synchronized in PostgreSQL.
                    </p>
                  </div>

                  <div className="text-right text-xs text-neutral-400 shrink-0">
                    <div>Last Updated: <span className="text-neutral-200 font-medium">{paymentConfig?.updatedAt ? new Date(paymentConfig.updatedAt).toLocaleDateString() : 'N/A'}</span></div>
                    <div>Updated By: <span className="text-amber-400 font-mono">{paymentConfig?.updatedBy || 'admin'}</span></div>
                  </div>
                </div>

                {qrUploadSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{qrUploadSuccess}</span>
                  </div>
                )}

                {qrUploadError && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{qrUploadError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Active QR Live Preview (Full-Aspect Showcase) */}
                  <div className="lg:col-span-5 space-y-4">
                    <UpiQrShowcase paymentConfig={paymentConfig} />
                  </div>

                  {/* Right: Upload Form & Configuration Settings */}
                  <div className="lg:col-span-7 space-y-5">
                    
                    {/* File Upload Box */}
                    <form onSubmit={handleUploadQr} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        <Upload className="w-4 h-4 text-red-500" />
                        <span>Upload New QR Code Image</span>
                      </h5>

                      <div className="border-2 border-dashed border-neutral-800 hover:border-red-600/60 rounded-xl p-5 text-center cursor-pointer transition-colors bg-neutral-900/30">
                        <input
                          type="file"
                          accept="image/*"
                          id="qr-file-input"
                          onChange={(e) => {
                            if (e.target.files?.[0]) setQrFile(e.target.files[0]);
                          }}
                          className="hidden"
                        />
                        <label htmlFor="qr-file-input" className="cursor-pointer block">
                          <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                          <p className="text-xs text-neutral-200 font-semibold">
                            {qrFile ? qrFile.name : 'Click to select QR image (PNG, JPG, WebP)'}
                          </p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            Files are saved directly to persistent storage and public URLs generated for PostgreSQL
                          </p>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            UPI ID (VPA) *
                          </label>
                          <input
                            type="text"
                            required
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. shisharent@upi"
                            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            Payee / Merchant Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={payeeName}
                            onChange={(e) => setPayeeName(e.target.value)}
                            placeholder="e.g. Shisha Rent Kolkata"
                            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          Payment Instructions for Customer
                        </label>
                        <textarea
                          rows={2}
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4 text-xs">
                          <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                            <input
                              type="checkbox"
                              checked={isActiveQr}
                              onChange={(e) => setIsActiveQr(e.target.checked)}
                              className="accent-red-600 rounded"
                            />
                            <span>Enable Online QR</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                            <input
                              type="checkbox"
                              checked={codEnabled}
                              onChange={(e) => setCodEnabled(e.target.checked)}
                              className="accent-red-600 rounded"
                            />
                            <span>Enable Cash on Delivery (COD)</span>
                          </label>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSavePaymentSettings}
                            disabled={qrUploadLoading}
                            className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-700 cursor-pointer"
                          >
                            Save Text Config
                          </button>

                          <button
                            type="submit"
                            disabled={qrUploadLoading || !qrFile}
                            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {qrUploadLoading ? 'Uploading...' : 'Upload & Deploy QR'}
                          </button>
                        </div>
                      </div>

                    </form>

                  </div>

                </div>

              </div>
            )}

            {/* Tab 1B: Website Contact & Social Details Management */}
            {activeTab === 'contact' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-left">
                <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>Website Contact Details & WhatsApp Concierge Settings</span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Update your phone numbers, WhatsApp booking hotline, support email, Kolkata hub address, operating hours, and social links. Changes update live across Header, Footer, Contact Page, and Booking modals.
                    </p>
                  </div>

                  <div className="text-right text-xs text-neutral-400 shrink-0">
                    <div>
                      Last Updated:{' '}
                      <span className="text-neutral-200 font-medium">
                        {contactForm.updatedAt ? new Date(contactForm.updatedAt).toLocaleDateString() : 'Today'}
                      </span>
                    </div>
                    <div>
                      Active Hotline: <span className="text-emerald-400 font-mono">{contactForm.phone}</span>
                    </div>
                  </div>
                </div>

                {contactSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{contactSuccess}</span>
                  </div>
                )}

                {contactError && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{contactError}</span>
                  </div>
                )}

                <form
                  onSubmit={handleSaveContactSettings}
                  className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6"
                >
                  {/* Section 1: Phone & WhatsApp Numbers */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 border-b border-neutral-800 pb-2">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>1. Phone Hotlines & WhatsApp Booking Number</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          Primary Phone Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.phone || ''}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-red-600"
                        />
                        <span className="text-[10px] text-neutral-500 mt-1 block">
                          Displayed in Header, Footer & Contact Page
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          Secondary / Alternate Phone
                        </label>
                        <input
                          type="text"
                          value={contactForm.secondaryPhone || ''}
                          onChange={(e) => setContactForm({ ...contactForm, secondaryPhone: e.target.value })}
                          placeholder="+91 98301 22419"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-red-600"
                        />
                        <span className="text-[10px] text-neutral-500 mt-1 block">
                          Optional backup concierge desk number
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-emerald-400 mb-1.5">
                          WhatsApp Booking Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.whatsappNumber || ''}
                          onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-emerald-800/60 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                        />
                        <span className="text-[10px] text-neutral-500 mt-1 block">
                          Used for all WhatsApp Order & Chat buttons
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Email, Address & Operating Hours */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 border-b border-neutral-800 pb-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>2. Email, Kolkata Hub Address & Operating Hours</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          Support & Booking Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactForm.email || ''}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="bookings@shisharent.in"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          Primary City *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.city || ''}
                          onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                          placeholder="Kolkata"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          Operating Hours *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.hours || ''}
                          onChange={(e) => setContactForm({ ...contactForm, hours: e.target.value })}
                          placeholder="Open Daily · 11:00 AM to 3:00 AM"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          Office / Main Kolkata Hub Address
                        </label>
                        <input
                          type="text"
                          value={contactForm.address || ''}
                          onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                          placeholder="Park Street & Salt Lake Sector V Concierge Hubs, Kolkata"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          Service Coverage Areas (Shown in Footer & Contact)
                        </label>
                        <input
                          type="text"
                          value={contactForm.areasServed || ''}
                          onChange={(e) => setContactForm({ ...contactForm, areasServed: e.target.value })}
                          placeholder="Salt Lake, New Town, Park Street, Ballygunge, Alipore..."
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Social Media & Google Maps Links */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 border-b border-neutral-800 pb-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span>3. Social Media & Google Maps Location Links</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          Instagram Page URL
                        </label>
                        <input
                          type="text"
                          value={contactForm.instagramUrl || ''}
                          onChange={(e) => setContactForm({ ...contactForm, instagramUrl: e.target.value })}
                          placeholder="https://instagram.com/..."
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          Facebook Page URL
                        </label>
                        <input
                          type="text"
                          value={contactForm.facebookUrl || ''}
                          onChange={(e) => setContactForm({ ...contactForm, facebookUrl: e.target.value })}
                          placeholder="https://facebook.com/..."
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          Google Maps Location URL
                        </label>
                        <input
                          type="text"
                          value={contactForm.googleMapsUrl || ''}
                          onChange={(e) => setContactForm({ ...contactForm, googleMapsUrl: e.target.value })}
                          placeholder="https://maps.google.com/..."
                          className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end border-t border-neutral-800">
                    <button
                      type="submit"
                      disabled={contactSaving}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-900/30 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{contactSaving ? 'Saving Contact Details...' : 'Save & Publish Contact Details'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Bookings Management & Manual Online Payment Verification */}
            {activeTab === 'bookings' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-left">
                
                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={bookingFilterDomain}
                      onChange={(e) => setBookingFilterDomain(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200"
                    >
                      <option value="all">All Domains (Both .in & .com)</option>
                      <option value="shisharent.in">shisharent.in</option>
                      <option value="shisharent.com">shisharent.com</option>
                    </select>

                    <select
                      value={bookingFilterStatus}
                      onChange={(e) => setBookingFilterStatus(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="substitution_requested">Substitution Requested</option>
                      <option value="substitution_approved">Substitution Approved</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, phone, area..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Bookings Table */}
                <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-neutral-300">
                      <thead className="bg-neutral-900/80 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                        <tr>
                          <th className="p-3">Booking ID & Domain</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Date & Time</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900">
                        {bookings
                          .filter((b) => {
                            if (bookingFilterDomain !== 'all' && b.domain !== bookingFilterDomain) return false;
                            if (bookingFilterStatus !== 'all' && b.bookingStatus !== bookingFilterStatus) return false;
                            if (bookingSearch) {
                              const q = bookingSearch.toLowerCase();
                              return (
                                b.customerName.toLowerCase().includes(q) ||
                                b.customerPhone.includes(q) ||
                                b.id.toLowerCase().includes(q)
                              );
                            }
                            return true;
                          })
                          .map((b) => (
                            <tr key={b.id} className="hover:bg-neutral-900/40">
                              <td className="p-3">
                                <div className="font-mono font-bold text-white">{b.id}</div>
                                <div className="text-[10px] text-amber-400">{b.domain}</div>
                              </td>

                              <td className="p-3">
                                <div className="font-semibold text-white">{b.customerName}</div>
                                <div className="text-[11px] text-neutral-400">{b.customerPhone}</div>
                              </td>

                              <td className="p-3">
                                <div>{b.eventDate}</div>
                                <div className="text-[11px] text-neutral-400">{b.eventTime} ({b.potCount} Pots)</div>
                              </td>

                              <td className="p-3">
                                <div className="truncate max-w-[140px]">{b.deliveryArea}</div>
                              </td>

                              <td className="p-3">
                                <div className="uppercase font-semibold text-[11px] text-white">
                                  {b.paymentMethod}
                                </div>
                                <span
                                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                    b.paymentStatus === 'verified'
                                      ? 'bg-emerald-950 text-emerald-300'
                                      : b.paymentStatus === 'rejected'
                                      ? 'bg-red-950 text-red-300'
                                      : 'bg-amber-950 text-amber-300'
                                  }`}
                                >
                                  {b.paymentStatus}
                                </span>
                              </td>

                              <td className="p-3">
                                <span className="inline-block px-2 py-0.5 rounded bg-neutral-900 text-neutral-200 border border-neutral-800 text-[10px] font-semibold">
                                  {b.bookingStatus}
                                </span>
                              </td>

                              <td className="p-3 text-right">
                                <button
                                  onClick={() => setSelectedBooking(b)}
                                  className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-semibold"
                                >
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Modal Detail for Selected Booking */}
                {selectedBooking && (
                  <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Order Details: <span className="text-amber-400 font-mono">{selectedBooking.id}</span>
                        </h4>
                        <p className="text-xs text-neutral-400">
                          {selectedBooking.customerName} · {selectedBooking.customerPhone} · {selectedBooking.deliveryArea}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedBooking(null)}
                        className="text-xs text-neutral-400 hover:text-white"
                      >
                        Close
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Requested Items */}
                      <div>
                        <span className="font-semibold text-neutral-300 block mb-1">
                          Requested Products ({selectedBooking.requestedItems.length}):
                        </span>
                        <div className="space-y-1 bg-black/40 p-2.5 rounded-lg border border-neutral-800">
                          {selectedBooking.requestedItems.map((item, i) => (
                            <div key={i} className="flex justify-between text-neutral-300">
                              <span>• {item.name}</span>
                              <span className="text-[10px] text-neutral-400">{item.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Verification Box */}
                      <div className="space-y-2">
                        <span className="font-semibold text-neutral-300 block">
                          Payment Verification (Mode: {selectedBooking.paymentMethod.toUpperCase()})
                        </span>
                        
                        {selectedBooking.transactionReference && (
                          <p className="text-neutral-300">
                            Reference: <strong className="font-mono text-amber-300">{selectedBooking.transactionReference}</strong>
                          </p>
                        )}

                        {selectedBooking.paymentProofUrl && (
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-400">Proof Screenshot:</span>
                            <a
                              href={selectedBooking.paymentProofUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-red-400 underline flex items-center gap-1 font-semibold"
                            >
                              <span>View Image</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => handleVerifyPayment(selectedBooking.id, true)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                          >
                            ✓ Verify Online Payment
                          </button>
                          <button
                            onClick={() => handleVerifyPayment(selectedBooking.id, false)}
                            className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700 font-semibold text-xs"
                          >
                            ✗ Mark Rejected
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Change Status Controls */}
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-800 flex-wrap">
                      <span className="text-xs text-neutral-400">Update Delivery Flow:</span>
                      {['confirmed', 'dispatched', 'delivered', 'completed', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(selectedBooking.id, status)}
                          className={`px-2.5 py-1 rounded text-xs capitalize ${
                            selectedBooking.bookingStatus === status
                              ? 'bg-red-600 text-white font-bold'
                              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* Tab 3: Customer Product Substitution Approval Workflow */}
            {activeTab === 'substitution' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-left">
                <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-neutral-950 border border-red-900/60 space-y-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-red-500" />
                    <span>Customer-Requested Substitution Approval System</span>
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    <strong>Mandatory Business Policy: </strong>
                    <em>"Agar requested brand/item us time available nahi hai, to customer ko pehle inform kiya jayega. Customer ki confirmation ke bina requested brand/item ki jagah koi doosra option provide nahi karna."</em>
                  </p>
                </div>

                {subSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{subSuccess}</span>
                  </div>
                )}

                {/* Initiate Substitution Proposal Form */}
                <form onSubmit={handleProposeSubstitution} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                  <h5 className="text-sm font-bold text-white">
                    Propose Alternative Product to Customer
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Select Order *
                      </label>
                      <select
                        required
                        value={subBookingId}
                        onChange={(e) => setSubBookingId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                      >
                        <option value="">-- Choose Booking --</option>
                        {bookings.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.id} - {b.customerName} ({b.deliveryArea})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Unavailable Item *
                      </label>
                      <select
                        required
                        value={subUnavailableItem}
                        onChange={(e) => setSubUnavailableItem(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                      >
                        <option value="">-- Choose Item --</option>
                        {productsList.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Offered Replacement Item *
                      </label>
                      <select
                        required
                        value={subOfferedItem}
                        onChange={(e) => setSubOfferedItem(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                      >
                        <option value="">-- Choose Replacement --</option>
                        {productsList.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Reason / Message for Customer
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Al Fakir strawberry batch depleted; offering premium Royal strawberry blend with no price change."
                      value={subReason}
                      onChange={(e) => setSubReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Send Substitution Proposal for Customer Approval
                    </button>
                  </div>
                </form>

                {/* Substitution Status Tracker for Active Bookings */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Active Substitution Approval Tracker
                  </h5>

                  <div className="space-y-2">
                    {bookings
                      .filter(
                        (b) =>
                          b.bookingStatus === 'substitution_requested' ||
                          b.bookingStatus === 'substitution_approved' ||
                          b.bookingStatus === 'substitution_rejected'
                      )
                      .map((b) => (
                        <div
                          key={b.id}
                          className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-between gap-4 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{b.id}</span>
                              <span className="text-neutral-400">({b.customerName})</span>
                            </div>
                            <div className="text-neutral-300 mt-1">
                              Unavailable: <span className="text-red-400 font-medium">{b.substitutionOffered?.unavailableItem}</span> → Offered: <span className="text-emerald-400 font-medium">{b.substitutionOffered?.offeredItem}</span>
                            </div>
                            <div className="text-[11px] text-neutral-400 mt-0.5">{b.substitutionNote}</div>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                                b.bookingStatus === 'substitution_approved'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : b.bookingStatus === 'substitution_rejected'
                                  ? 'bg-red-950 text-red-300 border border-red-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}
                            >
                              {b.bookingStatus === 'substitution_approved'
                                ? 'Customer APPROVED'
                                : b.bookingStatus === 'substitution_rejected'
                                ? 'Customer REJECTED'
                                : 'Awaiting Confirmation'}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 4: Product Catalog & Pricing Management */}
            {activeTab === 'catalog' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-left">
                {/* Header Banner & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-950 border border-red-900/40">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Tag className="w-4 h-4 text-red-500" />
                        <span>Product Inventory & Pricing Management</span>
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 font-semibold">
                        Live DB Sync
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Manage product details, adjust rental rates & sale prices inline, toggle live stock status, and add new inventory.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleOpenAddModal}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-red-900/40 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </button>
                    <button
                      onClick={loadDashboardData}
                      className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
                      title="Refresh products list"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="sm:col-span-5 relative">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search by product name, brand, or type..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                    >
                      <option value="all">All Categories ({productsList.length})</option>
                      <option value="hookah-bases">Hookahs & Bases (Pots)</option>
                      <option value="flavours">Flavours (15+ Brands)</option>
                      <option value="chilam">Chilam (Clay & Silicone Bowls)</option>
                      <option value="pipes">Pipes & Food-Grade Hoses</option>
                      <option value="coal-accessories">Coal & Accessories</option>
                      <option value="sr-products">Kits, Bags & Party Combos</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={productStockFilter}
                      onChange={(e) => setProductStockFilter(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                    >
                      <option value="all">All Stock Status</option>
                      <option value="in_stock">In Stock Only</option>
                      <option value="out_of_stock">Out of Stock Only</option>
                    </select>
                  </div>
                </div>

                {/* Filter count summary */}
                <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                  <span>
                    Showing <strong className="text-white">
                      {productsList.filter((item) => {
                        const matchesCategory =
                          productCategoryFilter === 'all' || item.category === productCategoryFilter;
                        const query = productSearch.toLowerCase().trim();
                        const matchesSearch =
                          !query ||
                          item.name.toLowerCase().includes(query) ||
                          item.categoryLabel.toLowerCase().includes(query) ||
                          item.type.toLowerCase().includes(query) ||
                          (item.brand && item.brand.toLowerCase().includes(query));
                        const matchesStock =
                          productStockFilter === 'all' ||
                          (productStockFilter === 'in_stock' && item.inStock) ||
                          (productStockFilter === 'out_of_stock' && !item.inStock);
                        return matchesCategory && matchesSearch && matchesStock;
                      }).length}
                    </strong> of <strong className="text-white">{productsList.length}</strong> items
                  </span>
                  <span className="text-[11px] text-neutral-500 hidden sm:inline">
                    💡 Click "Save Price" after modifying inline price or rental rate to persist to database.
                  </span>
                </div>

                {/* Products Grid / Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {productsList
                    .filter((item) => {
                      const matchesCategory =
                        productCategoryFilter === 'all' || item.category === productCategoryFilter;
                      const query = productSearch.toLowerCase().trim();
                      const matchesSearch =
                        !query ||
                        item.name.toLowerCase().includes(query) ||
                        item.categoryLabel.toLowerCase().includes(query) ||
                        item.type.toLowerCase().includes(query) ||
                        (item.brand && item.brand.toLowerCase().includes(query));
                      const matchesStock =
                        productStockFilter === 'all' ||
                        (productStockFilter === 'in_stock' && item.inStock) ||
                        (productStockFilter === 'out_of_stock' && !item.inStock);
                      return matchesCategory && matchesSearch && matchesStock;
                    })
                    .map((prod) => {
                      const inline = inlinePrices[prod.id];
                      const currentPrice = inline?.price !== undefined ? inline.price : prod.price;
                      const currentRental =
                        inline?.rentalRate !== undefined
                          ? inline.rentalRate
                          : (prod.rentalRate || `₹${prod.price} / session`);
                      const isSaved = savedBadgeId === prod.id;

                      return (
                        <div
                          key={prod.id}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isSaved
                              ? 'border-emerald-600/80 bg-emerald-950/20'
                              : 'border-neutral-800/80 bg-neutral-950 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* Image */}
                            <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0 overflow-hidden flex items-center justify-center">
                              {prod.images?.[0] ? (
                                <img
                                  src={prod.images[0]}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <Package className="w-6 h-6 text-neutral-600" />
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h5 className="font-bold text-white text-xs sm:text-sm truncate">
                                    {prod.name}
                                  </h5>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium">
                                      {prod.categoryLabel}
                                    </span>
                                    <span className="text-[10px] text-neutral-400">
                                      Brand: {prod.brand || 'Shisha Rent'}
                                    </span>
                                  </div>
                                </div>

                                {/* In Stock toggle */}
                                <button
                                  onClick={() => handleToggleStock(prod.id, prod.inStock)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 transition-colors cursor-pointer ${
                                    prod.inStock
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                                      : 'bg-red-950 text-red-400 border border-red-800 hover:bg-red-900'
                                  }`}
                                >
                                  {prod.inStock ? 'In Stock' : 'Out of Stock'}
                                </button>
                              </div>

                              {/* Inline Pricing Editor */}
                              <div className="mt-3 p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800/80 space-y-2">
                                <div className="grid grid-cols-2 gap-2 text-left">
                                  <div>
                                    <label className="block text-[10px] font-semibold text-neutral-400 mb-1">
                                      Retail Price (₹)
                                    </label>
                                    <input
                                      type="number"
                                      value={currentPrice}
                                      onChange={(e) =>
                                        handleInlinePriceChange(prod.id, 'price', e.target.value)
                                      }
                                      className="w-full px-2 py-1 rounded bg-black/60 border border-neutral-800 text-white text-xs font-semibold focus:outline-none focus:border-red-600 tabular-nums"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-semibold text-neutral-400 mb-1">
                                      Rental Rate Text
                                    </label>
                                    <input
                                      type="text"
                                      value={currentRental}
                                      onChange={(e) =>
                                        handleInlinePriceChange(prod.id, 'rentalRate', e.target.value)
                                      }
                                      className="w-full px-2 py-1 rounded bg-black/60 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                                      placeholder="e.g. ₹999 / session"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-[10px] text-neutral-500 truncate max-w-[120px]">
                                    {prod.rentalOrSale}
                                  </span>

                                  <div className="flex items-center gap-1.5">
                                    {isSaved && (
                                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 animate-in fade-in">
                                        <Check className="w-3 h-3" /> Saved!
                                      </span>
                                    )}

                                    <button
                                      onClick={() => handleSaveInlinePrice(prod)}
                                      className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer border border-neutral-700"
                                      title="Save pricing to database"
                                    >
                                      <Save className="w-3 h-3 text-red-500" />
                                      <span>Save Price</span>
                                    </button>

                                    <button
                                      onClick={() => handleOpenEditModal(prod)}
                                      className="p-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                                      title="Edit full product details"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                      className="p-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-colors border border-red-900/40"
                                      title="Delete product"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {productsList.filter((item) => {
                  const matchesCategory =
                    productCategoryFilter === 'all' || item.category === productCategoryFilter;
                  const query = productSearch.toLowerCase().trim();
                  const matchesSearch =
                    !query ||
                    item.name.toLowerCase().includes(query) ||
                    item.categoryLabel.toLowerCase().includes(query) ||
                    item.type.toLowerCase().includes(query) ||
                    (item.brand && item.brand.toLowerCase().includes(query));
                  const matchesStock =
                    productStockFilter === 'all' ||
                    (productStockFilter === 'in_stock' && item.inStock) ||
                    (productStockFilter === 'out_of_stock' && !item.inStock);
                  return matchesCategory && matchesSearch && matchesStock;
                }).length === 0 && (
                  <div className="py-12 text-center text-neutral-400 space-y-3">
                    <Package className="w-10 h-10 mx-auto text-neutral-600" />
                    <p className="text-sm font-semibold text-neutral-300">
                      No products found matching your filter criteria.
                    </p>
                    <button
                      onClick={() => {
                        setProductSearch('');
                        setProductCategoryFilter('all');
                        setProductStockFilter('all');
                      }}
                      className="px-4 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white hover:bg-neutral-800"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4b: Gallery Portfolio Management (Upload, Edit, Delete & Sync) */}
            {activeTab === 'gallery' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-left">
                {/* Header Banner & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-950 border border-red-900/40">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Camera className="w-4 h-4 text-amber-400" />
                        <span>Website Gallery Portfolio Manager</span>
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                        Synced with Gallery Page
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Upload your own event photos, edit titles, locations, or categories, and delete photos. All updates sync immediately with the main website Gallery page.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleOpenAddGalleryModal}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-red-900/40 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload New Gallery Photo</span>
                    </button>
                    <button
                      onClick={loadDashboardData}
                      className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      title="Refresh gallery items"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {galleryActionSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-300 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{galleryActionSuccess}</span>
                    </div>
                    <button onClick={() => setGalleryActionSuccess('')} className="text-emerald-300 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {galleryActionError && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700 text-xs text-red-300 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{galleryActionError}</span>
                    </div>
                    <button onClick={() => setGalleryActionError('')} className="text-red-300 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Filter & Search Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="sm:col-span-7 relative">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search gallery photos by title or venue location..."
                      value={gallerySearch}
                      onChange={(e) => setGallerySearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <select
                      value={galleryCategoryFilter}
                      onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                    >
                      <option value="all">All Gallery Categories ({galleryList.length})</option>
                      <option value="parties">Private Parties</option>
                      <option value="weddings">Weddings & Sangeet</option>
                      <option value="hookahs">Hookahs & Bases</option>
                      <option value="cocktails">Mixology & Bar</option>
                    </select>
                  </div>
                </div>

                {/* Gallery Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryList
                    .filter((item) => {
                      const matchesCat =
                        galleryCategoryFilter === 'all' || item.category === galleryCategoryFilter;
                      const q = gallerySearch.toLowerCase().trim();
                      const matchesSearch =
                        !q ||
                        item.title.toLowerCase().includes(q) ||
                        item.subtitle.toLowerCase().includes(q) ||
                        item.category.toLowerCase().includes(q);
                      return matchesCat && matchesSearch;
                    })
                    .map((item) => {
                      const categoryLabelMap: Record<string, string> = {
                        parties: 'Private Parties',
                        weddings: 'Weddings & Sangeet',
                        hookahs: 'Hookahs & Bases',
                        cocktails: 'Mixology & Bar',
                      };
                      return (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden flex flex-col justify-between group hover:border-neutral-700 transition-all"
                        >
                          <div>
                            <div className="relative aspect-[4/3] w-full bg-neutral-900 overflow-hidden">
                              {item.src ? (
                                <img
                                  src={item.src}
                                  alt={item.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Camera className="w-8 h-8 text-neutral-700" />
                                </div>
                              )}
                              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm border border-neutral-700 text-[10px] font-bold text-amber-400">
                                {categoryLabelMap[item.category] || item.category}
                              </div>
                            </div>

                            <div className="p-3.5 space-y-1">
                              <div className="text-[11px] font-semibold text-red-400 truncate">
                                {item.subtitle}
                              </div>
                              <h5 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                                {item.title}
                              </h5>
                            </div>
                          </div>

                          <div className="px-3.5 py-2.5 border-t border-neutral-900 bg-black/40 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditGalleryModal(item)}
                              className="flex-1 py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Edit Photo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryItem(item.id, item.title)}
                              className="py-1.5 px-3 rounded-lg bg-red-950/50 hover:bg-red-900/70 text-red-300 border border-red-900/60 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              title="Delete photo from gallery"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {galleryList.length === 0 && (
                  <div className="py-12 text-center text-neutral-400 space-y-3 border border-neutral-800 rounded-2xl bg-neutral-950">
                    <Camera className="w-10 h-10 mx-auto text-neutral-600" />
                    <p className="text-sm font-semibold text-neutral-300">
                      No photos in your gallery yet.
                    </p>
                    <button
                      onClick={handleOpenAddGalleryModal}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Upload First Gallery Photo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4c: WordPress / Yoast Style SEO & Ranking Manager */}
            {activeTab === 'seo' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-left">
                <AdminSeoManager adminEmail={currentAdminProfile.email || adminEmail || 'admin@shisharent.in'} />
              </div>
            )}

            {/* Tab 5: Immutable Terms Acceptances Audit Trail */}
            {activeTab === 'terms' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-left">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Immutable Terms Acceptance Audit Records
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Non-updatable proof records of customer agreement to the Customer Request & Availability policy upon placing orders.
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-neutral-900/80 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="p-3">Record ID & Booking</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Domain</th>
                        <th className="p-3">IP Address</th>
                        <th className="p-3">Terms Version</th>
                        <th className="p-3">Accepted At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {termsAudit.map((rec) => (
                        <tr key={rec.id} className="hover:bg-neutral-900/30">
                          <td className="p-3">
                            <span className="font-mono text-white font-bold">{rec.bookingId}</span>
                            <div className="text-[10px] text-neutral-500 font-mono">{rec.id}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-white font-semibold">{rec.customerName}</div>
                            <div className="text-[11px] text-neutral-400">{rec.customerPhone}</div>
                          </td>
                          <td className="p-3 font-mono text-amber-400">{rec.domain}</td>
                          <td className="p-3 font-mono text-neutral-400">{rec.customerIp || '103.220.14.88'}</td>
                          <td className="p-3 font-mono">{rec.termsVersion}</td>
                          <td className="p-3 text-neutral-400">
                            {new Date(rec.acceptedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* Tab 6: Admin Security & Change Credentials */}
            {activeTab === 'security' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-left">
                <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Administrator Login Credentials & Security</span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Update your administrator login email and password at any time. Your updated credentials are saved permanently to the server database.
                    </p>
                  </div>
                  <div className="text-right text-xs text-neutral-400 shrink-0">
                    <div>Active Admin Email: <span className="text-amber-400 font-mono font-semibold">{currentAdminProfile.email}</span></div>
                    {currentAdminProfile.updatedAt && (
                      <div>Last Updated: <span className="text-neutral-300">{new Date(currentAdminProfile.updatedAt).toLocaleString()}</span></div>
                    )}
                  </div>
                </div>

                {credSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{credSuccess}</span>
                  </div>
                )}

                {credError && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{credError}</span>
                  </div>
                )}

                <form
                  onSubmit={handleSaveAdminCredentials}
                  className="max-w-2xl p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-5"
                >
                  <div className="border-b border-neutral-800 pb-3">
                    <h5 className="text-sm font-bold text-white">Change Admin Email & Password</h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Verify your current password below to set your new private admin email and password for live production use.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Administrator Name / Title
                      </label>
                      <input
                        type="text"
                        value={credNewName}
                        onChange={(e) => setCredNewName(e.target.value)}
                        placeholder="Shisha Rent Operations Manager"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        New Admin Login Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={credNewEmail}
                        onChange={(e) => setCredNewEmail(e.target.value)}
                        placeholder="Enter your new admin email"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1.5">
                      Current Admin Password (Required to Authorize Change) *
                    </label>
                    <input
                      type="password"
                      required
                      value={credCurrentPassword}
                      onChange={(e) => setCredCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        New Admin Password (min 6 chars)
                      </label>
                      <input
                        type="password"
                        value={credNewPassword}
                        onChange={(e) => setCredNewPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Confirm New Admin Password
                      </label>
                      <input
                        type="password"
                        value={credConfirmPassword}
                        onChange={(e) => setCredConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={credSaving}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-900/30 transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{credSaving ? 'Saving Credentials...' : 'Update Admin Credentials'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* Sub-Modal: Add or Edit Product Dialog */}
        {isProductFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-xl rounded-2xl bg-[#0e0e17] border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500">
                    {editingProduct ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product to Catalog'}
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Changes persist in PostgreSQL & JSON database across both domains.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsProductFormOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProductForm} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-left">
                {productActionSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{productActionSuccess}</span>
                  </div>
                )}

                {productActionError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-700 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{productActionError}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Dschinni Stainless Steel Russian Hookah"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                  />
                </div>

                {/* Category & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                    >
                      <option value="hookah-bases">Hookahs & Bases (Pots)</option>
                      <option value="flavours">Flavours (15+ Brands)</option>
                      <option value="chilam">Chilam (Clay & Silicone Bowls)</option>
                      <option value="pipes">Pipes & Food-Grade Hoses</option>
                      <option value="coal-accessories">Coal & Accessories</option>
                      <option value="sr-products">Kits, Bags & Party Combos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Product Type / Sub-Category
                    </label>
                    <input
                      type="text"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      placeholder="e.g. German Hookah Pot / Pure Clay Chilam"
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Brand & Highlight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Brand / Manufacturer
                    </label>
                    <input
                      type="text"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      placeholder="e.g. Shisha Rent Kolkata, Al Fakir, Afzal"
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Highlight Tag (Badge)
                    </label>
                    <input
                      type="text"
                      value={formHighlight}
                      onChange={(e) => setFormHighlight(e.target.value)}
                      placeholder="e.g. German Precision, Heavy Smoke, Certified"
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Pricing Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div>
                    <label className="block text-xs font-semibold text-amber-400 mb-1">
                      Retail / Sale Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-neutral-800 text-white text-xs font-bold focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-400 mb-1">
                      Rental Rate Display (e.g. ₹999 / session)
                    </label>
                    <input
                      type="text"
                      value={formRentalRate}
                      onChange={(e) => setFormRentalRate(e.target.value)}
                      placeholder="e.g. ₹1,299 / session"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Description & Specifications
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Detail the build quality, smoke density, accessories included, and Kolkata delivery timing..."
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600 resize-none"
                  />
                </div>

                {/* Image Upload or URL */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Product Image
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Upload File from Device</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFormImageFile(e.target.files[0]);
                          }
                        }}
                        className="w-full text-xs text-neutral-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Or Enter Image URL</label>
                      <input
                        type="text"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="https://... or /src/assets/images/..."
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  {formImageUrl && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-neutral-400">Preview:</span>
                      <img
                        src={formImageUrl}
                        alt="Preview"
                        className="w-8 h-8 rounded object-cover border border-neutral-700"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formInStock}
                      onChange={(e) => setFormInStock(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 bg-neutral-900 border-neutral-800 focus:ring-0"
                    />
                    <span className="text-xs text-neutral-300 font-semibold">In Stock (Available)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsBestSeller}
                      onChange={(e) => setFormIsBestSeller(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 bg-neutral-900 border-neutral-800 focus:ring-0"
                    />
                    <span className="text-xs text-neutral-300 font-semibold">Mark as Best Seller</span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsProductFormOpen(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-900/40 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSavingProduct ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingProduct ? 'Save Product Changes' : 'Create & Publish Product'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sub-Modal: Add or Edit Gallery Photo Dialog */}
        {isGalleryFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-lg rounded-2xl bg-[#0e0e17] border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950 shrink-0">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-600/40 flex items-center justify-center text-amber-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {editingGalleryItem ? 'Edit Gallery Photo' : 'Upload New Gallery Photo'}
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Automatically syncs with the main website Gallery & Atmosphere page.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGalleryFormOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveGalleryForm} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-left">
                {galleryActionSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{galleryActionSuccess}</span>
                  </div>
                )}

                {galleryActionError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-700 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{galleryActionError}</span>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Photo Title / Setup Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={galTitle}
                    onChange={(e) => setGalTitle(e.target.value)}
                    placeholder="e.g. VIP Lounge Setup with Exotic Fruit Garnishes"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                  />
                </div>

                {/* Subtitle / Location & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Subtitle / Venue Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={galSubtitle}
                      onChange={(e) => setGalSubtitle(e.target.value)}
                      placeholder="e.g. Park Street Penthouse Terrace"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Gallery Category *
                    </label>
                    <select
                      value={galCategory}
                      onChange={(e) => setGalCategory(e.target.value as GalleryItem['category'])}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                    >
                      <option value="parties">Private Parties</option>
                      <option value="weddings">Weddings & Sangeet</option>
                      <option value="hookahs">Hookahs & Bases</option>
                      <option value="cocktails">Mixology & Bar</option>
                    </select>
                  </div>
                </div>

                {/* Upload Image from Device or Enter URL */}
                <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3">
                  <label className="block text-xs font-semibold text-amber-400">
                    Upload Photo from Device or Paste Image URL *
                  </label>

                  <div>
                    <label className="block text-[11px] text-neutral-300 mb-1">
                      1. Choose Image File from Computer / Phone
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleGalleryFileSelect(file);
                      }}
                      className="w-full text-xs text-neutral-300 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer"
                    />
                  </div>

                  <div className="border-t border-neutral-800 pt-2.5">
                    <label className="block text-[11px] text-neutral-400 mb-1">
                      2. Or Paste Direct Image URL
                    </label>
                    <input
                      type="text"
                      value={galImageUrl}
                      onChange={(e) => {
                        setGalImageUrl(e.target.value);
                        if (!galImageFile) {
                          setGalPreviewUrl(e.target.value);
                        }
                      }}
                      placeholder="https://... or /src/assets/images/..."
                      className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-600"
                    />
                  </div>

                  {/* Live Preview */}
                  {galPreviewUrl && (
                    <div className="pt-2">
                      <span className="block text-[11px] font-semibold text-neutral-400 mb-1.5">
                        Live Photo Preview:
                      </span>
                      <div className="relative aspect-[4/3] w-full max-w-[260px] rounded-xl overflow-hidden border border-neutral-700 bg-black">
                        <img
                          src={galPreviewUrl}
                          alt="Gallery Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsGalleryFormOpen(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingGallery}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-900/40 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSavingGallery ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading & Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingGalleryItem ? 'Save Gallery Changes' : 'Publish to Website Gallery'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
