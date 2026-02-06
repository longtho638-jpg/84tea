"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FilterChips } from "@/components/ui/chips";
import { Typography } from "@/components/ui/typography";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilter } from "@/components/products/product-filter";
import { Product, CATEGORIES } from "@/lib/data/products";

interface ProductListingProps {
  initialProducts: Product[];
}

export function ProductListing({ initialProducts }: ProductListingProps) {
  const t = useTranslations("Products");
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [activeType, setActiveType] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter Options with Translations
  const categoryOptions = useMemo(() => {
    return CATEGORIES.map((category) => ({
      value: category.id,
      label: t(`Filter.Category.${category.id}`),
    }));
  }, [t]);

  const handleChipSelect = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    if (categoryId !== "tea" && categoryId !== "all") {
      setActiveType(null);
    }
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Filter by Category
      if (activeCategoryId !== "all" && product.category !== activeCategoryId) {
        return false;
      }

      // 2. Filter by Type (only for tea category)
      if (activeType && product.type !== activeType) {
        return false;
      }

      // 3. Filter by Price
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // 4. Sort
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "featured") return (Number(b.featured) - Number(a.featured));
      return 0;
    });
  }, [activeCategoryId, activeType, priceRange, sortBy, initialProducts]);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategoryId]);

  return (
    <>
      {/* MD3 Filter Chips */}
      <div className="container mx-auto px-6 mt-8">
        <FilterChips
          options={categoryOptions}
          selected={activeCategoryId}
          onSelect={handleChipSelect}
        />
      </div>

      <div className="container mx-auto px-6 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filter - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <ProductFilter
              activeCategory={activeCategoryId}
              activeType={activeType}
              priceRange={priceRange}
              onCategoryChange={setActiveCategoryId}
              onTypeChange={setActiveType}
              onPriceChange={setPriceRange}
              onClear={() => {
                setActiveCategoryId("all");
                setActiveType(null);
                setPriceRange([0, 10000000]);
              }}
            />
          </aside>

          {/* Mobile Filter Trigger */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <Button
              variant="outlined"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center gap-2"
            >
              <span className="material-symbols-rounded">filter_list</span>
              {t("Filter.title")} ({activeCategoryId !== 'all' ? 1 : 0})
            </Button>

            <select
              className="px-4 py-2 rounded-lg border border-outline-variant bg-surface text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">{t("Sort.featured")}</option>
              <option value="price-asc">{t("Sort.priceAsc")}</option>
              <option value="price-desc">{t("Sort.priceDesc")}</option>
              <option value="name">{t("Sort.nameAsc")}</option>
            </select>
          </div>

          {/* Mobile Filter Drawer (Simple implementation) */}
          {isMobileFilterOpen && (
            <div className="lg:hidden mb-8 border-b border-outline-variant pb-8 animate-in fade-in slide-in-from-top-4">
              <ProductFilter
                activeCategory={activeCategoryId}
                activeType={activeType}
                priceRange={priceRange}
                onCategoryChange={setActiveCategoryId}
                onTypeChange={setActiveType}
                onPriceChange={setPriceRange}
                onClear={() => {
                  setActiveCategoryId("all");
                  setActiveType(null);
                  setPriceRange([0, 10000000]);
                }}
              />
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b border-outline-variant">
              <Typography variant="body-medium" className="text-on-surface-variant">
                {t("showing")} <span className="font-bold text-on-surface">{filteredProducts.length}</span> {t("productsCount")}
              </Typography>

              <div className="flex items-center gap-3">
                <label className="text-sm text-on-surface-variant">{t("Sort.sortBy")}</label>
                <select
                  className="px-4 py-2 rounded-lg border border-outline-variant bg-surface text-sm focus:border-primary outline-none cursor-pointer hover:border-primary transition-colors"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">{t("Sort.featured")}</option>
                  <option value="price-asc">{t("Sort.priceAsc")}</option>
                  <option value="price-desc">{t("Sort.priceDesc")}</option>
                  <option value="name">{t("Sort.nameAsc")}</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-surface-container rounded-2xl border border-dashed border-outline-variant">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                  🤔
                </div>
                <Typography variant="title-large" className="mb-2">
                  {t("Empty.title")}
                </Typography>
                <Typography variant="body-medium" className="text-on-surface-variant mb-6">
                  {t("Empty.description")}
                </Typography>
                <Button
                  variant="filled"
                  onClick={() => {
                    setActiveCategoryId("all");
                    setActiveType(null);
                    setPriceRange([0, 10000000]);
                  }}
                >
                  {t("Empty.clearFilter")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
