import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ProductCardGlass } from "@/components/products/product-card-glass";
import { getFeaturedProducts } from "@/lib/data/server-products";

export async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts();
  const t = useTranslations("Featured");

  return (
    <section className="py-24 bg-surface-container-low">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Typography variant="label-large" className="text-secondary tracking-widest uppercase mb-4">
            {t("label")}
          </Typography>
          <Typography variant="headline-large" className="text-on-surface font-display mb-4">
            {t("headline")}
          </Typography>
          <Typography variant="body-large" className="text-on-surface-variant">
            {t("description")}
          </Typography>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCardGlass key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outlined" size="lg" asChild>
            <Link href="/products">{t("viewAll")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
