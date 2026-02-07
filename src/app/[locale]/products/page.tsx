import { getTranslations } from "next-intl/server";
import { Typography } from "@/components/ui/typography";
import { MainLayout, FooterSection } from "@/components/layout";
import { ProductListing } from "@/components/products/product-listing";
import { getProducts } from "@/lib/data/server-products";

export default async function ProductsPage() {
  const products = await getProducts();
  const t = await getTranslations("Products");

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <MainLayout>
        {/* Header */}
        <div className="bg-surface-container-low py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/pattern-1.svg')] opacity-[0.03]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Typography variant="label-large" className="text-secondary uppercase tracking-widest mb-4">
            {t("label")}
          </Typography>
          <Typography variant="display-medium" className="font-display text-primary mb-6">
            {t("headline")}
          </Typography>
          <Typography variant="body-large" className="max-w-2xl mx-auto text-on-surface-variant">
            {t("description")}
          </Typography>
        </div>
      </div>

      <ProductListing initialProducts={products || []} />

      <FooterSection />
      </MainLayout>
    </div>
  );
}
