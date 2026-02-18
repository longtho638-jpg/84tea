---
title: "CTO HANDOVER PROTOCOL - 84tea"
description: "Quy trình dọn dẹp, fix lỗi và verify dự án 84tea trước khi bàn giao."
status: pending
priority: P1
effort: 8h
branch: master
tags: [handover, quality, green-production]
created: 2026-02-14
---

# CTO HANDOVER PROTOCOL - 84tea

## Mục tiêu
Đưa dự án 84tea về trạng thái **GREEN PRODUCTION**:
- 0 lỗi TypeScript (Strict mode).
- 0 lỗi/cảnh báo Lint.
- Build thành công 100% với cấu hình nghiêm ngặt.
- Verify toàn bộ luồng API quan trọng.

## Các giai đoạn thực hiện

### Phase 1: Environment & Dependency Audit
- [ ] Clean install dependencies.
- [ ] Kiểm tra và loại bỏ package thừa.
- [ ] Cập nhật scripts trong package.json nếu cần.

### Phase 2: TypeScript Deep Fix
- [ ] Chạy `npx tsc --noEmit` và ghi nhận lỗi.
- [ ] Fix lỗi Type liên quan đến Supabase v2.95.
- [ ] Xử lý các lỗi ép kiểu (casting) và `any`.
- [ ] Bật kiểm tra TS trong `next.config.ts`.

### Phase 3: Lint & Code Quality
- [ ] Xử lý triệt để `npm run lint`.
- [ ] Dọn dẹp console.log và code thừa.
- [ ] Kiểm tra security headers.

### Phase 4: API & Routing Verification
- [ ] Test API endpoints.
- [ ] Verify i18n keys sync.
- [ ] Kiểm tra PWA & SEO metadata.

### Phase 5: Production Build & Final Report
- [ ] Chạy build cuối cùng.
- [ ] Xuất báo cáo bàn giao.

## Success Criteria
- `npm run build` PASS.
- `npx tsc --noEmit` 0 lỗi.
- `npm run lint` 0 cảnh báo.
- Production URL trả về HTTP 200.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
