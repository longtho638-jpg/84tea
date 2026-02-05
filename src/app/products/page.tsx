import { Typography } from "@/components/ui/typography";
import { MainLayout, FooterSection } from "@/components/layout";
import { ProductListing } from "@/components/products/product-listing";
import { getProducts } from "@/lib/data/server-products";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <MainLayout>
        {/* Header */}
        <div className="bg-surface-container-low py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/pattern-1.svg')] opacity-[0.03]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Typography variant="label-large" className="text-secondary uppercase tracking-widest mb-4">
            Cửa hàng trực tuyến
          </Typography>
          <Typography variant="display-medium" className="font-display text-primary mb-6">
            Tinh hoa Trà Việt
          </Typography>
          <Typography variant="body-large" className="max-w-2xl mx-auto text-on-surface-variant">
            Khám phá bộ sưu tập trà cổ thụ và trà cụ cao cấp, được tuyển chọn kỹ lưỡng từ những vùng nguyên liệu trứ danh của Việt Nam.
          </Typography>
        </div>
      </div>

      <ProductListing initialProducts={products || []} />

      <FooterSection />
      </MainLayout>
    </div>
  );
}
