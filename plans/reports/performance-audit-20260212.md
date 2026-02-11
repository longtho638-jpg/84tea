# Báo Cáo Tối Ưu Hiệu Năng (Performance Audit Report) - 84tea

**Ngày báo cáo:** 12/02/2026
**Trạng thái:** ✅ Đã hoàn thành
**Kết quả build:** ✅ PASS (Next.js 16)

## 1. Tóm tắt
Đã hoàn thành đợt tối ưu hóa hiệu năng tập trung vào việc giảm kích thước bundle ban đầu (Initial JS Bundle) và cải thiện Core Web Vitals.

## 2. Chi tiết tối ưu hóa

### ⚡ Lazy Loading & Code Splitting
- **Vấn đề:** Trang chủ tải toàn bộ component nặng ngay từ đầu, gây chậm LCP (Largest Contentful Paint) và TBT (Total Blocking Time).
- **Giải pháp:** Sử dụng `next/dynamic` để tải không đồng bộ các component nằm dưới màn hình đầu tiên (below-the-fold) hoặc tương tác nặng.
- **Các file đã sửa:**
  - `src/app/[locale]/page.tsx`:
    - `HeroParallax` (Animation nặng) → Lazy load
    - `StorySectionAnimated` → Lazy load
    - `FeaturedProducts` → Lazy load
  - `src/app/[locale]/layout.tsx`:
    - `CartDrawer` (UI phụ trợ) → Lazy load
    - `MobileStickyBar` → Lazy load
    - `FloatingContact` → Lazy load
  - `src/app/[locale]/franchise/page.tsx`:
    - `FranchiseHero` → Lazy load
- **Kết quả:** Giảm đáng kể dung lượng JS tải ban đầu.

### 📦 Tree Shaking & Config
- **Vấn đề:** Các thư viện UI lớn (`lucide-react`, `framer-motion`) bị bundle toàn bộ hoặc chưa tối ưu.
- **Giải pháp:** Cấu hình `optimizePackageImports` trong `next.config.ts` để Next.js tự động tree-shake hiệu quả hơn.
- **File:** `next.config.ts`
- **Config:**
  ```typescript
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'clsx', 'tailwind-merge'],
  }
  ```

### 🖼️ Image Optimization
- **Kiểm tra:** Đảm bảo sử dụng `next/image` thay vì thẻ `<img>` tiêu chuẩn.
- **Trạng thái:** Hệ thống đã tuân thủ tốt việc sử dụng component Image tối ưu của Next.js.

## 3. Kết luận
Mã nguồn `84tea` đã được tối ưu hóa để đạt điểm Core Web Vitals tốt hơn. Việc tách code (Code Splitting) giúp người dùng nhìn thấy nội dung chính nhanh hơn mà không phải đợi tải các script không cần thiết. Build production thành công và không có lỗi linting.
