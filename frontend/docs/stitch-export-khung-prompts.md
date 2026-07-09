# Prompt Google Stitch — khung nền export phả đồ (A0)

Dùng để tạo **khung trang trí full-page** cho màn xuất ảnh cây gia phả — cùng loại file trong `frontend/public/images/khung/` (`khung1.svg` … `khung7.svg`).

**Khác với:** [`stitch-export-node-frame-prompts.md`](./stitch-export-node-frame-prompts.md) (viền **thẻ tên** nhỏ 90×120). Tài liệu này là **khung cả trang** (A0 ngang).

**Liên quan code:**

| File | Vai trò |
|------|---------|
| `public/images/khung/khung*.svg` | Asset khung nền built-in |
| `lib/family-tree/export-system-assets.ts` | Đăng ký `KHUNG_BACKGROUNDS` + thư viện export |
| `lib/family-tree/export-tree-geometry.ts` | Khổ A0 (`46811×33110`), `borderRect`, vùng header |
| `components/family-tree/export/useTreeExport.ts` | Thêm layer nền → full `borderRect` |
| `components/family-tree/export/ExportAssetLibraryModal.tsx` | Chọn khung trong **Thư viện ảnh** |
| `scripts/apply-khung-brand.py` | Gắn watermark Cội Nguồn góc dưới phải |

**Xuất file:** `frontend/public/images/khung/khung{N}.svg` (ưu tiên) hoặc `.webp` / `.png` rồi trace SVG  
**Hướng:** **Ngang (landscape)** — khổ A0  
**Tỷ lệ khuyên dùng:** **~1,41–1,55** (width ÷ height), gần A0 ngang ISO 841×1189 mm

**Canvas Stitch đề xuất:** **2000×1414 px** hoặc **1684×1190 px** (giữ tỷ lệ ~√2 ngang)

**Khổ in trong app (tham chiếu):**

| Thông số | Giá trị |
|----------|---------|
| Canvas SVG | 46811 × 33110 user units |
| `borderRect` (vùng khung nền) | margin 60 — gần full canvas |
| Vùng header (cuốn thư, rồng, câu đối) | ~12% chiều cao phía trên |
| Vùng cây gia phả | Trung tâm + dưới header, trong khung |
| Màu nền mặc định export | `#f7f0dd` (giấy kem) |
| Màu viền vector mặc định | `#7c2d12` |

> **Lưu ý:** Cây gia phả, câu đối, cuốn thư, rồng do app **chồng lên** khung — **không** vẽ cây hay chữ vào khung Stitch (trừ họa tiết trang trí cố định).

---

## Prompt gốc (dán đầu mọi lần tạo)

```
Design a full-page decorative FRAME / BORDER for a Vietnamese genealogy chart export (phả đồ A0 landscape, heritage ceremonial style).

Technical constraints (strict):
- Canvas: 2000×1414 px (landscape, aspect ratio ~1.414, ISO A0 horizontal feel)
- The frame is an empty template: ornate border around a large inner field
- Inner safe zone (flat parchment): ~72% width × ~78% height, centered — MUST stay clean for family tree overlay (no nodes, no names, no lines)
- Top band (~12% height): may have decorative header motif (scroll cap, temple arch, sun rays) but NO readable text
- Left and right inner margins (~8–12% width each): may have subtle vertical border strips for couplet columns — decorative only, no letters
- Bottom-right corner: leave ~10%×8% relatively simple (app adds small watermark later)
- Border style: traditional Vietnamese–Chinese genealogy document — gold #C5A059, deep brown #7c2d12, red lacquer #9f1239 accents, cream parchment center #F7F0DD
- Corner ornaments: dragons, clouds, lotus, or geometric patterns — symmetrical left/right
- Flat 2D illustration, print-ready, crisp vector-like edges — NOT 3D, NOT photo texture, NOT modern UI
- NO family tree, NO person boxes, NO couplet text, NO title text, NO logos, NO watermark
- Output suitable for SVG trace or high-res PNG; outer margin outside frame may be transparent or dark brown #1C1412 for preview only

Deliverable: one horizontal heritage genealogy sheet frame, like an official clan chart ready to print.
```

### Negative prompt (nếu Stitch có ô riêng)

```
family tree diagram, person names, couplet text, title text, watermark, logo, photo, 3D, drop shadow, modern dashboard, app UI, blurry, low resolution noise
```

---

## Workflow

1. Tạo **một** khung mẫu — chỉnh prompt gốc cho đúng tone kem–vàng–nâu.
2. Dùng **cùng prompt gốc** + **prompt biến thể** cho từng kiểu.
3. Export PNG cao cấp hoặc SVG (nếu Stitch xuất vector).
4. **Tối ưu / trace SVG** (Inkscape, Figma) — đơn giản path, bỏ font embed nặng nếu có.
5. Đặt file: `public/images/khung/khung8.svg` (số tiếp theo).
6. Chạy watermark: `cd frontend && python scripts/apply-khung-brand.py`
7. Đăng ký trong `export-system-assets.ts` (tên + `aspectRatio` từ viewBox).
8. Mở export → **Thư viện ảnh** → **Nền** → chọn khung mới; layer tự full khung in.

---

## Khung hiện có (tham chiếu)

| File | Tên app | viewBox (w×h) | aspectRatio |
|------|---------|---------------|-------------|
| `khung1.svg` | Khung nền 1 | 10104×6746 | ~1,498 |
| `khung2.svg` | Khung nền 2 | 33763×22055 | ~1,531 |
| `khung3.svg` | Khung nền 3 | 10236×6804 | ~1,504 |
| `khung4.svg` | Khung nền 4 | 11043×7521 | ~1,468 |
| `khung5.svg` | Khung nền 5 | 11043×7521 | ~1,468 |
| `khung6.svg` | Khung nền 6 | 54000×34000 | ~1,588 |
| `khung7.svg` | Khung nền 7 | 42377×28484 | ~1,488 |

`aspectRatio` trong code = **width ÷ height** của viewBox (không tính offset x/y).

---

## Danh sách biến thể Stitch (gợi ý khung8+)

### 1. `khung8` — Cổ điển kem, viền kép

**Prompt biến thể:**

```
Variant: Classic double-line parchment frame. Cream center #F7F0DD, outer brown #7c2d12 double border, thin gold #C5A059 inner line. Simple corner L-brackets. Formal temple archive. Minimal top band with thin gold rule only.
```

---

### 2. `khung9` — Hoa văn góc rồng

**Prompt biến thể:**

```
Variant: Four corner dragon head motifs facing inward (stylized flat silhouettes). Gold and brown border on cream field. Straight sides between corners. Royal genealogy document. Top band with subtle cloud scroll pattern, no text.
```

---

### 3. `khung10` — Mây 祥云 viền ngoài

**Prompt biến thể:**

```
Variant: Scalloped cloud (祥云) outer silhouette around entire sheet. Double gold lines following cloud edge. Soft heritage feel. Large flat cream interior. Symmetrical left-right.
```

---

### 4. `khung11` — Hoa sen / lá thiếp

**Prompt biến thể:**

```
Variant: Lotus petal scallops on top and bottom edges; vertical gold lines on sides. Buddhist–Vietnamese memorial chart border. Red accent #9f1239 on corner medallions only. Cream center.
```

---

### 5. `khung12` — Cổng đình / mái cong

**Prompt biến thể:**

```
Variant: Top architectural band like temple gate roof (curved eaves silhouette) spanning full width ~14% height. Pillars suggested at left-right thirds. Cream body below. Gold-brown structural lines.
```

---

### 6. `khung13` — Đỏ sơn thiếp (lacquer)

**Prompt biến thể:**

```
Variant: Deep red lacquer #9f1239 outer frame with gold filigree #C5A059. Cream parchment inner field. Rich but flat 2D. Imperial clan register aesthetic. Corner floral medallions.
```

---

### 7. `khung14` — Tối giản đường vàng

**Prompt biến thể:**

```
Variant: Minimal heritage frame — single thin gold stroke #C5A059, 2mm equivalent, small corner ticks only. Large cream field ~90% area. For dense trees where ornament would distract. No top band ornament.
```

---

### 8. `khung15` — Cuốn thư tích hợp trên

**Prompt biến thể:**

```
Variant: Integrated top scroll (cuốn thư) cap across full width — rolled paper cylinders left and right, flat title band center empty. Side columns marked by faint vertical gold lines only. Cream tree field below.
```

---

### 9. `khung16` — Tre trúc / tùng bách góc

**Prompt biến thể:**

```
Variant: Bamboo or pine branch corner clusters at four corners only. Scholarly genealogy style. Brown ink lines on cream. Restrained, not cluttered. Thin rectangular inner border.
```

---

### 10. `khung17` — Bát quái / âm dương

**Prompt biến thể:**

```
Variant: Eight trigram or yin-yang medallions at corners and mid-edges. Taoist heritage motif. Gold on cream. Central field empty. Top band with sun-disk halo motif, no text.
```

---

### 11. `khung18` — Viền hình học Đông Dương

**Prompt biến thể:**

```
Variant: Repeating geometric meander pattern (Greek key / Vietnamese traditional border) on all four sides. Flat two-color: brown lines on cream. Even border width ~5% of sheet. No corner figurative art.
```

---

### 12. `khung19` — Khung kép dày (tương tự khung4/5)

**Prompt biến thể:**

```
Variant: Thick double rectangular frame with clear gap between outer and inner rules. Corner reinforced squares. Print-shop phả đồ style. Colors #7c2d12 and #C5A059 on #F7F0DD.
```

---

## Prompt bảng so sánh (6 khung một lần)

```
Create a comparison sheet of 6 Vietnamese A0 landscape genealogy PAGE FRAMES (no tree, no text), on dark brown #1C1412 background.

Grid: 2 rows × 3 columns. Each frame ~1.414:1 landscape. Shared cream center #F7F0DD, gold/brown borders.

Styles left to right, top to bottom:
1) Classic double line
2) Dragon corners
3) Cloud scallop outer edge
4) Temple gate top band
5) Red lacquer + gold filigree
6) Minimal thin gold line

Each has large empty center for tree overlay and clean bottom-right for watermark. Flat vector heritage style. Small gray labels below each frame for comparison only (not on the art).
```

---

## Sau khi export — tích hợp vào app

### Bước 1 — Đặt file

```
frontend/public/images/khung/khung8.svg
```

Đặt tên `khung{N}.svg` theo số tiếp theo trong thư mục.

### Bước 2 — Watermark thương hiệu

```bash
cd frontend
python scripts/apply-khung-brand.py
```

Script thêm `<g id="coinguon-brand" data-export-ignore="true">` góc dưới phải (logo 家 + `https://www.coinguon.io.vn/`). Không cần vẽ watermark trong Stitch.

### Bước 3 — Đăng ký `aspectRatio`

Trong `lib/family-tree/export-system-assets.ts`, thêm vào `KHUNG_BACKGROUNDS`:

```ts
{ file: "khung8.svg", name: "Khung nền 8", aspectRatio: 2000 / 1414 },
```

**Quan trọng:** `aspectRatio` phải khớp **kích thước viewBox** của SVG thật (width ÷ height), không phải kích thước canvas Stitch nếu khác sau khi trace.

Lấy viewBox:

```bash
# ví dụ output: viewBox="0 0 20000 14142"
# aspectRatio = 20000 / 14142
```

### Bước 4 — Kiểm tra trên export

1. `/family-tree` → Xuất ảnh  
2. Nút thư viện ảnh → tab **Có sẵn** → lọc **Nền**  
3. Chọn khung mới → layer **behind-tree** phủ full `borderRect`  
4. Chỉnh cây / câu đối / cuốn thư phía trên  
5. Tải SVG/PNG — watermark góc phải hiển thị đúng

### PNG / WebP thay vì SVG

Có thể upload qua **Thư viện ảnh** (tab tải lên) nếu không đăng ký built-in. Built-in khuyên **SVG** để in sắc nét. Nếu dùng PNG: độ phân giải ≥ **3000×2120 px**.

---

## Vùng an toàn trên khung (layout)

```
┌─────────────────────────────────────────────────────────────┐
│  TOP ~12%  — họa tiết / cuốn thư (app đặt cuốn thư + rồng)   │
├──────┬──────────────────────────────────────────┬───────────┤
│ ~10% │                                          │ ~10%      │
│ câu  │     VÙNG CÂY — giữ phẳng, ít họa tiết     │ câu       │
│ đối  │     (app vẽ nodes + connectors)          │ đối       │
│      │                                          │           │
├──────┴──────────────────────────────────────────┴───────────┤
│  BOTTOM — tránh họa tiết dày góc dưới PHẢI (watermark)      │
└─────────────────────────────────────────────────────────────┘
```

---

## Checklist trước khi import

- [ ] Hướng **ngang**, tỷ lệ ~1,41–1,55
- [ ] Vùng giữa **kem phẳng** — không cây, không chữ
- [ ] Góc dưới phải **đủ trống** cho watermark script
- [ ] Không chữ, logo, watermark trong file gốc
- [ ] Chạy `apply-khung-brand.py` sau khi thêm SVG
- [ ] Cập nhật `export-system-assets.ts` với `aspectRatio` đúng viewBox
- [ ] Test layer **Nền** full khung trên màn export
- [ ] In thử / zoom 25% — viền không vỡ

---

## Gợi ý chỉnh trong Stitch

| Vấn đề | Prompt follow-up |
|--------|------------------|
| Họa tiết che cây | `Enlarge flat cream center to 80% area, move ornaments to outer 10% border only` |
| Thiếu band trên | `Add decorative top header band 12% height, empty center strip for scroll image` |
| Quá hiện đại | `More traditional Vietnamese temple genealogy document, less digital UI` |
| Sai tông | Nhắc lại `#F7F0DD` `#C5A059` `#7c2d12` |
| Watermark bị che | `Simplify bottom-right corner ornament, leave 10% margin clear` |

---

## Tài liệu liên quan

- Viền **thẻ node** nhỏ: [`stitch-export-node-frame-prompts.md`](./stitch-export-node-frame-prompts.md)
- Ảnh minh họa hướng dẫn: [`guide-stitch-prompts.md`](./guide-stitch-prompts.md)
- Thiết kế tính phí export: [`../../docs/export-billing-design.md`](../../docs/export-billing-design.md)
