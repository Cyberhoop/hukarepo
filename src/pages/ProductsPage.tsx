import React, { useState } from 'react';
import { ProductsCatalogSection } from '../components/ProductsCatalogSection';
import { ProductItem } from '../data/productsData';
import { useNavigation } from '../context/NavigationContext';
import { ShieldCheck, Truck, ListOrdered, Grid, Flame } from 'lucide-react';
import { ChillumFlavourBookingConfigurator } from '../components/ChillumFlavourBookingConfigurator';
import { MasterCatalogSequenceSection } from '../components/MasterCatalogSequenceSection';

interface ProductsPageProps {
  onOpenBookingModal: () => void;
  onOpenBookingWithConfig?: (config: any) => void;
  onOpenPolicyModal: () => void;
  onOpenProductDetail: (product: ProductItem) => void;
  onRequestItemInBooking: (product: ProductItem) => void;
  selectedBookingItems: ProductItem[];
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onOpenBookingModal,
  onOpenBookingWithConfig,
  onOpenPolicyModal,
  onOpenProductDetail,
  onRequestItemInBooking,
  selectedBookingItems,
}) => {
  const { selectedCategoryFilter, navigateTo } = useNavigation();
  const [activeCatalogTab, setActiveCatalogTab] = useState<'marketplace' | 'sequence_1_to_12' | 'chillum_builder'>('marketplace');

  return (
    <div className="py-6 sm:py-10 space-y-8">
      {/* Top Banner & Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-red-400 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-white font-medium">Marketplace Collection</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-900">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-[2px] w-5 bg-red-600"></span>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500">
                OFFICIAL CATALOGUE & BOOKING
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              Hookahs, Flavours & Accessories
            </h1>
          </div>

          {/* View Mode Tabs: All Marketplace / 1 to 12 Sequenced / Chillum Custom Builder */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveCatalogTab('marketplace')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCatalogTab === 'marketplace'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All Products</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCatalogTab('sequence_1_to_12')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCatalogTab === 'sequence_1_to_12'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>1 to 12 Sequence</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCatalogTab('chillum_builder')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCatalogTab === 'chillum_builder'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Chillum Builder (₹600 / ₹700)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conditional View Rendering based on user tab */}
      {activeCatalogTab === 'chillum_builder' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ChillumFlavourBookingConfigurator
            onOpenBookingWithConfig={(cfg) => {
              if (onOpenBookingWithConfig) {
                onOpenBookingWithConfig(cfg);
              } else {
                onOpenBookingModal();
              }
            }}
          />
        </div>
      )}

      {activeCatalogTab === 'sequence_1_to_12' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MasterCatalogSequenceSection
            onOpenBooking={onOpenBookingModal}
            onOpenProductDetail={onOpenProductDetail}
          />
        </div>
      )}

      {activeCatalogTab === 'marketplace' && (
        <div className="space-y-12">
          {/* Main Marketplace Catalog Grid */}
          <ProductsCatalogSection
            selectedCategoryId={selectedCategoryFilter}
            onSelectCategoryTab={(catId) => navigateTo('products', catId)}
            onRequestItemInBooking={onRequestItemInBooking}
            selectedBookingItems={selectedBookingItems}
            onOpenBookingModal={onOpenBookingModal}
            onOpenPolicyModal={onOpenPolicyModal}
            onOpenProductDetail={onOpenProductDetail}
          />

          {/* Also include the Chillum Flavour Configurator & 1-12 sequence below */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-900">
            <ChillumFlavourBookingConfigurator
              onOpenBookingWithConfig={(cfg) => {
                if (onOpenBookingWithConfig) {
                  onOpenBookingWithConfig(cfg);
                } else {
                  onOpenBookingModal();
                }
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <MasterCatalogSequenceSection
              onOpenBooking={onOpenBookingModal}
              onOpenProductDetail={onOpenProductDetail}
            />
          </div>
        </div>
      )}
    </div>
  );
};
