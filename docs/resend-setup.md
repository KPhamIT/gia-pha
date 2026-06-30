# Resend — Email thông báo đăng ký dòng họ mới

Hướng dẫn cấu hình [Resend](https://resend.com/) để backend Gia phả gửi email cho tài khoản **SYSTEM** mỗi khi có người dùng đăng ký dòng họ mới (trang `/tao-dong-ho`).

## Luồng hoạt động

1. Người dùng gửi form **Tạo dòng họ** → `POST /organizations/register-with-admin`.
2. Backend tạo `Organization` + user **ADMIN** như hiện tại.
3. Sau khi lưu DB thành công, backend gửi email qua Resend (bất đồng bộ — **không chặn** đăng ký nếu email lỗi).
4. Email gửi tới:
   - `ORG_REGISTRATION_NOTIFY_EMAIL` nếu đặt trong `.env`, hoặc
   - Email của user có role **SYSTEM** (seed: `system@local.dev` — cần đổi sang email thật trên production).

Nội dung email gồm: tên dòng họ, ID org, username/email quản trị viên, thời gian đăng ký, link `/system`.

## 1. Tạo tài khoản Resend

1. Đăng ký tại [resend.com](https://resend.com/).
2. Vào **API Keys** → **Create API Key** → quyền **Sending access** (hoặc Full access khi dev).
3. Copy key dạng `re_...` — chỉ hiện một lần.

## 2. Domain gửi (From address)

Resend yêu cầu **verify domain** trước khi gửi từ địa chỉ `@domain-cua-ban`.

### Dev / thử nhanh

Resend cung cấp domain test `onboarding@resend.dev` — chỉ gửi được tới **email tài khoản Resend của bạn** (không gửi tùy ý sang email khác).

```env
RESEND_FROM_EMAIL=Gia phả <onboarding@resend.dev>
ORG_REGISTRATION_NOTIFY_EMAIL=email-ban-dung-dang-ky-resend@gmail.com
```

### Production

1. Resend Dashboard → **Domains** → **Add Domain** (vd. `mail.coinguon.io.vn` hoặc subdomain).
2. Thêm bản ghi DNS (SPF, DKIM, …) theo hướng dẫn Resend.
3. Chờ trạng thái **Verified**.
4. Cấu hình:

```env
RESEND_FROM_EMAIL=Gia phả <noreply@mail.coinguon.io.vn>
ORG_REGISTRATION_NOTIFY_EMAIL=admin@coinguon.io.vn
```

## 3. Biến môi trường backend

File `backend/.env` (xem `backend/.env.example`):

```env
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=Gia phả <noreply@mail.coinguon.io.vn>
ORG_REGISTRATION_NOTIFY_EMAIL=ban-quan-tri@example.com
FRONTEND_URL=https://www.coinguon.io.vn
```

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `RESEND_API_KEY` | Có (để gửi mail) | API key từ Resend |
| `RESEND_FROM_EMAIL` | Có (để gửi mail) | Địa chỉ gửi đã verify; format `Tên hiển thị <email@domain.com>` |
| `ORG_REGISTRATION_NOTIFY_EMAIL` | Không | Email nhận thông báo; nếu bỏ trống → lấy email user **SYSTEM** trong DB |
| `FRONTEND_URL` | Khuyến nghị | Link trong email tới `/system` |

Nếu **thiếu** `RESEND_API_KEY` hoặc `RESEND_FROM_EMAIL`, backend **bỏ qua** gửi mail và ghi log cảnh báo (đăng ký vẫn thành công).

## 4. Email nhận — tài khoản SYSTEM

Sau seed (`pnpm db:seed`), user SYSTEM mặc định:

| Field | Giá trị |
|-------|---------|
| Username | `system` |
| Email | `system@local.dev` |
| Role | `SYSTEM` |

Trên production, **cập nhật email SYSTEM** sang hộp thư thật:

- Trang `/system` → quản lý user (nếu có UI sửa email), hoặc
- Đặt `ORG_REGISTRATION_NOTIFY_EMAIL` trong `.env` (ưu tiên hơn DB).

## 5. Dev local

```bash
cd backend
pnpm install   # package resend
pnpm db:migrate && pnpm db:seed
```

Thêm vào `backend/.env`:

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Gia phả <onboarding@resend.dev>
ORG_REGISTRATION_NOTIFY_EMAIL=your-resend-account@gmail.com
FRONTEND_URL=http://localhost:3000
```

Chạy backend + frontend, mở `/tao-dong-ho`, đăng ký dòng họ thử.

Kiểm tra log backend:

```text
[OrgRegistrationMailService] Đã gửi email thông báo đăng ký dòng họ #...
```

Hoặc Resend Dashboard → **Emails** → xem trạng thái delivered/bounced.

## 6. Production

1. Verify domain trên Resend.
2. Deploy backend với `RESEND_*`, `ORG_REGISTRATION_NOTIFY_EMAIL`, `FRONTEND_URL`.
3. **Không commit** API key vào git.
4. (Tuỳ chọn) Resend → **Webhooks** để theo dõi bounce/complaint.

## 7. Troubleshooting

| Triệu chứng | Nguyên nhân thường gặp |
|-------------|-------------------------|
| Log `Resend chưa cấu hình` | Thiếu `RESEND_API_KEY` hoặc `RESEND_FROM_EMAIL` |
| Log `Không có email nhận` | Không có `ORG_REGISTRATION_NOTIFY_EMAIL` và user SYSTEM không có email |
| Resend 403 / domain | `RESEND_FROM_EMAIL` chưa verify domain |
| Dev: mail không tới | Dùng `onboarding@resend.dev` nhưng gửi sang email khác tài khoản Resend |
| Đăng ký OK, không có mail | Xem log NestJS; lỗi email không làm fail API |

## 8. Code liên quan

| File | Vai trò |
|------|---------|
| `backend/src/mail/resend-mail.service.ts` | Gửi email qua Resend SDK |
| `backend/src/mail/org-registration-mail.service.ts` | Nội dung + người nhận |
| `backend/src/organization/organization.service.ts` | Gọi sau `registerWithAdmin` |

Mở rộng sau này (sự kiện khác, template React Email, …) có thể tái sử dụng `MailModule` / `ResendMailService`.
