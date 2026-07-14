# Google Analytics 4 & Microsoft Clarity — Hướng dẫn setup

Tài liệu này mô tả cách cấu hình **GA4** (lưu lượng / sự kiện) và **Microsoft Clarity** (heatmap / session recording) cho frontend Next.js của dự án Gia phả.

Code đã gắn sẵn trong `frontend/app/layout.tsx` qua `AnalyticsScripts`. **Chỉ khi** biến môi trường có giá trị thì script mới được tải — local không set env thì không track.

## Tổng quan

| Công cụ | Mục đích | Biến môi trường |
|--------|----------|-----------------|
| Google Analytics 4 | Page view, sự kiện, báo cáo người dùng | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| Microsoft Clarity | Heatmap, bản ghi phiên, rage click | `NEXT_PUBLIC_CLARITY_PROJECT_ID` |

File liên quan:

- `frontend/components/analytics/AnalyticsScripts.tsx` — tiêm script
- `frontend/components/analytics/AnalyticsPageViews.tsx` — page view khi đổi route (App Router)
- `frontend/lib/analytics/env.ts` — đọc env
- `frontend/.env.example` — mẫu biến môi trường

---

## 1. Google Analytics 4

### Tạo property & Measurement ID

1. Vào [Google Analytics](https://analytics.google.com/) → đăng nhập Google.
2. **Admin** (bánh răng) → **Create** → **Property** (hoặc dùng property có sẵn).
3. Đặt tên property (vd. `Cội Nguồn — Production`), chọn múi giờ / tiền tệ.
4. Chọn nền tảng **Web**.
5. **Website URL**: domain production (vd. `https://your-domain.com`).
6. Sau khi tạo, mở **Admin** → **Data streams** → chọn stream Web.
7. Sao chép **Measurement ID** dạng `G-XXXXXXXXXX`.

### (Khuyến nghị) Stream production vs staging

- Production: domain chính, Measurement ID chính.
- Staging/preview: stream riêng hoặc **không** set env GA trên preview để tránh làm bẩn số liệu.

### Cấu hình thêm (tuỳ chọn trên GA UI)

- **Admin** → **Data collection** → bật Google signals nếu cần.
- **Admin** → **Data retention**: chọn thời gian giữ dữ liệu phù hợp chính sách riêng tư.
- Thêm domain vào **Define internal traffic** / filter nếu muốn loại trừ IP nội bộ.

---

## 2. Microsoft Clarity

### Tạo project & Project ID

1. Vào [Microsoft Clarity](https://clarity.microsoft.com/) → đăng nhập (Microsoft / Google / …).
2. **Add new project**.
3. **Name**: vd. `Cội Nguồn`.
4. **Website URL**: domain production.
5. Sau khi tạo, vào **Settings** → **Setup** (hoặc **Overview**).
6. Sao chép **Project ID** (chuỗi ngắn, không phải URL đầy đủ).

Clarity cũng hỗ trợ liên kết với GA4 trong dashboard (Settings → Integrations) — làm sau khi cả hai đã chạy.

---

## 3. Biến môi trường Frontend

File `frontend/.env` (local) hoặc dashboard deploy (Vercel / …):

```env
# Google Analytics 4 — Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Microsoft Clarity — Project ID
NEXT_PUBLIC_CLARITY_PROJECT_ID=yourClarityProjectId
```

- Tiền tố `NEXT_PUBLIC_` bắt buộc (script chạy trên trình duyệt).
- Để trống một trong hai = tắt công cụ đó (không lỗi build).
- Sau khi sửa env: **restart** `pnpm dev` / redeploy.

Mẫu: `frontend/.env.example`.

### Vercel (hoặc host tương tự)

1. Project → **Settings** → **Environment Variables**.
2. Thêm hai biến trên cho **Production** (và Preview nếu muốn).
3. Redeploy.

---

## 4. Kiểm tra đã hoạt động

### Local / staging

1. Set env → chạy `cd frontend && pnpm dev`.
2. Mở site → DevTools → **Network**:
   - GA: request tới `googletagmanager.com/gtag/js?id=G-…` và `google-analytics.com` / `analytics.google.com`.
   - Clarity: request tới `clarity.ms/tag/…`.
3. DevTools → **Console** (nếu cần): không lỗi script chặn bởi adblock (adblock có thể chặn — tắt tạm khi test).

### GA4 realtime

1. GA → **Reports** → **Realtime**.
2. Mở website trên cửa sổ khác (có thể ẩn danh).
3. Trong vài giây phải thấy ít nhất 1 user / page view.

### Clarity

1. Clarity dashboard → **Dashboard** / **Recordings**.
2. Duyệt vài trang trên site.
3. Sau vài phút–vài giờ (thường nhanh hơn trên project mới) sẽ thấy session / heatmap.

---

## 5. Hành vi trong app

- Script load với `strategy="afterInteractive"` (không chặn first paint).
- GA: `send_page_view: false` lúc init; mỗi lần đổi pathname/search (App Router) gửi `gtag('config', …, { page_path })`.
- Clarity: tự ghi session theo mặc định project.

Không cần cài thêm npm package.

---

## 6. Privacy / pháp lý (nhắc nhanh)

- Cập nhật trang chính sách (`/chinh-sach-bao-mat`) nếu cần nêu rõ công cụ phân tích / cookie.
- GA4 và Clarity dùng cookie / storage phía client. Nếu sau này bắt buộc cookie consent (GDPR / người dùng EU), cần gate `AnalyticsScripts` sau khi user đồng ý — hiện tại load ngay khi có env.

---

## 7. Troubleshooting

| Hiện tượng | Cách xử lý |
|------------|------------|
| Không thấy request GA/Clarity | Kiểm tra env đã set + restart/redeploy; xem Network có bị adblock không |
| GA Realtime = 0 | Đúng Measurement ID `G-…`? Đúng domain stream? Đợi 30–60s |
| Clarity trống lâu | Project ID đúng chưa? Site URL khớp domain? Kiểm tra Settings → Setup |
| Track cả localhost | Chỉ set env trên production; hoặc tạo property/project riêng cho dev |
| Page view SPA thiếu | `AnalyticsPageViews` phải nằm trong Suspense (đã có trong `AnalyticsScripts`) |

---

## Checklist nhanh

- [ ] Tạo GA4 Web stream → có `G-XXXXXXXXXX`
- [ ] Tạo Clarity project → có Project ID
- [ ] Thêm `NEXT_PUBLIC_GA_MEASUREMENT_ID` và `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- [ ] Redeploy / restart frontend
- [ ] Xác nhận Realtime (GA) và recordings (Clarity)
- [ ] (Tuỳ chọn) Liên kết Clarity ↔ GA4 trên dashboard Clarity
- [ ] (Tuỳ chọn) Cập nhật chính sách bảo mật
