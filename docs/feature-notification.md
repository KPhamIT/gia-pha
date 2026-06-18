# Feature Specification: Hệ thống Thông Báo Ngày Giỗ bằng OneSignal cho Ứng dụng Gia Phả

## Tech Stack

Frontend:

- Next.js
- React
- TypeScript
- React Flow

Backend:

- NestJS
- Prisma ORM

Database:

- Supabase PostgreSQL

Notification:

- OneSignal Free Plan

---

# Mục tiêu

Xây dựng hệ thống thông báo ngày giỗ tự động cho ứng dụng Gia Phả.

Hệ thống sẽ:

- Tự động phát hiện ngày giỗ sắp đến.
- Gửi Push Notification qua OneSignal.
- Chỉ gửi cho những người đã đăng ký nhận thông báo.
- Khi click notification sẽ mở trang bài cúng tương ứng.
- Người dùng có thể xem bài cúng, in trực tiếp hoặc tải PDF.

---

# Nghiệp vụ

Mỗi Person trong gia phả có:

```sql
death_date
death_lunar_day
death_lunar_month
```

Ví dụ:

```text
Nguyễn Văn A

Mất ngày:
15/07 âm lịch
```

---

# Quy tắc gửi thông báo

Ví dụ ngày giỗ:

```text
15/07 âm lịch
```

Gửi thông báo:

```text
12/07 âm lịch
→ Còn 3 ngày

13/07 âm lịch
→ Còn 2 ngày

14/07 âm lịch
→ Còn 1 ngày

15/07 âm lịch
→ Hôm nay
```

---

# Nội dung thông báo

## Trước 3 ngày

Title:

```text
Sắp đến ngày giỗ
```

Body:

```text
Còn 3 ngày nữa là ngày giỗ của cụ {{person.full_name}}.
```

---

## Trước 2 ngày

Title:

```text
Sắp đến ngày giỗ
```

Body:

```text
Còn 2 ngày nữa là ngày giỗ của cụ {{person.full_name}}.
```

---

## Trước 1 ngày

Title:

```text
Ngày giỗ vào ngày mai
```

Body:

```text
Ngày mai là ngày giỗ của cụ {{person.full_name}}.
```

---

## Đúng ngày

Title:

```text
Ngày giỗ hôm nay
```

Body:

```text
Hôm nay là ngày giỗ của cụ {{person.full_name}}.
Nhấn để xem bài cúng.
```

---

# Multi Tenant Requirement

Ứng dụng là Multi-Tenant.

Mỗi dòng họ là một Organization riêng.

Ví dụ:

```text
Organization A
Organization B
Organization C
```

Thông báo của Organization A chỉ được gửi cho thành viên của Organization A.

Không được gửi chéo dữ liệu giữa các Organization.

---

# Notification Subscription Requirement

## Bắt buộc Opt-In

KHÔNG gửi thông báo cho tất cả thành viên.

Chỉ gửi cho user đã chủ động đăng ký.

Mặc định:

```text
notification_death_anniversary_enabled = false
```

User phải tự bật.

---

# User Notification Settings

Tạo trang:

```text
/app/settings/notifications
```

Hiển thị:

```text
☑ Nhận thông báo ngày giỗ

☑ Nhận thông báo sự kiện dòng họ

☑ Nhận thông báo bài viết mới
```

Mặc định:

```text
false
false
false
```

---

# Luồng đăng ký Notification

KHÔNG yêu cầu quyền Notification ngay khi login.

Luồng đúng:

```text
User đăng nhập
      ↓
Dashboard
      ↓
Banner:

"Bạn có muốn nhận thông báo ngày giỗ tổ tiên không?"

[Bật thông báo]
[Để sau]
```

Khi user bấm:

```text
Bật thông báo
```

thì:

1. Xin quyền Notification của trình duyệt.
2. Đăng ký OneSignal.
3. Lưu Subscription ID vào database.
4. Bật notification_death_anniversary_enabled = true.

---

# Database

## users

Thêm:

```sql
onesignal_subscription_id varchar

notification_death_anniversary_enabled boolean default false

notification_event_enabled boolean default false

notification_post_enabled boolean default false
```

---

# Notification Status UI

Hiển thị:

```text
Thông báo trình duyệt

🟢 Đã cấp quyền

hoặc

🔴 Chưa cấp quyền
```

Nếu chưa cấp quyền:

```text
[Bật thông báo]
```

---

# OneSignal Integration

Frontend:

Tạo:

```text
src/services/onesignal.service.ts

src/hooks/useOneSignal.ts
```

Yêu cầu:

- Khởi tạo OneSignal.
- Đăng ký Subscription.
- Lấy Subscription ID.
- Đồng bộ Subscription ID với backend.
- Xử lý trường hợp người dùng revoke quyền.

---

# Backend Notification Module

Tạo module:

```text
src/modules/notifications
```

Bao gồm:

```text
notification.module.ts

notification.service.ts

notification.controller.ts

notification.scheduler.ts
```

---

# Scheduled Job

Sử dụng:

```bash
@nestjs/schedule
```

Cron:

```text
0 7 * * *
```

Timezone:

```text
Asia/Ho_Chi_Minh
```

Chạy mỗi ngày lúc 07:00 sáng.

---

# Lunar Calendar

Cursor phải nghiên cứu thư viện phù hợp.

Yêu cầu:

- Hỗ trợ âm lịch Việt Nam.
- Chạy trên Node.js.
- Chính xác.
- Có document.

Đánh giá:

- lunar-javascript
- vietnamese-lunar-calendar
- các thư viện tương đương

Giải thích lựa chọn trong tài liệu.

---

# Logic Cron

Bước 1

Lấy ngày âm lịch hiện tại.

Bước 2

Tìm tất cả Person đã mất.

Bước 3

Tính:

```text
daysUntilDeathAnniversary
```

Bước 4

Nếu:

```text
3
2
1
0
```

thì chuẩn bị notification.

Bước 5

Lấy danh sách user thuộc cùng Organization.

Bước 6

Lọc:

```sql
notification_death_anniversary_enabled = true

onesignal_subscription_id IS NOT NULL

is_active = true
```

Bước 7

Gửi OneSignal.

---

# Notification Service

Tạo service:

```typescript
sendNotification(
  userIds: string[],
  title: string,
  content: string,
  data?: Record<string, any>
)
```

Payload:

```json
{
  "type": "DEATH_ANNIVERSARY",
  "personId": 123,
  "organizationId": 456
}
```

---

# Logging

Tạo bảng:

```sql
notification_logs
```

```sql
id

organization_id

user_id

person_id

title

message

status

sent_at

created_at
```

Lưu toàn bộ lịch sử gửi.

---

# Notification Center

Tạo menu:

```text
Thông báo
```

Route:

```text
/app/notifications
```

Hiển thị:

```text
🔔 Hôm nay là ngày giỗ cụ Nguyễn Văn A

🔔 Còn 2 ngày nữa là ngày giỗ cụ Nguyễn Văn B
```

---

# Upcoming Ceremony Page

Route:

```text
/app/ceremonies/upcoming
```

Hiển thị:

```text
Tên người được cúng

Ngày giỗ

Còn bao nhiêu ngày

[Xem bài cúng]
```

---

# Điều hướng từ Notification

Khi click notification:

```text
/app/ceremonies/upcoming?personId={id}
```

Mở đúng người được thông báo.

---

# Chức năng Bài Cúng

KHÔNG tạo sẵn bài cúng trong database.

Khi user click:

```text
[Xem bài cúng]
```

Backend sẽ:

1. Load Person.
2. Load Ceremony Template.
3. Render Variables.
4. Trả HTML.

---

# Render Variables

Ví dụ:

```html
{{person.full_name}} {{person.birth_date}} {{person.death_date}}
{{organization.name}} {{ceremony.lunar_date}}
```

Sau khi render:

```html
Nguyễn Văn A 1930 2010 Dòng họ Nguyễn 15 tháng 07 âm lịch
```

---

# PDF Export

Trong trang bài cúng:

```text
🖨 In trực tiếp

📄 Tải PDF
```

PDF sinh realtime.

Không cần lưu database.

---

# Security

Bắt buộc kiểm tra:

```text
organization_id
```

ở tất cả API.

User chỉ được xem dữ liệu thuộc Organization của mình.

Không được truy cập dữ liệu Organization khác.

---

# Admin Dashboard Statistics

Hiển thị:

```text
Tổng thành viên:
120

Đã đăng ký nhận thông báo:
35

Tỷ lệ:
29.1%
```

---

# Deliverables

Cursor phải tạo:

1. Prisma schema.
2. Database migration.
3. NestJS Notification Module.
4. OneSignal integration cho Next.js.
5. Cron Job.
6. Notification Center UI.
7. Notification Settings UI.
8. Upcoming Ceremony Page.
9. Generate Ceremony Runtime.
10. PDF Export.
11. API Documentation.
12. Architecture Documentation.
13. OneSignal Setup Documentation.

---

# Documentation Requirement

Tạo file:

```text
docs/ONESIGNAL_SETUP.md
```

Bắt buộc chứa:

## OneSignal Account Setup

- Tạo App.
- Chọn Web Push.
- Cấu hình localhost.
- Cấu hình production domain.

## Frontend Environment Variables

```env
NEXT_PUBLIC_ONESIGNAL_APP_ID=
```

## Backend Environment Variables

```env
ONESIGNAL_APP_ID=
ONESIGNAL_REST_API_KEY=
```

## Local Development Guide

## Production Deployment Guide

## Vercel Setup Guide

## NestJS Setup Guide

## Troubleshooting

## Official References

Cursor phải nghiên cứu và đưa vào file docs/ONESIGNAL_SETUP.md đầy đủ URL tài liệu chính thức mới nhất của:

- OneSignal Web SDK
- OneSignal REST API
- NestJS Schedule
- Prisma
- Thư viện âm lịch được lựa chọn

Không được sử dụng tài liệu cũ hoặc blog bên thứ ba nếu đã có tài liệu chính thức.
