# Đăng nhập bằng Zalo — Hướng dẫn setup

Tài liệu này mô tả cách cấu hình và chạy tính năng **Đăng nhập Zalo** (OAuth v4 + PKCE) cho dự án Gia phả.

## Tổng quan luồng

```mermaid
sequenceDiagram
  participant User
  participant FE as Frontend_3000
  participant BE as Backend_5000
  participant Zalo as Zalo_OAuth_v4

  User->>FE: Mở /login, bấm Đăng nhập Zalo
  FE->>BE: GET /auth/zalo
  BE->>BE: Tạo state + PKCE code_verifier, lưu cookie
  BE->>Zalo: Redirect /v4/permission
  Zalo->>User: Màn hình cấp quyền
  Zalo->>BE: GET /auth/zalo/callback?code&state
  BE->>Zalo: POST /v4/access_token
  BE->>Zalo: GET graph.zalo.me/v2.0/me
  BE->>BE: Tạo/cập nhật User + Person, ký JWT
  BE->>FE: Redirect /auth/callback#token=JWT
  FE->>FE: Lưu token, chuyển /family-tree
```

**Vì sao dùng redirect qua backend?** Zalo Login v4 bắt buộc **PKCE** và đổi `authorization_code` lấy `access_token` ở server (header `secret_key` = App Secret). App Secret **không được** đặt trên frontend.

---

## Link tài liệu chính thức

| Mục | Link |
|-----|------|
| Cổng Zalo Developers | https://developers.zalo.me/ |
| Social API — Tổng quan | https://developers.zalo.me/docs/social-api/tai-lieu/tong-quan |
| User Access Token v4 | https://developers.zalo.me/docs/social-api/tham-khao/user-access-token-v4 |
| API tham chiếu đổi token (POST) | https://developers.zalo.me/docs/api/social-api/tham-khao/user-access-token-post-4316 |
| Profile + `appsecret_proof` | https://miniapp.zaloplatforms.com/documents/intro/authen-user/ |
| Tham khảo PKCE (open source) | https://github.com/nguyenthanhxuan/passport-zalo |

### Endpoint Zalo dùng trong code

| Bước | Method | URL |
|------|--------|-----|
| Xin quyền (Social API) | GET redirect | `https://oauth.zaloapp.com/v4/permission` |
| Đổi code lấy token | POST | `https://oauth.zaloapp.com/v4/access_token` |
| Lấy profile | GET | `https://graph.zalo.me/v2.0/me?fields=id,name,picture` |

---

## Bước 1 — Tạo ứng dụng trên Zalo Developers

1. Truy cập https://developers.zalo.me/ và đăng nhập bằng tài khoản Zalo.
2. Vào **Quản lý ứng dụng** → **Tạo ứng dụng mới** (loại **Web**).
3. Trong cấu hình app, bật quyền **Social API** / **Zalo Login** (đăng nhập người dùng).
4. Ghi lại:
   - **App ID** (`ZALO_APP_ID`)
   - **App Secret** (`ZALO_APP_SECRET`) — chỉ dùng trên backend
5. Đăng ký **Redirect URI** (phải khớp **100%**, kể cả `http` vs `https`, port, dấu `/` cuối):

   | Môi trường | Redirect URI |
   |------------|----------------|
   | Local dev | `http://localhost:5000/auth/zalo/callback` |
   | Production | `https://api.<domain-cua-ban>/auth/zalo/callback` |

6. Nếu Zalo yêu cầu whitelist domain, thêm domain frontend (ví dụ `http://localhost:3000`, `https://gia-pha.example.com`).

> **Lưu ý UI:** Nút Zalo trên trang login mặc định **ẩn**. Bật bằng `NEXT_PUBLIC_ENABLE_ZALO_LOGIN=true` trong `frontend/.env.local`. Hiện tại khuyến nghị dùng Facebook login — xem [`facebook-login-setup.md`](facebook-login-setup.md).

> **Lưu ý:** App mới có thể cần Zalo duyệt hoặc bật thêm quyền trước khi login production hoạt động.

---

## Bước 2 — Biến môi trường

### Backend (`backend/.env`)

Sao chép từ `backend/.env.example` và điền:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/family_tree
JWT_SECRET=<chuoi-bi-mat-manh>
PORT=5000
ALLOW_PUBLIC_ACCESS=true

ZALO_APP_ID=<app-id-tu-zalo-developers>
ZALO_APP_SECRET=<app-secret-tu-zalo-developers>
ZALO_REDIRECT_URI=http://localhost:5000/auth/zalo/callback
FRONTEND_URL=http://localhost:3000
```

| Biến | Mô tả |
|------|--------|
| `ZALO_APP_ID` | App ID từ Zalo Developers |
| `ZALO_APP_SECRET` | App Secret — **chỉ backend** |
| `ZALO_REDIRECT_URI` | Callback URL đã đăng ký trên Zalo |
| `FRONTEND_URL` | URL frontend để redirect sau login |
| `JWT_SECRET` | Ký JWT app (7 ngày) |
| `ALLOW_PUBLIC_ACCESS` | `true` = xem cây public không cần login; `false` = bắt buộc đăng nhập |

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ALLOW_PUBLIC_ACCESS=true
```

| Biến | Mô tả |
|------|--------|
| `NEXT_PUBLIC_API_URL` | URL backend (mặc định code là `5000`) |
| `NEXT_PUBLIC_ALLOW_PUBLIC_ACCESS` | Khớp với `ALLOW_PUBLIC_ACCESS` backend |

---

## Bước 3 — Chạy local

```bash
# Terminal 1 — Database + backend
cd backend
pnpm db:migrate   # nếu chưa migrate
pnpm start:dev    # http://localhost:5000

# Terminal 2 — Frontend
cd frontend
pnpm dev          # http://localhost:3000
```

---

## Bước 4 — Kiểm thử thủ công

1. Mở http://localhost:3000/login
2. Bấm **Đăng nhập bằng Zalo**
3. Cấp quyền trên Zalo → được chuyển về `/family-tree`
4. Kiểm tra JWT:
   - DevTools → Application → Local Storage → key `family-tree-token`
5. Kiểm tra API:
   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:5000/auth/me
   ```
   Kỳ vọng: `user` với `provider: "zalo"` và `person` liên kết.

### Các trường hợp cần pass

| Tình huống | Kỳ vọng |
|------------|---------|
| Login lần đầu | Tạo `User` + `Person`, load cây theo person |
| Login lại | Giữ person cũ |
| `ALLOW_PUBLIC_ACCESS=true`, chưa login | Vẫn xem cây public tại `/family-tree` |
| `ALLOW_PUBLIC_ACCESS=false`, chưa login | Redirect `/login` |
| Token hết hạn / sai | 401 → xóa token, redirect login |
| Hủy ở màn Zalo | Về `/login?error=...` |

---

## Troubleshooting

### `redirect_uri mismatch` / lỗi redirect

- So sánh `ZALO_REDIRECT_URI` trong `.env` với URI đã đăng ký trên Zalo Developers (từng ký tự).
- Đảm bảo backend chạy đúng port `5000` (hoặc cập nhật URI tương ứng).

### `Invalid appsecret_proof`

- `appsecret_proof` = `HMAC-SHA256(access_token, app_secret)` dạng hex.
- Dùng **user access_token** (sau đổi code), không dùng app token.
- Kiểm tra `ZALO_APP_SECRET` đúng app.

### Lỗi PKCE / `code_verifier`

- Cookie `zalo_oauth` phải được gửi khi Zalo callback về backend (cùng site `localhost:5000`).
- Cookie hết hạn sau ~10 phút — thử login lại từ đầu.
- Không mở callback URL thủ công không có cookie.

### CORS / không gọi được API

- Kiểm tra `NEXT_PUBLIC_API_URL=http://localhost:5000`
- Backend đã bật CORS (`origin: true` trong `main.ts`).

### `/auth/me` trả 401 dù đã login

- Kiểm tra `JWT_SECRET` backend khớp khi ký/verify.
- Token trong localStorage còn hạn (7 ngày).

### Zalo không hiện màn cấp quyền

- App chưa bật Social API / Zalo Login.
- App ID sai trong `ZALO_APP_ID`.

---

## Deploy production — Checklist

- [ ] Tạo app Zalo production (hoặc cập nhật app dev) với Redirect URI HTTPS
- [ ] Set `ZALO_REDIRECT_URI=https://api.<domain>/auth/zalo/callback`
- [ ] Set `FRONTEND_URL=https://<domain-frontend>`
- [ ] Set `JWT_SECRET` mạnh, không dùng `change-me`
- [ ] Set `NEXT_PUBLIC_API_URL` trỏ API production
- [ ] Cân nhắc `ALLOW_PUBLIC_ACCESS=false` nếu muốn bắt buộc đăng nhập
- [ ] HTTPS bắt buộc cho cookie/OAuth trên production

---

## Kiến trúc code (tham khảo)

| Thành phần | File |
|------------|------|
| OAuth Zalo + PKCE | `backend/src/auth/zalo-oauth.service.ts` |
| Login endpoints | `backend/src/auth/auth.controller.ts` |
| JWT guard | `backend/src/auth/jwt-auth.guard.ts` |
| Trang login | `frontend/app/login/page.tsx` |
| Nhận token | `frontend/app/auth/callback/page.tsx` |
| Session helpers | `frontend/lib/auth/session.ts` |
