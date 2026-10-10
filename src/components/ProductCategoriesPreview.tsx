import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { PRODUCT_CATEGORIES, ProductCategory } from '../data/productsData';

interface ProductCategoriesPreviewProps {
  onSelectCategory: (categoryId: ProductCategory['id']) => void;
  onViewAllProducts: () => void;
}

export const ProductCategoriesPreview: React.FC<ProductCategoriesPreviewProps> = ({
  onSelectCategory,
  onViewAllProducts,
}) => {
  return (
    <section id="categories-preview" className="py-14 sm:py-20 bg-[#070709] border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Callout - Exactly matching poster */}
          <div className="lg:col-span-4 space-y-4 text-left lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2">
              <span className="h-[2px] w-6 bg-red-600"></span>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-red-500">
                EXPLORE OUR
              </p>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-heading">
              HOOKAH, FLAVOURS &{' '}
              <span className="text-red-600">ACCESSORIES</span>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Premium brands, wide variety and everything you need for the perfect hookah experience.
            </p>

            <div className="pt-2">
              <button
                onClick={onViewAllProducts}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-semibold shadow-lg shadow-red-900/40 hover:shadow-red-600/40 transition-all cursor-pointer group"
              >
                <span>View All Products</span>
                <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: 6 Category Cards matching the screenshot */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
              {PRODUCT_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="group relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950/70 hover:border-red-600/70 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-red-950/30 flex flex-col"
                >
                  {/* Category Image with dark gradient overlay */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-90" />

                    {/* Bottom Title & Subtitle Badge */}
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors font-heading">
                        {cat.title}
                      </h3>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[11px] text-neutral-300 font-medium">
                          {cat.subtitle}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-red-600/20 group-hover:bg-red-600 text-neutral-300 group-hover:text-white flex items-center justify-center transition-colors">
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
