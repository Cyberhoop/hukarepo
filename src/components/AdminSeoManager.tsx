import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  Share2,
  Code2,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Upload,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Monitor,
  RefreshCw,
  Eye,
  ShieldCheck,
  Table2,
  RotateCcw,
  ArrowUpRight,
} from 'lucide-react';
import { api, SeoConfig, PageSeoConfig } from '../services/api';
import { useSeo, FALLBACK_SEO_CONFIG } from '../context/SeoContext';

interface AdminSeoManagerProps {
  adminEmail: string;
}

type SeoSubTab = 'page_editor' | 'bulk_editor' | 'global' | 'social' | 'schema' | 'technical';
type BulkStatusFilter = 'all' | 'good' | 'needs_work' | 'noindex';

export const AdminSeoManager: React.FC<AdminSeoManagerProps> = ({ adminEmail }) => {
  const { seoConfig, refreshSeoConfig, setSeoConfigDirectly } = useSeo();

  const [subTab, setSubTab] = useState<SeoSubTab>('page_editor');
  const [selectedPageKey, setSelectedPageKey] = useState<string>('home');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [bulkSearchQuery, setBulkSearchQuery] = useState<string>('');
  const [bulkStatusFilter, setBulkStatusFilter] = useState<BulkStatusFilter>('all');

  // Local editable form state synced with seoConfig
  const [formState, setFormState] = useState<SeoConfig>(seoConfig || FALLBACK_SEO_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingOg, setIsUploadingOg] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [copiedSitemap, setCopiedSitemap] = useState(false);

  useEffect(() => {
    if (seoConfig) {
      setFormState(seoConfig);
    }
  }, [seoConfig]);

  const activePage: PageSeoConfig =
    formState.pages?.[selectedPageKey] ||
    FALLBACK_SEO_CONFIG.pages[selectedPageKey] ||
    FALLBACK_SEO_CONFIG.pages.home;

  const handleGlobalChange = <K extends keyof SeoConfig>(field: K, value: SeoConfig[K]) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePageFieldChange = <K extends keyof PageSeoConfig>(
    pageKey: string,
    field: K,
    value: PageSeoConfig[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageKey]: {
          ...(prev.pages?.[pageKey] || FALLBACK_SEO_CONFIG.pages[pageKey]),
          [field]: value,
        },
      },
    }));
  };

  const baselinePages = (seoConfig || FALLBACK_SEO_CONFIG).pages || FALLBACK_SEO_CONFIG.pages;

  const isPageRowDirty = (pageKey: string): boolean => {
    const current = formState.pages?.[pageKey];
    const base = baselinePages?.[pageKey] || FALLBACK_SEO_CONFIG.pages[pageKey];
    if (!current || !base) return false;
    return (
      (current.title || '') !== (base.title || '') ||
      (current.description || '') !== (base.description || '') ||
      (current.focusKeyword || '') !== (base.focusKeyword || '') ||
      Boolean(current.robotsIndex !== false) !== Boolean(base.robotsIndex !== false)
    );
  };

  const handleResetPageRow = (pageKey: string) => {
    const base = baselinePages?.[pageKey] || FALLBACK_SEO_CONFIG.pages[pageKey];
    if (!base) return;
    setFormState((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageKey]: { ...base },
      },
    }));
  };

  const handleResetAllBulkChanges = () => {
    setFormState((prev) => ({
      ...prev,
      pages: JSON.parse(JSON.stringify(baselinePages)),
    }));
  };

  const handleOpenInSerpEditor = (pageKey: string) => {
    setSelectedPageKey(pageKey);
    setSubTab('page_editor');
  };

  const handleUploadOgImageFile = async (
    file: File,
    target: 'global' | 'page'
  ) => {
    setIsUploadingOg(true);
    setStatusBanner(null);
    try {
      const fd = new FormData();
      fd.append('ogImage', file);
      const res = await api.uploadOgImage(fd);
      if (res.success && res.imageUrl) {
        if (target === 'global') {
          handleGlobalChange('defaultOgImage', res.imageUrl);
        } else {
          handlePageFieldChange(selectedPageKey, 'ogImage', res.imageUrl);
        }
        setStatusBanner({
          type: 'success',
          text: 'Social share OpenGraph banner uploaded! Click "Save & Publish SEO" to make it live.',
        });
      } else {
        setStatusBanner({
          type: 'error',
          text: res.error || 'Failed to upload OpenGraph image.',
        });
      }
    } catch {
      setStatusBanner({
        type: 'error',
        text: 'Network error while uploading OpenGraph image.',
      });
    } finally {
      setIsUploadingOg(false);
    }
  };

  const handleSaveAllSeo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setStatusBanner(null);
    try {
      const res = await api.updateSeoSettings(formState, adminEmail);
      if (res.success && res.data) {
        setSeoConfigDirectly(res.data);
        await refreshSeoConfig();
        setStatusBanner({
          type: 'success',
          text:
            res.message ||
            'All WordPress/Yoast SEO settings, meta tags, OpenGraph cards, and Schema.org JSON-LD published live!',
        });
      } else {
        setStatusBanner({
          type: 'error',
          text: res.error || 'Failed to update SEO configuration.',
        });
      }
    } catch {
      setStatusBanner({
        type: 'error',
        text: 'Network error while saving SEO settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ====================================================================
  // YOAST-STYLE REAL-TIME SEO SCORE & CHECKLIST ANALYZER
  // ====================================================================
  const computeYoastAnalysis = (page: PageSeoConfig) => {
    const title = (page.title || '').trim();
    const desc = (page.description || '').trim();
    const focusKw = (page.focusKeyword || '').trim().toLowerCase();
    const keywordsList = (page.keywords || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const ogImg = page.ogImage || formState.defaultOgImage;

    const checks: {
      id: string;
      status: 'good' | 'ok' | 'bad';
      label: string;
      detail: string;
      points: number;
      maxPoints: number;
    }[] = [];

    // 1. Focus Keyword Defined (15 pts)
    if (focusKw.length >= 3) {
      checks.push({
        id: 'focus_kw',
        status: 'good',
        label: 'Focus keyphrase is set',
        detail: `Targeting "${page.focusKeyword}" for this page.`,
        points: 15,
        maxPoints: 15,
      });
    } else {
      checks.push({
        id: 'focus_kw',
        status: 'bad',
        label: 'No focus keyphrase set',
        detail: 'Add a primary search phrase (e.g., "Hookah Rental Kolkata") to optimize ranking.',
        points: 0,
        maxPoints: 15,
      });
    }

    // 2. Focus Keyword in SEO Title (20 pts)
    if (focusKw && title.toLowerCase().includes(focusKw)) {
      const startsEarly = title.toLowerCase().indexOf(focusKw) <= 25;
      checks.push({
        id: 'kw_in_title',
        status: 'good',
        label: 'Focus keyphrase appears in the SEO Title',
        detail: startsEarly
          ? 'Exact match found near the beginning of the title tag (maximum Google weight).'
          : 'Focus keyphrase is present in the SEO title.',
        points: 20,
        maxPoints: 20,
      });
    } else {
      checks.push({
        id: 'kw_in_title',
        status: 'bad',
        label: 'Focus keyphrase missing from SEO Title',
        detail: `Include "${page.focusKeyword || 'your focus keyword'}" inside the SEO Title for stronger click-through and ranking.`,
        points: 0,
        maxPoints: 20,
      });
    }

    // 3. SEO Title Length (15 pts)
    if (title.length >= 45 && title.length <= 65) {
      checks.push({
        id: 'title_len',
        status: 'good',
        label: `SEO Title length is optimal (${title.length} chars)`,
        detail: 'Fits cleanly inside Google desktop & mobile SERP without ellipsis truncation.',
        points: 15,
        maxPoints: 15,
      });
    } else if (title.length >= 30 && title.length <= 75) {
      checks.push({
        id: 'title_len',
        status: 'ok',
        label: `SEO Title length is acceptable (${title.length} chars)`,
        detail:
          title.length < 45
            ? 'Title is slightly short. Aim for 50–60 characters to maximize keyword coverage.'
            : 'Title is slightly over 60 characters and may truncate on smaller screens.',
        points: 10,
        maxPoints: 15,
      });
    } else {
      checks.push({
        id: 'title_len',
        status: 'bad',
        label: `SEO Title length needs improvement (${title.length} chars)`,
        detail: 'Recommended length is between 50 and 60 characters.',
        points: 3,
        maxPoints: 15,
      });
    }

    // 4. Focus Keyword in Meta Description (15 pts)
    if (focusKw && desc.toLowerCase().includes(focusKw)) {
      checks.push({
        id: 'kw_in_desc',
        status: 'good',
        label: 'Focus keyphrase appears in Meta Description',
        detail: 'Google bolds matching search terms in the snippet, boosting organic CTR.',
        points: 15,
        maxPoints: 15,
      });
    } else {
      checks.push({
        id: 'kw_in_desc',
        status: 'ok',
        label: 'Focus keyphrase not found in Meta Description',
        detail: `Include "${page.focusKeyword || 'your focus keyword'}" in the meta description so Google highlights it in bold.`,
        points: 5,
        maxPoints: 15,
      });
    }

    // 5. Meta Description Length (15 pts)
    if (desc.length >= 120 && desc.length <= 165) {
      checks.push({
        id: 'desc_len',
        status: 'good',
        label: `Meta Description length is optimal (${desc.length} chars)`,
        detail: 'Ideal 120–160 character range for rich Google search snippets.',
        points: 15,
        maxPoints: 15,
      });
    } else if (desc.length >= 80 && desc.length <= 190) {
      checks.push({
        id: 'desc_len',
        status: 'ok',
        label: `Meta Description length is ${desc.length} chars`,
        detail: 'Aim for 120–160 characters for the cleanest Google SERP appearance.',
        points: 10,
        maxPoints: 15,
      });
    } else {
      checks.push({
        id: 'desc_len',
        status: 'bad',
        label: `Meta Description length (${desc.length} chars) is outside ideal range`,
        detail: 'Write a compelling 120–160 character summary with call-to-action.',
        points: 3,
        maxPoints: 15,
      });
    }

    // 6. Supporting Keywords & LSI Tags (10 pts)
    if (keywordsList.length >= 3) {
      checks.push({
        id: 'lsi_kw',
        status: 'good',
        label: `${keywordsList.length} secondary / local SEO keywords configured`,
        detail: 'Strong semantic coverage for Kolkata local areas and product terms.',
        points: 10,
        maxPoints: 10,
      });
    } else {
      checks.push({
        id: 'lsi_kw',
        status: 'ok',
        label: 'Add more secondary keywords',
        detail: 'Add at least 3–5 comma-separated local keywords (e.g., Salt Lake, Park Street, Chillum Delivery).',
        points: 4,
        maxPoints: 10,
      });
    }

    // 7. Social OpenGraph Image & Indexing Status (10 pts)
    if (ogImg && (page.robotsIndex !== false || page.pageId === 'account')) {
      checks.push({
        id: 'og_ready',
        status: 'good',
        label: 'OpenGraph Social Image & Crawler Indexing ready',
        detail: 'WhatsApp, Facebook, and Google Discover previews have a high-res image.',
        points: 10,
        maxPoints: 10,
      });
    } else {
      checks.push({
        id: 'og_ready',
        status: 'ok',
        label: 'Check OpenGraph Image or Robots Indexing',
        detail: 'Ensure a social preview image is set and indexing is enabled for public pages.',
        points: 5,
        maxPoints: 10,
      });
    }

    const totalPoints = checks.reduce((acc, c) => acc + c.points, 0);
    const maxPoints = checks.reduce((acc, c) => acc + c.maxPoints, 0);
    const score = Math.round((totalPoints / maxPoints) * 100);

    return { score, checks };
  };

  const analysis = computeYoastAnalysis(activePage);

  // Highlight focus keyword in Google SERP description preview
  const renderHighlightedDescription = (text: string, keyword: string) => {
    const cleanText =
      text.length > 165 ? text.slice(0, 162) + '...' : text || formState.defaultDescription;
    if (!keyword || !keyword.trim()) return cleanText;
    const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = cleanText.split(new RegExp(`(${escaped})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.trim().toLowerCase() ? (
        <strong key={i} className="font-bold text-neutral-900 dark:text-white">
          {part}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const liveDomainUrl = (formState.canonicalDomain || 'https://shisharent.in').replace(/\/+$/, '');
  const liveSitemapUrl = `${window.location.origin}/sitemap.xml`;
  const liveRobotsUrl = `${window.location.origin}/robots.txt`;

  const previewJsonLd = {
    '@context': 'https://schema.org',
    '@type': formState.schemaBusinessType || 'LocalBusiness',
    name: formState.schemaBusinessName || formState.siteName,
    description: formState.schemaDescription || formState.defaultDescription,
    url: liveDomainUrl,
    telephone: formState.schemaTelephone,
    email: formState.schemaEmail,
    priceRange: formState.schemaPriceRange,
    openingHours: formState.schemaOpeningHours,
    address: {
      '@type': 'PostalAddress',
      streetAddress: formState.schemaStreetAddress,
      addressLocality: formState.schemaLocality,
      addressRegion: formState.schemaRegion,
      postalCode: formState.schemaPostalCode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: formState.schemaGeoLat,
      longitude: formState.schemaGeoLng,
    },
    areaServed: (formState.schemaAreaServed || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: formState.schemaRatingValue || '4.9',
      reviewCount: formState.schemaReviewCount || '428',
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner with Overall SEO Score & Save Button */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#12121a] to-[#12121a] border border-emerald-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border font-bold ${
              analysis.score >= 80
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : analysis.score >= 55
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-red-500/15 border-red-500/40 text-red-400'
            }`}
          >
            <span className="text-xl leading-none">{analysis.score}</span>
            <span className="text-[9px] uppercase tracking-wider mt-0.5">/ 100</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> WordPress / Yoast SEO Suite
              </span>
              <span className="text-xs text-neutral-400">
                Server-Side + Live DOM Injection Active
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
              Search Engine Ranking & Metadata Control Center
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Customize global and per-page titles, meta descriptions, focus keywords, WhatsApp/OpenGraph cards, Schema.org JSON-LD, and XML Sitemaps.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
            sitemap.xml
            <ExternalLink className="w-3 h-3 text-neutral-500" />
          </a>
          <button
            type="button"
            onClick={() => handleSaveAllSeo()}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Publishing SEO...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Save & Publish SEO Live
              </>
            )}
          </button>
        </div>
      </div>

      {statusBanner && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-medium ${
            statusBanner.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/50 border-red-500/40 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusBanner.text}</span>
          </div>
          <button
            onClick={() => setStatusBanner(null)}
            className="text-xs text-neutral-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sub-Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-3">
        {[
          {
            id: 'page_editor' as SeoSubTab,
            label: '1. Per-Page SEO & SERP Preview',
            icon: Search,
          },
          {
            id: 'bulk_editor' as SeoSubTab,
            label: '2. Bulk SEO Editor (All Pages)',
            icon: Table2,
          },
          {
            id: 'global' as SeoSubTab,
            label: '3. Global Site Title & Webmaster Tags',
            icon: Globe,
          },
          {
            id: 'social' as SeoSubTab,
            label: '4. WhatsApp / OpenGraph Social Cards',
            icon: Share2,
          },
          {
            id: 'schema' as SeoSubTab,
            label: '5. LocalBusiness Schema.org (JSON-LD)',
            icon: Code2,
          },
          {
            id: 'technical' as SeoSubTab,
            label: '6. Sitemap.xml & Robots.txt',
            icon: FileCode2,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-950/30'
                  : 'bg-neutral-900/90 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: PER-PAGE SEO EDITOR + GOOGLE SERP PREVIEW + YOAST ANALYZER     */}
      {/* ==================================================================== */}
      {subTab === 'page_editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Page Selector & Meta Tag Inputs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Page Selector Bar */}
            <div className="p-4 rounded-2xl bg-[#12121a] border border-neutral-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Select Website Page to Optimize
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-neutral-400 font-mono">
                    Route: {activePage.path}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSubTab('bulk_editor')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Table2 className="w-3 h-3" />
                    Bulk Edit All Pages
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(formState.pages || FALLBACK_SEO_CONFIG.pages).map((p) => {
                  const isSelected = p.pageId === selectedPageKey;
                  const pageScore = computeYoastAnalysis(p).score;
                  return (
                    <button
                      key={p.pageId}
                      type="button"
                      onClick={() => setSelectedPageKey(p.pageId)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-neutral-900/70 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate capitalize">{p.pageId}</span>
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            pageScore >= 80
                              ? 'bg-emerald-400'
                              : pageScore >= 55
                              ? 'bg-amber-400'
                              : 'bg-red-400'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-500 truncate mt-0.5">
                        {p.path} · {pageScore}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Yoast Meta Fields Editor */}
            <div className="p-5 rounded-2xl bg-[#12121a] border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Editing Page: <span className="text-emerald-400">{activePage.pageLabel}</span>
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Changes dynamically update {'<title>'}, {'<meta name="description">'}, and {'<link rel="canonical">'} on {activePage.path}.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activePage.robotsIndex !== false}
                    onChange={(e) =>
                      handlePageFieldChange(selectedPageKey, 'robotsIndex', e.target.checked)
                    }
                    className="rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-neutral-300">
                    Allow Google Indexing
                  </span>
                </label>
              </div>

              {/* Focus Keyphrase */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-200">
                    Focus Keyphrase (Primary Target Keyword)
                  </label>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    Yoast Primary Ranking Signal
                  </span>
                </div>
                <input
                  type="text"
                  value={activePage.focusKeyword || ''}
                  onChange={(e) =>
                    handlePageFieldChange(selectedPageKey, 'focusKeyword', e.target.value)
                  }
                  placeholder="e.g. Hookah Rental Kolkata"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* SEO Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-200">
                    SEO Title ({'<title>'} Tag)
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      activePage.title.length >= 45 && activePage.title.length <= 65
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {activePage.title.length} / 60 chars recommended
                  </span>
                </div>
                <input
                  type="text"
                  value={activePage.title || ''}
                  onChange={(e) => handlePageFieldChange(selectedPageKey, 'title', e.target.value)}
                  placeholder="Enter page SEO title..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full transition-all ${
                      activePage.title.length >= 45 && activePage.title.length <= 65
                        ? 'bg-emerald-500'
                        : activePage.title.length > 65
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((activePage.title.length / 65) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-200">
                    Meta Description ({'<meta name="description">'})
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      activePage.description.length >= 120 && activePage.description.length <= 165
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {activePage.description.length} / 160 chars recommended
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={activePage.description || ''}
                  onChange={(e) =>
                    handlePageFieldChange(selectedPageKey, 'description', e.target.value)
                  }
                  placeholder="Write a high-converting meta description..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
                <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all ${
                      activePage.description.length >= 120 && activePage.description.length <= 165
                        ? 'bg-emerald-500'
                        : activePage.description.length > 165
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((activePage.description.length / 165) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Additional Meta Keywords */}
              <div>
                <label className="block text-xs font-bold text-neutral-200 mb-1">
                  Additional Page Keywords (Comma-Separated LSI & Local Areas)
                </label>
                <input
                  type="text"
                  value={activePage.keywords || ''}
                  onChange={(e) =>
                    handlePageFieldChange(selectedPageKey, 'keywords', e.target.value)
                  }
                  placeholder="Hookah Delivery Salt Lake, Park Street Shisha, Pre-filled Chillum Kolkata..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Sitemap Priority & Change Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-800/80">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Canonical Path
                  </label>
                  <input
                    type="text"
                    value={activePage.canonicalPath || activePage.path}
                    onChange={(e) =>
                      handlePageFieldChange(selectedPageKey, 'canonicalPath', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Sitemap Priority (0.1 - 1.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1.0"
                    value={activePage.priority ?? 0.8}
                    onChange={(e) =>
                      handlePageFieldChange(
                        selectedPageKey,
                        'priority',
                        parseFloat(e.target.value) || 0.8
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Crawl Frequency
                  </label>
                  <select
                    value={activePage.changefreq || 'weekly'}
                    onChange={(e) =>
                      handlePageFieldChange(
                        selectedPageKey,
                        'changefreq',
                        e.target.value as 'daily' | 'weekly' | 'monthly'
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Google SERP Preview + Yoast SEO Checklist */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Google SERP Preview Card */}
            <div className="p-5 rounded-2xl bg-[#12121a] border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Live Google Search Snippet Preview
                  </h4>
                </div>
                <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setSerpDevice('desktop')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                      serpDevice === 'desktop'
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3 h-3" /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerpDevice('mobile')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                      serpDevice === 'mobile'
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" /> Mobile
                  </button>
                </div>
              </div>

              {/* Authentic Google SERP Card */}
              <div
                className={`p-4 rounded-xl bg-white text-neutral-900 border border-neutral-200 shadow-inner ${
                  serpDevice === 'mobile' ? 'max-w-[360px] mx-auto' : 'w-full'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-red-500 flex items-center justify-center font-serif font-bold text-xs shrink-0">
                    SR
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-neutral-800 truncate">
                      {formState.siteName || 'Shisha Rent Kolkata'}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate">
                      {liveDomainUrl}
                      {activePage.path === '/' ? '' : activePage.path.replace(/\//g, ' › ')}
                    </div>
                  </div>
                </div>
                <div className="text-[#1a0dab] hover:underline text-base sm:text-lg font-medium leading-snug cursor-pointer break-words">
                  {activePage.title.length > 65
                    ? activePage.title.slice(0, 62) + '...'
                    : activePage.title || formState.defaultTitle}
                </div>
                <div className="text-xs sm:text-[13px] text-[#4d5156] leading-relaxed mt-1 break-words">
                  {renderHighlightedDescription(activePage.description, activePage.focusKeyword)}
                </div>
                {/* Rich Snippet Rating Preview */}
                {formState.schemaRatingValue && (
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-neutral-600">
                    <span className="text-amber-500 font-bold">★★★★★</span>
                    <span>
                      Rating: {formState.schemaRatingValue} · {formState.schemaReviewCount || '428'}{' '}
                      reviews · {formState.schemaPriceRange || '₹499 - ₹9999'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Yoast SEO Score Checklist */}
            <div className="p-5 rounded-2xl bg-[#12121a] border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Yoast SEO Readability & Ranking Audit
                </h4>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    analysis.score >= 80
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : analysis.score >= 55
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {analysis.score}% Score
                </span>
              </div>

              <div className="space-y-2.5">
                {analysis.checks.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/90 flex items-start gap-2.5"
                  >
                    {item.status === 'good' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : item.status === 'ok' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-200">{item.label}</div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: GLOBAL SITE TITLE, META TAGS & GOOGLE SEARCH CONSOLE          */}
      {/* ==================================================================== */}
      {subTab === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#12121a] border border-neutral-800 space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-neutral-800 pb-2.5">
              Global Site Identity & Default Meta Tags
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Website Brand / Site Name
                </label>
                <input
                  type="text"
                  value={formState.siteName}
                  onChange={(e) => handleGlobalChange('siteName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Title Separator
                </label>
                <select
                  value={formState.titleSeparator || '|'}
                  onChange={(e) => handleGlobalChange('titleSeparator', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm font-bold"
                >
                  <option value="|">| (Pipe)</option>
                  <option value="-">- (Hyphen)</option>
                  <option value="•">• (Bullet)</option>
                  <option value="»">» (Double Arrow)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Global Default Site Title ({'<title>'} Fallback)
              </label>
              <input
                type="text"
                value={formState.defaultTitle}
                onChange={(e) => handleGlobalChange('defaultTitle', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Global Default Meta Description
              </label>
              <textarea
                rows={3}
                value={formState.defaultDescription}
                onChange={(e) => handleGlobalChange('defaultDescription', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Global Primary Focus Keyword
              </label>
              <input
                type="text"
                value={formState.globalFocusKeyword}
                onChange={(e) => handleGlobalChange('globalFocusKeyword', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Global Site-Wide Keywords (Comma-Separated)
              </label>
              <textarea
                rows={3}
                value={formState.globalKeywords}
                onChange={(e) => handleGlobalChange('globalKeywords', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12121a] border border-neutral-800 space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-neutral-800 pb-2.5">
              Canonical Domain, Indexing & Webmaster Verification
            </h4>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Primary Canonical Domain URL
              </label>
              <input
                type="url"
                value={formState.canonicalDomain}
                onChange={(e) => handleGlobalChange('canonicalDomain', e.target.value)}
                placeholder="https://shisharent.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm font-mono"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Used to generate {'<link rel="canonical">'} and sitemap.xml URLs so Google prevents duplicate content penalties.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
              <div className="text-xs font-bold text-white">Global Search Engine Visibility</div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.robotsIndex !== false}
                  onChange={(e) => handleGlobalChange('robotsIndex', e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-800 text-emerald-500"
                />
                <span className="text-xs text-neutral-200">
                  Allow search engines (Google, Bing, Yahoo) to index this website (`index`)
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.robotsFollow !== false}
                  onChange={(e) => handleGlobalChange('robotsFollow', e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-800 text-emerald-500"
                />
                <span className="text-xs text-neutral-200">
                  Allow search engines to follow internal & outbound links (`follow`)
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Google Search Console Verification Code (`google-site-verification`)
              </label>
              <input
                type="text"
                value={formState.googleSiteVerification || ''}
                onChange={(e) => handleGlobalChange('googleSiteVerification', e.target.value)}
                placeholder="Paste verification token from Google Search Console..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Bing Webmaster Tools Verification Code (`msvalidate.01`)
              </label>
              <input
                type="text"
                value={formState.bingSiteVerification || ''}
                onChange={(e) => handleGlobalChange('bingSiteVerification', e.target.value)}
                placeholder="Optional Bing verification token..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Google Analytics 4 / Tag Manager Measurement ID
              </label>
              <input
                type="text"
                value={formState.googleAnalyticsId || ''}
                onChange={(e) => handleGlobalChange('googleAnalyticsId', e.target.value)}
                placeholder="G-XXXXXXXXXX or GTM-XXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: OPENGRAPH / WHATSAPP / FACEBOOK / TWITTER SOCIAL CARDS        */}
      {/* ==================================================================== */}
      {subTab === 'social' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-5 rounded-2xl bg-[#12121a] border border-neutral-800 space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-neutral-800 pb-2.5">
              OpenGraph (WhatsApp, Facebook, Instagram) & X/Twitter Card Settings
            </h4>

            {/* Page Selector for Social Override */}
            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1">
                Configure Social Card For Page:
              </label>
              <select
                value={selectedPageKey}
                onChange={(e) => setSelectedPageKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm"
              >
                {Object.values(formState.pages || FALLBACK_SEO_CONFIG.pages).map((p) => (
                  <option key={p.pageId} value={p.pageId}>
                    {p.pageLabel} ({p.path})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Social Share Title (`og:title` & `twitter:title`)
              </label>
              <input
                type="text"
                value={activePage.ogTitle || activePage.title}
                onChange={(e) =>
                  handlePageFieldChange(selectedPageKey, 'ogTitle', e.target.value)
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Social Share Description (`og:description` & `twitter:description`)
              </label>
              <textarea
                rows={3}
                value={activePage.ogDescription || activePage.description}
                onChange={(e) =>
                  handlePageFieldChange(selectedPageKey, 'ogDescription', e.target.value)
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm"
              />
            </div>

            {/* Social Banner Image Upload */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <label className="block text-xs font-bold text-neutral-200">
                Social Share Banner Image (`og:image` — 1200×630px recommended)
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={activePage.ogImage || formState.defaultOgImage}
                  onChange={(e) =>
                    handlePageFieldChange(selectedPageKey, 'ogImage', e.target.value)
                  }
                  placeholder="Paste image URL or upload banner..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono"
                />
                <label className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  {isUploadingOg ? 'Uploading...' : 'Upload Banner'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUploadOgImageFile(f, 'page');
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Twitter Card Style
                </label>
                <select
                  value={formState.twitterCard}
                  onChange={(e) =>
                    handleGlobalChange(
                      'twitterCard',
                      e.target.value as 'summary_large_image' | 'summary'
                    )
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                >
                  <option value="summary_large_image">Large Banner Image (summary_large_image)</option>
                  <option value="summary">Compact Square Card (summary)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Brand Social Handle
                </label>
                <input
                  type="text"
                  value={formState.twitterHandle || ''}
                  onChange={(e) => handleGlobalChange('twitterHandle', e.target.value)}
                  placeholder="@shisharentkolkata"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Live WhatsApp / Facebook Card Preview */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#12121a] border border-neutral-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live WhatsApp / Facebook Link Share Preview
            </h4>

            <div className="rounded-2xl overflow-hidden border border-neutral-700 bg-[#1c1f26] shadow-xl">
              <div className="aspect-[16/9] w-full bg-neutral-900 overflow-hidden relative">
                <img
                  src={
                    activePage.ogImage ||
                    formState.defaultOgImage ||
                    '/src/assets/images/hero_luxury_hookah_1791648599431.jpg'
                  }
                  alt="Social Share Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] text-white font-mono">
                  1200 × 630 OG
                </span>
              </div>
              <div className="p-4 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                  {liveDomainUrl.replace(/^https?:\/\//, '')}
                </div>
                <div className="text-sm font-bold text-white line-clamp-2">
                  {activePage.ogTitle || activePage.title}
                </div>
                <div className="text-xs text-neutral-400 line-clamp-2">
                  {activePage.ogDescription || activePage.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: LOCALBUSINESS SCHEMA.ORG (JSON-LD) STRUCTURED DATA            */}
      {/* ==================================================================== */}
      {subTab === 'schema' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-5 rounded-2xl bg-[#12121a] border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Schema.org LocalBusiness Structured Data (Google Rich Results)
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Powers Google Knowledge Graph, Local Pack Maps ranking in Kolkata, and star rating snippets.
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Schema `@type`
                </label>
                <select
                  value={formState.schemaBusinessType || 'LocalBusiness'}
                  onChange={(e) => handleGlobalChange('schemaBusinessType', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                >
                  <option value="LocalBusiness">LocalBusiness</option>
                  <option value="FoodEstablishment">FoodEstablishment / Catering</option>
                  <option value="EntertainmentBusiness">EntertainmentBusiness</option>
                  <option value="Store">Store / Rental Shop</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Business Legal / Brand Name
                </label>
                <input
                  type="text"
                  value={formState.schemaBusinessName}
                  onChange={(e) => handleGlobalChange('schemaBusinessName', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Telephone
                </label>
                <input
                  type="text"
                  value={formState.schemaTelephone}
                  onChange={(e) => handleGlobalChange('schemaTelephone', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Price Range Symbol
                </label>
                <input
                  type="text"
                  value={formState.schemaPriceRange}
                  onChange={(e) => handleGlobalChange('schemaPriceRange', e.target.value)}
                  placeholder="₹499 - ₹9999"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Opening Hours Specification
                </label>
                <input
                  type="text"
                  value={formState.schemaOpeningHours}
                  onChange={(e) => handleGlobalChange('schemaOpeningHours', e.target.value)}
                  placeholder="Mo-Su 11:00-03:00"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Street Address / Hub
                </label>
                <input
                  type="text"
                  value={formState.schemaStreetAddress}
                  onChange={(e) => handleGlobalChange('schemaStreetAddress', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  City / Locality
                </label>
                <input
                  type="text"
                  value={formState.schemaLocality}
                  onChange={(e) => handleGlobalChange('schemaLocality', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formState.schemaPostalCode}
                  onChange={(e) => handleGlobalChange('schemaPostalCode', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Aggregate Rating Value (1.0 - 5.0)
                </label>
                <input
                  type="text"
                  value={formState.schemaRatingValue}
                  onChange={(e) => handleGlobalChange('schemaRatingValue', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Total Review Count
                </label>
                <input
                  type="text"
                  value={formState.schemaReviewCount}
                  onChange={(e) => handleGlobalChange('schemaReviewCount', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Kolkata Service Areas (`areaServed` Comma-Separated)
              </label>
              <input
                type="text"
                value={formState.schemaAreaServed}
                onChange={(e) => handleGlobalChange('schemaAreaServed', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#12121a] border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Live Generated `application/ld+json` Script
              </h4>
              <span className="text-[10px] text-neutral-400 font-mono">Valid Schema.org</span>
            </div>
            <pre className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-emerald-300 font-mono overflow-x-auto max-h-[380px]">
              {JSON.stringify(previewJsonLd, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: TECHNICAL SEO — SITEMAP.XML & ROBOTS.TXT                      */}
      {/* ==================================================================== */}
      {subTab === 'technical' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#12121a] border border-neutral-800 space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-neutral-800 pb-2.5">
              Dynamic XML Sitemap (`/sitemap.xml`) for Google Search Console
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Your XML sitemap is automatically generated from all indexable pages and served at `/sitemap.xml`. Submit this URL in **Google Search Console → Sitemaps** for rapid indexing.
            </p>

            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-2">
              <code className="text-xs text-emerald-400 font-mono truncate">{liveSitemapUrl}</code>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(liveSitemapUrl);
                    setCopiedSitemap(true);
                    setTimeout(() => setCopiedSitemap(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-white font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedSitemap ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy URL
                    </>
                  )}
                </button>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1"
                >
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-neutral-300">
                Pages Included in XML Sitemap:
              </div>
              <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
                {Object.values(formState.pages || FALLBACK_SEO_CONFIG.pages).map((p) => (
                  <div
                    key={p.pageId}
                    className="px-3.5 py-2.5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white">{p.pageLabel}</span>
                      <span className="text-neutral-500 font-mono ml-2">{p.path}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-neutral-400 font-mono">
                        Priority: {p.priority} · {p.changefreq}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.robotsIndex !== false
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {p.robotsIndex !== false ? 'Indexed' : 'NoIndex'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#12121a] border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <h4 className="text-sm font-bold text-white">
                Robots.txt Crawler Rules Editor (`/robots.txt`)
              </h4>
              <a
                href={liveRobotsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                View live /robots.txt <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Customize crawler permissions for Googlebot, Bingbot, and social crawlers. Your `Sitemap:` link is automatically appended.
            </p>

            <textarea
              rows={7}
              value={formState.customRobotsTxt}
              onChange={(e) => handleGlobalChange('customRobotsTxt', e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-emerald-300 text-xs font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: BULK SEO EDITOR (ALL PAGES TABLE VIEW)                         */}
      {/* ==================================================================== */}
      {subTab === 'bulk_editor' && (() => {
        const allPagesList = Object.values(formState.pages || FALLBACK_SEO_CONFIG.pages);
        const analyzedRows = allPagesList.map((page) => {
          const yoast = computeYoastAnalysis(page);
          const dirty = isPageRowDirty(page.pageId);
          return {
            page,
            score: yoast.score,
            checks: yoast.checks,
            dirty,
          };
        });

        const avgSiteScore =
          analyzedRows.length > 0
            ? Math.round(
                analyzedRows.reduce((sum, r) => sum + r.score, 0) / analyzedRows.length
              )
            : 0;
        const goodCount = analyzedRows.filter((r) => r.score >= 80).length;
        const needsWorkCount = analyzedRows.filter((r) => r.score < 80).length;
        const noindexCount = analyzedRows.filter((r) => r.page.robotsIndex === false).length;
        const dirtyCount = analyzedRows.filter((r) => r.dirty).length;

        const query = bulkSearchQuery.trim().toLowerCase();
        const filteredRows = analyzedRows.filter(({ page, score }) => {
          if (bulkStatusFilter === 'good' && score < 80) return false;
          if (bulkStatusFilter === 'needs_work' && score >= 80) return false;
          if (bulkStatusFilter === 'noindex' && page.robotsIndex !== false) return false;

          if (!query) return true;
          return (
            (page.pageLabel || '').toLowerCase().includes(query) ||
            (page.pageId || '').toLowerCase().includes(query) ||
            (page.path || '').toLowerCase().includes(query) ||
            (page.title || '').toLowerCase().includes(query) ||
            (page.description || '').toLowerCase().includes(query) ||
            (page.focusKeyword || '').toLowerCase().includes(query)
          );
        });

        return (
          <div className="space-y-5">
            {/* Summary Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-[#12121a] border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">Site-Wide Avg Score</span>
                  <span className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5 block">
                    {avgSiteScore}
                    <span className="text-xs text-neutral-500 font-normal"> / 100</span>
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    avgSiteScore >= 80
                      ? 'text-emerald-400'
                      : avgSiteScore >= 55
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {avgSiteScore >= 80 ? 'Optimal' : avgSiteScore >= 55 ? 'Fair' : 'Critical'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#12121a] border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">Good SEO (80+)</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-0.5 block">
                    {goodCount}
                    <span className="text-xs text-neutral-500 font-normal">
                      {' '}
                      / {analyzedRows.length} pages
                    </span>
                  </span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400/80 shrink-0" />
              </div>

              <div className="p-4 rounded-xl bg-[#12121a] border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">Needs Work (&lt;80)</span>
                  <span className="text-2xl font-bold text-amber-400 font-mono tabular-nums mt-0.5 block">
                    {needsWorkCount}
                    <span className="text-xs text-neutral-500 font-normal"> pages</span>
                  </span>
                </div>
                <AlertTriangle className="w-5 h-5 text-amber-400/80 shrink-0" />
              </div>

              <div className="p-4 rounded-xl bg-[#12121a] border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">Search Indexed</span>
                  <span className="text-2xl font-bold text-white font-mono tabular-nums mt-0.5 block">
                    {analyzedRows.length - noindexCount}
                    <span className="text-xs text-neutral-500 font-normal">
                      {' '}
                      · {noindexCount} Noindex
                    </span>
                  </span>
                </div>
                <Globe className="w-5 h-5 text-neutral-400 shrink-0" />
              </div>
            </div>

            {/* Filter, Search & Unsaved Changes Toolbar */}
            <div className="p-4 rounded-xl bg-[#12121a] border border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={bulkSearchQuery}
                    onChange={(e) => setBulkSearchQuery(e.target.value)}
                    placeholder="Filter by page name, URL path, title, description, or keyword..."
                    className="w-full pl-9 pr-8 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                  {bulkSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setBulkSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Segmented Status Filter Controls */}
                <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-neutral-900 border border-neutral-800">
                  {[
                    { id: 'all' as BulkStatusFilter, label: `All (${analyzedRows.length})` },
                    { id: 'good' as BulkStatusFilter, label: `Good 80+ (${goodCount})` },
                    { id: 'needs_work' as BulkStatusFilter, label: `Needs Work (${needsWorkCount})` },
                    { id: 'noindex' as BulkStatusFilter, label: `Noindex (${noindexCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setBulkStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 font-mono tabular-nums ${
                        bulkStatusFilter === tab.id
                          ? 'bg-emerald-500 text-neutral-950'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Unsaved Changes & Bulk Save Actions */}
              <div className="flex items-center gap-2.5 shrink-0">
                {dirtyCount > 0 && (
                  <>
                    <span className="text-xs text-amber-300 font-mono tabular-nums">
                      {dirtyCount} {dirtyCount === 1 ? 'page' : 'pages'} modified
                    </span>
                    <button
                      type="button"
                      onClick={handleResetAllBulkChanges}
                      className="px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Discard Edits
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleSaveAllSeo()}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Save All Page SEO
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bulk SEO Spreadsheet Table */}
            <div className="rounded-xl bg-[#12121a] border border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1060px]">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950/70 text-[11px] font-semibold text-neutral-400">
                      <th className="py-3 px-4 w-[170px]">Page &amp; Route</th>
                      <th className="py-3 px-3 w-[185px]">Focus Keyphrase</th>
                      <th className="py-3 px-3 w-[270px]">SEO Title ({'<title>'})</th>
                      <th className="py-3 px-3 min-w-[290px]">Meta Description</th>
                      <th className="py-3 px-3 w-[95px] text-center">Indexing</th>
                      <th className="py-3 px-3 w-[145px]">SEO Score</th>
                      <th className="py-3 px-4 w-[125px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 text-xs">
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 px-6 text-center">
                          <p className="text-sm font-semibold text-neutral-300">
                            No pages match your current filter or search query.
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            Try clearing the search input or switching the status filter back to All Pages.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setBulkSearchQuery('');
                              setBulkStatusFilter('all');
                            }}
                            className="mt-3 px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors cursor-pointer"
                          >
                            Reset Filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map(({ page, score, checks, dirty }) => {
                        const titleLen = (page.title || '').length;
                        const descLen = (page.description || '').length;
                        const focusKw = (page.focusKeyword || '').trim().toLowerCase();
                        const kwInTitle =
                          focusKw.length >= 2 &&
                          (page.title || '').toLowerCase().includes(focusKw);
                        const kwInDesc =
                          focusKw.length >= 2 &&
                          (page.description || '').toLowerCase().includes(focusKw);

                        const titleLenStatus =
                          titleLen >= 45 && titleLen <= 65
                            ? 'good'
                            : titleLen >= 30 && titleLen <= 75
                            ? 'ok'
                            : 'bad';
                        const descLenStatus =
                          descLen >= 120 && descLen <= 165
                            ? 'good'
                            : descLen >= 80 && descLen <= 190
                            ? 'ok'
                            : 'bad';

                        const topIssue =
                          checks.find((c) => c.status === 'bad') ||
                          checks.find((c) => c.status === 'ok') ||
                          checks[0];

                        return (
                          <tr
                            key={page.pageId}
                            className={`align-top transition-colors ${
                              dirty
                                ? 'bg-emerald-950/15 hover:bg-emerald-950/25'
                                : 'hover:bg-neutral-900/50'
                            }`}
                          >
                            {/* 1. Page Label & Route Path */}
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white leading-snug">
                                {page.pageLabel}
                              </div>
                              <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                                {page.path}
                              </div>
                              <div className="text-[11px] text-neutral-500 mt-1 font-mono tabular-nums">
                                Priority {page.priority} · {page.changefreq}
                              </div>
                              {dirty && (
                                <div className="text-[11px] text-amber-300 font-medium mt-1">
                                  Unsaved edits
                                </div>
                              )}
                            </td>

                            {/* 2. Focus Keyphrase */}
                            <td className="py-3.5 px-3">
                              <input
                                type="text"
                                value={page.focusKeyword || ''}
                                onChange={(e) =>
                                  handlePageFieldChange(
                                    page.pageId,
                                    'focusKeyword',
                                    e.target.value
                                  )
                                }
                                placeholder="e.g. Hookah Rental Kolkata"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                              />
                              <div className="mt-1.5 text-[11px] text-neutral-400 flex items-center gap-1.5">
                                {focusKw.length < 2 ? (
                                  <span className="text-red-400">No keyphrase set</span>
                                ) : (
                                  <>
                                    <span
                                      className={
                                        kwInTitle ? 'text-emerald-400' : 'text-amber-400'
                                      }
                                    >
                                      {kwInTitle ? 'In Title ✓' : 'Missing in Title'}
                                    </span>
                                    <span aria-hidden="true">·</span>
                                    <span
                                      className={
                                        kwInDesc ? 'text-emerald-400' : 'text-amber-400'
                                      }
                                    >
                                      {kwInDesc ? 'In Desc ✓' : 'Missing in Desc'}
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>

                            {/* 3. SEO Title + Character Counter & Progress Bar */}
                            <td className="py-3.5 px-3">
                              <textarea
                                rows={2}
                                value={page.title || ''}
                                onChange={(e) =>
                                  handlePageFieldChange(page.pageId, 'title', e.target.value)
                                }
                                placeholder="Enter page SEO title (50-60 chars)..."
                                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-emerald-500 focus:outline-none resize-y leading-relaxed"
                              />
                              <div className="mt-1.5 space-y-1">
                                <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                                  <span
                                    className={
                                      titleLenStatus === 'good'
                                        ? 'text-emerald-400'
                                        : titleLenStatus === 'ok'
                                        ? 'text-amber-400'
                                        : 'text-red-400'
                                    }
                                  >
                                    {titleLen} / 60 chars
                                  </span>
                                  <span className="text-neutral-500">
                                    {titleLen >= 45 && titleLen <= 65
                                      ? 'Optimal'
                                      : titleLen < 45
                                      ? 'Short'
                                      : 'Long'}
                                  </span>
                                </div>
                                <div className="w-full h-1 rounded-full bg-neutral-800 overflow-hidden">
                                  <div
                                    className={`h-full transition-opacity ${
                                      titleLenStatus === 'good'
                                        ? 'bg-emerald-500'
                                        : titleLenStatus === 'ok'
                                        ? 'bg-amber-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{
                                      width: `${Math.min(100, Math.round((titleLen / 65) * 100))}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* 4. Meta Description + Character Counter & Progress Bar */}
                            <td className="py-3.5 px-3">
                              <textarea
                                rows={3}
                                value={page.description || ''}
                                onChange={(e) =>
                                  handlePageFieldChange(
                                    page.pageId,
                                    'description',
                                    e.target.value
                                  )
                                }
                                placeholder="Write compelling 120-160 character meta description..."
                                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-emerald-500 focus:outline-none resize-y leading-relaxed"
                              />
                              <div className="mt-1.5 space-y-1">
                                <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                                  <span
                                    className={
                                      descLenStatus === 'good'
                                        ? 'text-emerald-400'
                                        : descLenStatus === 'ok'
                                        ? 'text-amber-400'
                                        : 'text-red-400'
                                    }
                                  >
                                    {descLen} / 160 chars
                                  </span>
                                  <span className="text-neutral-500">
                                    {descLen >= 120 && descLen <= 165
                                      ? 'Optimal'
                                      : descLen < 120
                                      ? 'Short'
                                      : 'Long'}
                                  </span>
                                </div>
                                <div className="w-full h-1 rounded-full bg-neutral-800 overflow-hidden">
                                  <div
                                    className={`h-full transition-opacity ${
                                      descLenStatus === 'good'
                                        ? 'bg-emerald-500'
                                        : descLenStatus === 'ok'
                                        ? 'bg-amber-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{
                                      width: `${Math.min(100, Math.round((descLen / 165) * 100))}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* 5. Robots Index Toggle */}
                            <td className="py-3.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  handlePageFieldChange(
                                    page.pageId,
                                    'robotsIndex',
                                    page.robotsIndex === false ? true : false
                                  )
                                }
                                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                                  page.robotsIndex !== false
                                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                                    : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
                                }`}
                              >
                                {page.robotsIndex !== false ? 'Index' : 'Noindex'}
                              </button>
                            </td>

                            {/* 6. Live Yoast SEO Score + Diagnostic */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm font-bold font-mono tabular-nums ${
                                    score >= 80
                                      ? 'text-emerald-400'
                                      : score >= 55
                                      ? 'text-amber-400'
                                      : 'text-red-400'
                                  }`}
                                >
                                  {score}/100
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                  · {score >= 80 ? 'Good' : score >= 55 ? 'OK' : 'Needs Work'}
                                </span>
                              </div>
                              {topIssue && (
                                <p className="text-[11px] text-neutral-400 mt-1 leading-snug line-clamp-2">
                                  {topIssue.label}
                                </p>
                              )}
                            </td>

                            {/* 7. Quick Row Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex flex-col items-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenInSerpEditor(page.pageId)}
                                  className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                                >
                                  SERP Editor
                                  <ArrowUpRight className="w-3 h-3" />
                                </button>
                                {dirty && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetPageRow(page.pageId)}
                                    className="px-2 py-1 rounded text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    Reset Row
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
