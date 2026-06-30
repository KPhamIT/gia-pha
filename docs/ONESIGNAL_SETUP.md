# OneSignal Setup — Gia phả

Hướng dẫn cấu hình push notification ngày giỗ cho ứng dụng Gia phả (Next.js + NestJS).

## OneSignal Account Setup

1. Tạo tài khoản tại [OneSignal](https://onesignal.com/).
2. **New App/Website** → chọn **Web Push**.
3. Chọn **Typical Site** (hoặc Custom nếu cần Service Worker tùy chỉnh).
4. **Site URL**
   - Local: `http://localhost:3000`
   - Production: domain thật (vd. `https://gia-pha.example.com`)
5. Bật **Allow localhost as secure origin** khi dev local (hoặc dùng `allowLocalhostAsSecureOrigin` trong SDK — đã bật trong code khi `NODE_ENV=development`).
6. Lưu **App ID** và tạo **REST API Key** tại [Keys & IDs](https://documentation.onesignal.com/docs/keys-and-ids).

### Web Push configuration

- Icon: logo dòng họ (192×192 PNG khuyến nghị).
- Default notification URL: `https://your-domain/ceremonies/upcoming`
- Safari: bật Web Push cho Safari nếu cần (xem tài liệu OneSignal Safari).

## Frontend Environment Variables

File `frontend/.env` (xem `frontend/.env.example`):

```env
NEXT_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-app-id
```

Khởi tạo SDK: `frontend/lib/services/onesignal.service.ts`  
Hook: `frontend/hooks/useOneSignal.ts`

## Backend Environment Variables

File `backend/.env` (xem `backend/.env.example`):

```env
ONESIGNAL_APP_ID=your-onesignal-app-id
ONESIGNAL_REST_API_KEY=your-rest-api-key
FRONTEND_URL=http://localhost:3000
```

`FRONTEND_URL` dùng cho deep link khi click notification.

## Local Development Guide

1. **Service worker file** — `frontend/public/OneSignalSDKWorker.js` phải tồn tại (Next.js serve tại `http://localhost:3000/OneSignalSDKWorker.js`). Mở URL này trên trình duyệt; phải thấy dòng `importScripts(...OneSignalSDK.sw.js)`.

2. Chạy PostgreSQL và migrate:

   ```bash
   cd backend && pnpm db:migrate && pnpm db:seed
   ```

3. Thêm biến môi trường OneSignal (frontend + backend).

4. Chạy backend và frontend:

   ```bash
   cd backend && pnpm start:dev
   cd frontend && pnpm dev
   ```

5. Đăng nhập → banner **Bật thông báo** hoặc vào `/settings/notifications`.

6. Trình duyệt phải cho phép notification (Chrome: biểu tượng ổ khóa → Notifications → Allow).

7. Nhập **ngày/tháng mất âm lịch** cho Person (form chi tiết thành viên).

8. Test cron thủ công: xem [cron-github-actions.md](./cron-github-actions.md) (curl hoặc **Run workflow** trên GitHub).

## Production Deployment Guide

1. Cập nhật **Site URL** trong OneSignal Dashboard = domain production.
2. Deploy frontend (HTTPS bắt buộc cho Web Push) — vd. Vercel.
3. Deploy backend với `ONESIGNAL_*`, `FRONTEND_URL`, `CRON_SECRET`, `ENABLE_INTERNAL_CRON=false`.
4. Cấu hình **GitHub Actions cron** — hướng dẫn đầy đủ: **[docs/cron-github-actions.md](./cron-github-actions.md)**.

## Vercel Setup Guide (frontend only)

1. Import repo lên Vercel, **Root Directory:** `frontend`.
2. Environment:
   - `NEXT_PUBLIC_ONESIGNAL_APP_ID`
   - `NEXT_PUBLIC_API_URL` → URL backend production
3. OneSignal Site URL = URL Vercel (`https://xxx.vercel.app`).
4. **Cron notification:** không dùng Vercel Cron — cấu hình [GitHub Actions](./cron-github-actions.md) (miễn phí).

## GitHub Actions Cron (production)

**→ Đọc hướng dẫn chi tiết tại [docs/cron-github-actions.md](./cron-github-actions.md)**

Tóm tắt:

1. Backend: `CRON_SECRET`, `ENABLE_INTERNAL_CRON=false`.
2. GitHub repo → **Settings → Secrets and variables → Actions**:
   - `API_URL` — URL backend (vd. `https://api.example.com`)
   - `CRON_SECRET` — cùng giá trị backend
3. Push `.github/workflows/death-anniversary-cron.yml` (đã có trong repo).
4. Tab **Actions** → **Death anniversary cron** → **Run workflow** để test.

Lịch: **00:00 Asia/Ho_Chi_Minh** mỗi ngày (`0 17 * * *` UTC).

## NestJS Setup Guide

Module: `backend/src/notifications/`

- `NotificationScheduler` — cron nội bộ 00:00 ICT (chỉ khi `ENABLE_INTERNAL_CRON=true`, local dev)
- `POST /notifications/cron/death-anniversary` — trigger production qua [GitHub Actions](./cron-github-actions.md)
- `OneSignalService` — gọi REST API
- `NotificationsModule` — import trong `AppModule` cùng `ScheduleModule.forRoot()`

Cài dependency:

```bash
cd backend && pnpm add @nestjs/schedule lunar-javascript
```

## Troubleshooting

| Vấn đề                           | Gợi ý                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| Không thấy prompt quyền          | Kiểm tra `NEXT_PUBLIC_ONESIGNAL_APP_ID`, HTTPS/localhost           |
| Đã Allow nhưng không nhận push   | Kiểm tra subscription ID đã sync (`PATCH /notifications/settings`) |
| Cron không chạy                  | Xem [cron-github-actions.md](./cron-github-actions.md): secrets `API_URL` + `CRON_SECRET`, `ENABLE_INTERNAL_CRON=false`, test **Run workflow** |
| Gửi FAILED trong NotificationLog | Kiểm tra REST API Key, App ID, subscription còn valid              |
| Sai ngày giỗ                     | Kiểm tra `deathLunarDay` / `deathLunarMonth` trên Person           |

## Official References

- [OneSignal Web SDK setup](https://documentation.onesignal.com/docs/web-sdk-setup)
- [OneSignal Web SDK reference](https://documentation.onesignal.com/docs/web-sdk-reference)
- [OneSignal REST API — Create notification](https://documentation.onesignal.com/reference/create-notification)
- [OneSignal Keys & IDs](https://documentation.onesignal.com/docs/keys-and-ids)
- [NestJS Schedule](https://docs.nestjs.com/techniques/task-scheduling)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
- [lunar-javascript (GitHub)](https://github.com/6tail/lunar-javascript)

## Kiến trúc

Xem thêm [notification-architecture.md](./notification-architecture.md).
