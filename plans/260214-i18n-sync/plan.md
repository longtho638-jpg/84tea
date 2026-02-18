---
title: "Đồng bộ hóa i18n cho 84tea"
description: "Kế hoạch triển khai đồng bộ i18n cho ứng dụng 84tea."
status: pending
priority: P2
effort: 2h
branch: master
tags: [i18n, localization, 84tea]
created: 2026-02-14
---

# Kế hoạch đồng bộ hóa i18n cho 84tea

## Tổng quan

Kế hoạch này nhằm mục đích đồng bộ hóa các tệp dịch thuật `en.json` và `vi.json` trong ứng dụng 84tea, đảm bảo tính nhất quán của các khóa (keys) dịch thuật trên toàn bộ ứng dụng.

## Mục tiêu

-   Phân tích và xác định các khóa dịch thuật bị thiếu hoặc không nhất quán giữa `en.json` và `vi.json`.
-   Cập nhật các tệp `en.json` và `vi.json` để đảm bảo tất cả các khóa đều có mặt và đồng bộ.
-   Xác minh tính nhất quán của các tệp dịch thuật sau khi cập nhật.
-   Chạy quá trình build để đảm bảo không có lỗi cú pháp JSON và ứng dụng hoạt động bình thường.

## Các tệp liên quan

-   `/Users/macbookprom1/mekong-cli/apps/84tea/messages/en.json`
-   `/Users/macbookprom1/mekong-cli/apps/84tea/messages/vi.json`

## Các bước triển khai

### Phase 1: Phân tích các khóa dịch thuật (0.5h)

1.  **Đọc nội dung tệp**: Đọc nội dung của cả `en.json` và `vi.json`.
2.  **So sánh khóa**: Sử dụng script hoặc thủ công để so sánh tất cả các khóa trong hai tệp.
    -   Xác định các khóa có trong `en.json` nhưng không có trong `vi.json`.
    -   Xác định các khóa có trong `vi.json` nhưng không có trong `en.json`.
    -   Kiểm tra cấu trúc lồng nhau của các khóa để đảm bảo đồng bộ.
3.  **Báo cáo**: Tạo một báo cáo liệt kê các khóa bị thiếu hoặc không nhất quán.

### Phase 2: Cập nhật tệp dịch thuật (1h)

1.  **Thêm khóa thiếu**: Dựa trên báo cáo ở Phase 1, thêm các khóa còn thiếu vào tệp tương ứng.
    -   Đối với các khóa thiếu trong `vi.json` (có trong `en.json`), thêm khóa với giá trị tiếng Việt tương ứng (có thể là bản dịch thô ban đầu nếu cần).
    -   Đối với các khóa thiếu trong `en.json` (có trong `vi.json`), thêm khóa với giá trị tiếng Anh tương ứng.
2.  **Đảm bảo cấu trúc JSON hợp lệ**: Đảm bảo rằng sau khi thêm hoặc sửa đổi, các tệp `json` vẫn có cấu trúc hợp lệ (ví dụ: dấu phẩy, dấu ngoặc nhọn).
3.  **Định dạng**: Định dạng lại các tệp JSON để dễ đọc và duy trì.

### Phase 3: Kiểm tra tính nhất quán và build (0.5h)

1.  **Kiểm tra lại tính nhất quán**: Sau khi cập nhật, lặp lại bước so sánh khóa ở Phase 1 để đảm bảo rằng tất cả các khóa đã được đồng bộ hoàn toàn.
2.  **Chạy build**: Thực hiện lệnh build của ứng dụng để đảm bảo rằng không có lỗi cú pháp JSON nào gây ra lỗi compile.
    -   `npm run build` hoặc tương tự.
3.  **Xác minh tại trình duyệt (tùy chọn)**: Nếu có thể, kiểm tra nhanh trên trình duyệt để đảm bảo các bản dịch hiển thị đúng cách.

## Tiêu chí hoàn thành

-   Tất cả các khóa dịch thuật trong `en.json` và `vi.json` phải khớp nhau.
-   Các tệp `json` phải hợp lệ về mặt cú pháp.
-   Ứng dụng phải build thành công mà không có lỗi liên quan đến i18n.
-   Báo cáo các khóa bị thiếu/không nhất quán được tạo và giải quyết.

## Rủi ro và biện pháp giảm thiểu

-   **Rủi ro**: Lỗi cú pháp JSON sau khi chỉnh sửa thủ công.
    -   **Giảm thiểu**: Sử dụng JSON formatter và validator. Chạy build để kiểm tra lỗi cú pháp.
-   **Rủi ro**: Dịch sai nghĩa hoặc thiếu bản dịch cho các khóa mới.
    -   **Giảm thiểu**: Thêm bình luận cho các khóa cần dịch thuật chính xác hơn. Có thể cần sự tham gia của người bản xứ để duyệt lại bản dịch.

## Bước tiếp theo

Sau khi kế hoạch này được duyệt, tôi sẽ tiến hành thực hiện theo các bước đã đề ra.