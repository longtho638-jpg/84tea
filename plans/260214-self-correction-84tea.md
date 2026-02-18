# Kế hoạch Tự sửa lỗi hệ thống cho 84tea

## Bối cảnh

Dựa trên các báo cáo `security-perf-audit-260211-1603-deep-audit.md` và `health-check-260211-1545-full-codebase-audit.md`, dự án 84tea có một số vấn đề bảo mật và chất lượng mã nguồn cần được khắc phục khẩn cấp. Nhiệm vụ này tập trung vào các vấn đề **CRITICAL** và **HIGH** với giới hạn TỐI ĐA 5 file được sửa đổi.

## Các vấn đề cần khắc phục và File ảnh hưởng

1.  **Orders GET endpoint thiếu auth**
    *   **Mức độ:** CRITICAL
    *   **File ảnh hưởng:** `src/app/api/orders/route.ts`
    *   **Mô tả:** Bất kỳ ai có `orderId` hoặc `orderCode` đều có thể xem chi tiết đơn hàng, bypass RLS.
2.  **`contact_messages` table thiếu RLS migration**
    *   **Mức độ:** CRITICAL
    *   **File ảnh hưởng:** Cần tạo file migration SQL mới (ví dụ: `20260214-add-rls-contact-messages.sql`)
    *   **Mô tả:** Bảng `contact_messages` không có RLS, cho phép truy cập trái phép.
3.  **Thống nhất admin check pattern**
    *   **Mức độ:** CRITICAL
    *   **File ảnh hưởng:** Các file migration SQL hiện có (`20260206120000_apply_rls.sql`, `20260206_rls_policies.sql`, `20260207_create_products_table.sql`, `20260208_orders.sql`) và `src/app/api/products/route.ts`
    *   **Mô tả:** Có 3 cách kiểm tra admin khác nhau, gây ra sự không nhất quán và rủi ro bảo mật.
4.  **Service Role Key fallback sang Anon Key**
    *   **Mức độ:** HIGH
    *   **File ảnh hưởng:** `src/app/api/contact/route.ts`, `src/app/api/franchise/apply/route.ts`, `src/app/api/orders/route.ts`, `src/app/api/payment/webhook/route.ts` (sẽ ưu tiên sửa trong `orders/route.ts` trước).
    *   **Mô tả:** Fallback sang `NEXT_PUBLIC_SUPABASE_ANON_KEY` thay vì throw error khi `SUPABASE_SERVICE_ROLE_KEY` không tồn tại.
5.  **`generateNumericOrderCode()` có thể bị đoán**
    *   **Mức độ:** HIGH
    *   **File ảnh hưởng:** `src/app/api/orders/route.ts`
    *   **Mô tả:** `orderCode` được tạo ra không đủ ngẫu nhiên, dễ bị brute-force.

## Các file sẽ được chỉnh sửa (Tối đa 5 file)

1.  `src/app/api/orders/route.ts` (Sửa 3 vấn đề: auth, fallback key, orderCode)
2.  `supabase/migrations/20260214-add-rls-contact-messages.sql` (Tạo mới)
3.  `supabase/migrations/20260206120000_apply_rls.sql` (Thống nhất admin check)
4.  `supabase/migrations/20260206_rls_policies.sql` (Thống nhất admin check)
5.  `supabase/migrations/20260207_create_products_table.sql` (Thống nhất admin check)

## Các bước triển khai

### Giai đoạn 1: Khắc phục vấn đề `Orders GET endpoint thiếu auth` và `generateNumericOrderCode()` trong `src/app/api/orders/route.ts`

*   **Bước 1.1:** Mở file `src/app/api/orders/route.ts`.
*   **Bước 1.2:** Sửa logic của GET endpoint để yêu cầu xác thực người dùng. Chỉ cho phép người dùng xem các đơn hàng của chính họ bằng cách lọc theo `auth.uid()`. Nếu yêu cầu không xác thực, trả về lỗi 401 hoặc chỉ cho phép lấy thông tin đơn hàng tối thiểu không chứa dữ liệu nhạy cảm.
*   **Bước 1.3:** Thay thế `Math.random()` trong hàm `generateNumericOrderCode()` bằng `crypto.randomInt()` để tạo `orderCode` an toàn hơn.
*   **Bước 1.4:** Cập nhật logic khởi tạo Supabase client để throw error nếu `SUPABASE_SERVICE_ROLE_KEY` không được đặt, thay vì fallback sang `ANON_KEY`.

### Giai đoạn 2: Tạo migration cho RLS trên bảng `contact_messages`

*   **Bước 2.1:** Tạo file migration SQL mới: `supabase/migrations/20260214-add-rls-contact-messages.sql`.
*   **Bước 2.2:** Viết SQL để enable RLS và tạo các policy cần thiết. Ví dụ: chỉ cho phép `service_role` hoặc `admin` đọc, và cho phép user chèn tin nhắn.

### Giai đoạn 3: Thống nhất admin check pattern trong các migrations SQL

*   **Bước 3.1:** Mở các file migration SQL đã liệt kê (`20260206120000_apply_rls.sql`, `20260206_rls_policies.sql`, `20260207_create_products_table.sql`, `20260208_orders.sql`).
*   **Bước 3.2:** Chuẩn hóa tất cả các chính sách RLS sử dụng kiểm tra admin thành một pattern duy nhất, ví dụ: `auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')`.
*   **Bước 3.3:** Đảm bảo `src/app/api/products/route.ts` cũng sử dụng cùng một pattern kiểm tra admin khi tương tác với Supabase.

## Todo List

- [ ] Cập nhật `src/app/api/orders/route.ts` để thêm auth cho GET endpoint.
- [ ] Cập nhật `src/app/api/orders/route.ts` để sử dụng `crypto.randomInt()` cho `orderCode`.
- [ ] Cập nhật `src/app/api/orders/route.ts` để throw error khi `SUPABASE_SERVICE_ROLE_KEY` thiếu.
- [ ] Tạo file `supabase/migrations/20260214-add-rls-contact-messages.sql` và thêm RLS policies.
- [ ] Chỉnh sửa các file migration SQL (`20260206120000_apply_rls.sql`, `20260206_rls_policies.sql`, `20260207_create_products_table.sql`, `20260208_orders.sql`) để thống nhất admin check pattern.
- [ ] Chỉnh sửa `src/app/api/products/route.ts` để thống nhất admin check pattern.

## Tiêu chí thành công

*   Endpoints GET `/api/orders` chỉ trả về dữ liệu đơn hàng cho người dùng đã xác thực và là chủ sở hữu của đơn hàng đó.
*   `orderCode` không thể đoán được.
*   Thiếu `SUPABASE_SERVICE_ROLE_KEY` sẽ gây ra lỗi runtime thay vì fallback.
*   Bảng `contact_messages` có RLS được kích hoạt và các policy bảo mật phù hợp.
*   Tất cả các kiểm tra admin trong RLS policies và code API đều sử dụng cùng một pattern thống nhất.
*   Không có hơn 5 file được chỉnh sửa trong nhiệm vụ này.

## Đánh giá rủi ro và cân nhắc bảo mật

*   **Rủi ro:** Thay đổi RLS policies có thể ảnh hưởng đến các API routes khác hoặc chức năng hiện có nếu không được kiểm tra kỹ lưỡng.
*   **Giảm thiểu:** Kiểm tra kỹ lưỡng tất cả các API routes liên quan đến `orders`, `products`, và `profiles` sau khi áp dụng các thay đổi. Đảm bảo rằng hành vi hiện có vẫn đúng với người dùng thường và admin.
*   **Cân nhắc bảo mật:** Việc thống nhất admin check pattern là rất quan trọng để đảm bảo tính nhất quán và giảm thiểu các lỗ hổng tiềm ẩn do logic phân quyền không rõ ràng. Việc tăng cường `orderCode` cũng giúp ngăn chặn các cuộc tấn công brute-force.
