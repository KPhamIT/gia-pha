# Notification API

Base URL: `NEXT_PUBLIC_API_URL` (mặc định `http://localhost:5000`).  
Tất cả endpoint dưới đây yêu cầu header `Authorization: Bearer <JWT>` trừ khi ghi chú khác.

## Cron (Vercel / HTTP trigger)

### `POST /notifications/cron/death-anniversary`

Chạy job gửi push ngày giỗ. **Không dùng JWT** — xác thực bằng `CRON_SECRET`:

```http
Authorization: Bearer <CRON_SECRET>
```

Response:

```json
{ "sentCount": 3 }
```

Production: Vercel Cron → `GET /api/cron/death-anniversary` (Next.js) → endpoint này.  
Local dev: có thể bật `ENABLE_INTERNAL_CRON=true` để dùng `@Cron` 07:00 ICT trong NestJS.  
Production khuyến nghị: [GitHub Actions](./cron-github-actions.md) gọi trực tiếp endpoint này.

## Settings

### `GET /notifications/settings`

Trả về cài đặt thông báo của user hiện tại.

```json
{
  "notificationDeathAnniversaryEnabled": false,
  "notificationEventEnabled": false,
  "notificationPostEnabled": false,
  "onesignalSubscriptionId": null
}
```

### `PATCH /notifications/settings`

Body (tất cả optional):

```json
{
  "notificationDeathAnniversaryEnabled": true,
  "notificationEventEnabled": false,
  "notificationPostEnabled": false,
  "onesignalSubscriptionId": "subscription-id-from-onesignal"
}
```

## Notification center

### `GET /notifications`

Danh sách log thông báo của user (mới nhất trước).

```json
[
  {
    "id": 1,
    "title": "Ngày giỗ hôm nay",
    "message": "Hôm nay là ngày giỗ của cụ Nguyễn Văn A.\nNhấn để xem bài cúng.",
    "status": "SENT",
    "sentAt": "2026-06-18T00:00:07.000Z",
    "createdAt": "2026-06-18T00:00:07.000Z",
    "organizationId": 1,
    "person": { "id": 5, "fullName": "Nguyễn Văn A" }
  }
]
```

## Upcoming ceremonies

### `GET /notifications/upcoming`

User phải thuộc organization. Trả về person có giỗ trong 0–3 ngày âm lịch tới.

```json
[
  {
    "personId": 5,
    "fullName": "Nguyễn Văn A",
    "deathLunarDay": 15,
    "deathLunarMonth": 7,
    "lunarDateLabel": "15 tháng 07 âm lịch",
    "daysUntil": 2,
    "message": "Còn 2 ngày nữa là ngày giỗ của cụ Nguyễn Văn A."
  }
]
```

### `GET /notifications/upcoming/:personId`

Chi tiết một person (kiểm tra cùng org).

## Admin stats

### `GET /notifications/stats`

Yêu cầu role **ADMIN** hoặc **SYSTEM** (`MutateGuard`).

```json
{
  "totalMembers": 120,
  "subscribed": 35,
  "rate": 29.1
}
```

## Ceremony HTML

### `GET /ceremonies/:personId/html`

Render bài cúng runtime (không lưu DB). Dùng mẫu mặc định của tổ chức; nếu chưa có mẫu thì fallback built-in.

```json
{
  "personId": 5,
  "fullName": "Nguyễn Văn A",
  "organizationId": 1,
  "html": "<!DOCTYPE html>..."
}
```

## Ceremony templates (admin)

Yêu cầu **ADMIN** hoặc **SYSTEM** cho ghi (`MutateGuard`). Đọc danh sách: user thuộc org.

### `GET /ceremonies/templates/variables`

Danh sách biến template.

### `GET /ceremonies/templates`

Danh sách mẫu của organization.

### `POST /ceremonies/templates`

```json
{
  "name": "Bài cúng ngày giỗ",
  "content": "<!DOCTYPE html>...",
  "isDefault": true
}
```

### `PATCH /ceremonies/templates/:id`

Cập nhật tên / nội dung / `isDefault`.

### `PATCH /ceremonies/templates/:id/default`

Đặt mẫu làm mặc định.

### `DELETE /ceremonies/templates/:id`

Xóa mẫu (không xóa mẫu cuối cùng).

## Push payload (OneSignal `data`)

```json
{
  "type": "DEATH_ANNIVERSARY",
  "personId": 5,
  "organizationId": 1,
  "daysUntil": 0
}
```

Deep link: `{FRONTEND_URL}/ceremonies/upcoming?personId={personId}`

## Person fields (liên quan)

Cập nhật qua `PATCH /person/:id/detail`:

- `deathLunarDay` (1–30)
- `deathLunarMonth` (1–12)

Person phải `deceased: true` hoặc có `deathDate` để được cron xét gửi thông báo.
