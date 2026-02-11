import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { MainLayout, FooterSection } from "@/components/layout";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductActions } from "@/components/products/product-actions";
import { ProductCard } from "@/components/products/product-card";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/data/products-service";
import { generatePageMetadata } from "@/lib/metadata";

interface ProductPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return (products || []).map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const name = typeof product.name === "string"
    ? product.name
    : product.name[locale as "vi" | "en"] || product.name.vi;
  const desc = typeof product.description === "string"
    ? product.description
    : product.description[locale as "vi" | "en"] || product.description.vi;

  return generatePageMetadata({
    title: name,
    description: desc,
    path: `/products/${slug}`,
    locale,
    image: product.image_url || undefined,
    type: "product",
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug);
  const t = await getTranslations("Products.Detail");

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id);

  // Helper for localized fields
  const getName = (name: { vi: string; en: string } | string) => typeof name === 'object' ? (name[locale as 'vi' | 'en'] || name.vi || name.en) : name;
  const getDesc = (desc: { vi: string; en: string } | string) => typeof desc === 'object' ? (desc[locale as 'vi' | 'en'] || desc.vi || desc.en) : desc;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <MainLayout>
        {/* Breadcrumb */}
        <div className="bg-surface-container-low border-b border-outline-variant">
          <div className="container mx-auto px-6 py-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-on-surface-variant">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    {t("Breadcrumb.home")}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <span className="material-symbols-rounded text-base">chevron_right</span>
                </li>
                <li>
                  <Link href="/products" className="hover:text-primary transition-colors">
                    {t("Breadcrumb.products")}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <span className="material-symbols-rounded text-base">chevron_right</span>
                </li>
                <li aria-current="page">
                  <span className="text-on-surface font-medium truncate">{getName(product.name)}</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 mb-24">
            {/* Left: Gallery */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ProductGallery
                mainImage={product.image_url || ''}
                images={product.images || []}
              />
            </div>

            {/* Right: Info */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {/* Type badge logic... simplified for brevity, assume tags/category */}
                  {product.is_featured && (
                     <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {t("Type.featured")}
                    </span>
                  )}
                </div>

                <Typography variant="display-small" className="font-display text-primary mb-2">
                  {getName(product.name)}
                </Typography>

                <div className="flex items-center gap-2 text-on-surface-variant mb-6">
                   {/* Rating placeholder */}
                   <span className="material-symbols-rounded text-secondary fill-1" aria-hidden="true">star</span>
                   <span className="font-bold text-on-surface">5.0</span>
                   <span className="text-outline-variant">|</span>
                   <span>10 {t("Stats.reviews")}</span>
                </div>

                <div className="flex items-baseline gap-4 mb-6">
                  <Typography variant="display-medium" className="text-primary font-bold">
                    {product.price.toLocaleString('vi-VN')}đ
                  </Typography>
                  {product.original_price && (
                    <Typography variant="title-large" className="text-outline line-through">
                      {product.original_price.toLocaleString('vi-VN')}đ
                    </Typography>
                  )}
                </div>

                <Typography variant="body-large" className="text-on-surface-variant leading-relaxed">
                  {getDesc(product.description)}
                </Typography>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2">
                    <span className="material-symbols-rounded text-primary text-lg" aria-hidden="true">eco</span>
                    <span className="text-sm font-semibold text-primary">
                      {t("TrustBadges.organic")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-secondary/10 border border-secondary/20 px-4 py-2">
                    <span className="material-symbols-rounded text-secondary text-lg" aria-hidden="true">landscape</span>
                    <span className="text-sm font-semibold text-secondary">
                      {t("TrustBadges.highland")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-tertiary/10 border border-tertiary/20 px-4 py-2">
                    <span className="material-symbols-rounded text-tertiary text-lg" aria-hidden="true">workspace_premium</span>
                    <span className="text-sm font-semibold text-tertiary">
                      {t("TrustBadges.premium")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-outline-variant" />

              {/* Attributes */}
              <div className="grid grid-cols-2 gap-4">
                {product.weight && (
                <div className="p-4 rounded-xl bg-surface-container border border-outline-variant">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <span className="material-symbols-rounded" aria-hidden="true">scale</span>
                    <span className="font-bold text-sm uppercase">{t("Attributes.weight")}</span>
                  </div>
                  <p className="text-on-surface">{product.weight}</p>
                </div>
                )}

                {product.origin && (
                  <div className="p-4 rounded-xl bg-surface-container border border-outline-variant">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <span className="material-symbols-rounded" aria-hidden="true">landscape</span>
                      <span className="font-bold text-sm uppercase">{t("Attributes.origin")}</span>
                    </div>
                    <p className="text-on-surface">{product.origin}</p>
                  </div>
                )}

                {product.harvest && (
                  <div className="p-4 rounded-xl bg-surface-container border border-outline-variant">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <span className="material-symbols-rounded" aria-hidden="true">calendar_month</span>
                      <span className="font-bold text-sm uppercase">{t("Attributes.harvest")}</span>
                    </div>
                    <p className="text-on-surface">{product.harvest}</p>
                  </div>
                )}

                {product.taste && (
                  <div className="p-4 rounded-xl bg-surface-container border border-outline-variant">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <span className="material-symbols-rounded" aria-hidden="true">local_cafe</span>
                      <span className="font-bold text-sm uppercase">{t("Attributes.taste")}</span>
                    </div>
                    <p className="text-on-surface">{product.taste}</p>
                  </div>
                )}
              </div>

              <div className="h-px bg-outline-variant" />

              {/* Actions */}
              <ProductActions product={{
                  ...product,
                  name: getName(product.name),
              }} />

              {/* Guarantee */}
              <div className="flex items-center gap-6 pt-4 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-rounded text-primary" aria-hidden="true">verified_user</span>
                  {t("Guarantee.authentic")}
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-rounded text-primary" aria-hidden="true">local_shipping</span>
                  {t("Guarantee.freeShipping")}
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-rounded text-primary" aria-hidden="true">assignment_return</span>
                  {t("Guarantee.returnPolicy")}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="border-t border-outline-variant pt-16">
              <div className="flex items-center justify-between mb-8">
                <Typography variant="headline-medium" className="font-display text-primary">
                  {t("Related.title")}
                </Typography>
                <Link href="/products">
                  <Button variant="text" className="text-primary">
                    {t("Related.viewAll")} <span className="material-symbols-rounded ml-1" aria-hidden="true">arrow_forward</span>
                  </Button>
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
        <FooterSection />
      </MainLayout>
    </div>
  );
}
