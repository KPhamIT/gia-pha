# Phân quyền & đăng nhập — Setup

> **Quy tắc khi code (auth / role / permission):** xem **[`auth-roles-permissions.md`](./auth-roles-permissions.md)** — bắt buộc cho developer và AI agents.
>
> Claude Code / Cursor: đọc thêm [`AGENTS.md`](../AGENTS.md) và `.cursor/rules/auth-roles-permissions.mdc`.

## Vai trò

| Role | Mô tả |
|------|--------|
| **SYSTEM** | Toàn quyền: quản lý mọi tổ chức, user, mặc định quyền feature toàn hệ thống |
| **ADMIN** | Quản lý **một** tổ chức: dữ liệu gia phả, user STANDARD trong org, **cấu hình quyền feature** cho user thường |
| **STANDARD** | Quyền ghi theo **feature** admin/system đã bật (mặc định: chỉ xem) |
| **Khách (chưa login)** | Xem theo mặc định; khi **lưu** → yêu cầu đăng nhập |

Social login (Facebook/Zalo) tự gán role **STANDARD**.

## Đăng nhập không bắt buộc

- App luôn load cây mặc định khi chưa login.
- Thao tác **ghi** kiểm tra `requireFeature(key)` — thiếu quyền hiện `AuthRequiredSheet` (login / permission / admin).

## Tài khoản mặc định (seed)

Sau `pnpm db:seed`:

| Field | Giá trị |
|-------|---------|
| Username | `admin` |
| Password | `admin123` (hoặc `ADMIN_PASSWORD` trong `.env`) |
| Role | `ADMIN` |
| Tổ chức | Gắn với org chính (seed: **Family Tree**) |

**System (quản trị hệ thống):**

| Field | Giá trị |
|-------|---------|
| Username | `system` |
| Password | `system123` (hoặc `SYSTEM_PASSWORD` trong `.env`) |
| Role | `SYSTEM` |

## Màn quản lý

| Route | Quyền | Chức năng |
|-------|-------|-----------|
| `/system` | **SYSTEM** | Tổ chức, mọi user, tab **Quyền** (mặc định + theo org) |
| `/org-users` | **ADMIN** | User STANDARD trong org; tab **Quyền** (ghi đè theo org) |

Truy cập nhanh: icon trên cây gia phả hoặc sheet **Tài khoản**.

```bash
cd backend
pnpm db:seed
```

## Biến môi trường

**Backend** (`backend/.env`):

```env
ALLOW_PUBLIC_ACCESS=true
ADMIN_PASSWORD=admin123
SYSTEM_PASSWORD=system123
JWT_SECRET=...
```

**Frontend** (`frontend/.env` hoặc `.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ALLOW_PUBLIC_ACCESS=true
NEXT_PUBLIC_FACEBOOK_APP_ID=...

# Thông tin người liên hệ (hiển thị trên /login và trong thông báo yêu cầu quyền)
NEXT_PUBLIC_CONTACT_NAME=Nguyễn Văn A
NEXT_PUBLIC_CONTACT_PHONE=0901234567
NEXT_PUBLIC_CONTACT_EMAIL=admin@example.com
NEXT_PUBLIC_CONTACT_NOTE=Liên hệ để được cấp tài khoản quản trị
```

Sau khi sửa `.env`, **restart** `pnpm dev` ở frontend.

## Email thông báo đăng ký dòng họ

Khi user tạo dòng họ mới (`/tao-dong-ho`), backend có thể gửi email cho tài khoản SYSTEM qua **Resend**. Cấu hình chi tiết: **[`resend-setup.md`](./resend-setup.md)**.

## Thông báo & người liên hệ

- `AuthRequiredSheet`: `login` (chưa đăng nhập), `permission` (đã login nhưng thiếu feature), `admin` (cần quản trị user/org).
- Thông tin liên hệ từ `NEXT_PUBLIC_CONTACT_*`.

## API (tóm tắt)

| Method | Route | Quyền |
|--------|-------|-------|
| POST | `/auth/login` | Public |
| POST | `/auth/facebook` | Public |
| GET | `/auth/me` | Optional JWT — trả `user`, `person`, `features` |
| PATCH | `/auth/me/person` | JWT + `linkAccount` feature (hoặc ADMIN/SYSTEM) |
| GET/PATCH | `/users` … | `MutateGuard` — ADMIN (org) / SYSTEM |
| POST/PATCH/DELETE | `/person`, `/relationship` | `FeatureMutateGuard` + `editTree` |
| POST/PATCH/DELETE | `/event` … | `FeatureMutateGuard` + `editEvents` |
| PUT | `/settings` | `FeatureMutateGuard` + `settings` |
| PUT | `/export-preset` | `FeatureMutateGuard` + `export` |
| GET/PATCH | `/standard-features/defaults` | `SystemGuard` |
| GET/PATCH | `/organizations/:id/standard-features` | `MutateGuard` |

Chi tiết guard và checklist: [`auth-roles-permissions.md`](./auth-roles-permissions.md).

## Liên kết user với person

1. Đăng nhập (cần feature `linkAccount` nếu STANDARD).
2. Mở **Tài khoản** trên cây.
3. Chọn thành viên → **Lưu**.

## Đổi role user

Chỉ **SYSTEM** qua `/system` hoặc `PATCH /users/:id`.

## Tạo user STANDARD

**Admin:** `/org-users` → **Thêm user**.

**System:** `/system` → tab Users.

Thủ công: `provider` = `local`, `providerId` = `local:<username>`, `role` = `STANDARD`. Hash mật khẩu: `AuthService.hashPassword()`.
