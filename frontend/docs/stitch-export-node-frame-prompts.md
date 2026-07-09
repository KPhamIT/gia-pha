# Prompt Google Stitch — khung viền thẻ node export phả đồ

Dùng để tạo **nhiều kiểu đường viền** cho thẻ tên thành viên khi xuất ảnh cây gia phả (`/family-tree` → Xuất ảnh).

**Liên quan code:**

| File | Vai trò |
|------|---------|
| `components/family-tree/export/ExportPersonNode.tsx` | Vẽ một thẻ + tên trong SVG export |
| `lib/family-tree/node-card-styles.tsx` | Đăng ký kiểu viền (`NODE_CARD_STYLES`) |
| `components/family-tree/export/TreeExportStyleFields.tsx` | Dropdown **Kiểu viền thẻ** |
| `lib/family-tree/tree-export-settings.ts` | Màu mặc định nền/viền |

**Xuất file đề xuất:** `frontend/public/images/node-frames/node-frame-{id}.svg` (ưu tiên) hoặc `.webp` / `.png`  
**Tỷ lệ:** **3:4** (portrait) — khớp node mặc định **90×120 px**  
**Canvas Stitch đề xuất:** **360×480 px** (4× kích thước export, dễ chỉnh viền)

**Màu mặc định app (có thể đổi trong UI export):**

| Vai trò | Hex |
|---------|-----|
| Nền thẻ | `#F20202` |
| Viền | `#FFEA00` |
| Vàng phụ (hoa văn) | `#C5A059` |

> **Lưu ý:** Chữ tên (dọc/ngang) do app vẽ lên — **không** để tên hoặc chữ trong ảnh Stitch.

---

## Prompt gốc (dán đầu mọi lần tạo)

```
Design a single decorative name card FRAME for a Vietnamese genealogy family tree export (phả đồ / sổ gia phả heritage style).

Technical constraints (strict):
- Canvas: 360×480 px (4× export size; aspect ratio 3:4, portrait)
- The card is a vertical rectangle used for one ancestor name (2–4 Chinese/Vietnamese characters, vertical layout)
- Center area must stay CLEAN for text overlay: inner safe zone ~70% width × 75% height, flat solid fill only
- Outer frame/border: decorative; border thickness ~8–14% of card width on each side
- Colors: deep red fill #F20202 in center, gold/yellow border #FFEA00, optional darker gold #C5A059 for inner line
- Style: traditional Vietnamese–Chinese heritage, ceremonial, elegant — NOT modern app UI, NOT 3D, NOT drop shadow
- Symmetrical on left/right; top and bottom may differ slightly (e.g. stronger top ornament)
- Output: flat vector-like illustration, crisp edges, suitable for SVG trace or PNG with transparent outer background
- NO text, NO names, NO logos, NO watermark
- Show ONE card only, centered on transparent or very dark brown #1C1412 background for preview
- Export-friendly: high contrast between border and fill; no fine noise; corners must survive scaling down to 90×120 px

Deliverable view: front-facing flat card frame, like a label on an official genealogy chart.
```

### Negative prompt (nếu Stitch có ô riêng)

```
text, letters, watermark, photo, 3D, gradient mesh, drop shadow, modern dashboard UI, rounded app button, blurry edges, noise texture
```

---

## Workflow

1. Tạo **một** style mẫu (ví dụ `classic`) trước — chỉnh prompt gốc cho đúng tone đỏ–vàng.
2. Dùng **cùng prompt gốc** + **prompt biến thể** bên dưới cho từng kiểu.
3. Export SVG (ưu tiên) hoặc PNG nền trong suốt.
4. Đặt file vào `public/images/node-frames/`.
5. Thêm entry `render()` trong `node-card-styles.tsx` (hoặc nhờ dev gắn).
6. Kiểm tra zoom **25%** (~90×120) — viền không vỡ, vùng giữa đủ chỗ cho chữ dọc.

---

## Danh sách kiểu viền (12 biến thể)

Mỗi mục: **id** khớp tên file và (sau này) `NODE_CARD_STYLES[].id`.

### 1. `classic` — Cổ điển (đã có trong code, dùng làm chuẩn so sánh)

**File:** `node-frame-classic.svg`

**Prompt biến thể:**

```
Variant: "Cổ điển" — double-line rectangular frame. Outer gold border 2px equivalent, 4px corner radius, inner inset gold line 6px from edge. Minimal ornament. Formal temple document style.
```

---

### 2. `double` — Khung kép

**File:** `node-frame-double.svg`

**Prompt biến thể:**

```
Variant: "Khung kép" — two parallel gold rectangular borders with clear gap between them (3–4px). Slightly thicker outer stroke. Sharp corners, imperial archive aesthetic.
```

---

### 3. `ornate` — Hoa văn góc

**File:** `node-frame-ornate.svg`

**Prompt biến thể:**

```
Variant: "Hoa văn góc" — red center, gold border with traditional corner flourishes only at four corners (curling vine or cloud-scroll motifs). Straight edges between corners. Vietnamese đồ thờ / phả đồ corner style.
```

---

### 4. `cloud` — Mây bo tròn

**File:** `node-frame-cloud.svg`

**Prompt biến thể:**

```
Variant: "Mây bo tròn" — heavily rounded corners (cloud / 祥云 shape). Soft scalloped outer edge like Chinese cloud border. Double thin gold lines following the cloud silhouette. Gentle, ancestral tablet feel.
```

---

### 5. `modern` — Tối giản

**File:** `node-frame-modern.svg`

**Prompt biến thể:**

```
Variant: "Tối giản" — single thin gold stroke, 2px corner radius, no inner line, no ornament. Clean red field. For dense family trees with many nodes.
```

---

### 6. `plain` — Không viền

**File:** `node-frame-plain.svg`

**Prompt biến thể:**

```
Variant: "Không viền" — solid red rectangle only, very subtle 1px gold hairline or none. Large flat fill area. Rounded corners 6px. No decorative frame.
```

---

### 7. `trigram` — Bát quái / âm dương góc

**File:** `node-frame-trigram.svg`

**Prompt biến thể:**

```
Variant: Corner trigrams or simplified yin-yang medallions at top-left and top-right only; thin gold line frame; red center. Restrained, not cluttered. Heritage Taoist genealogy motif.
```

---

### 8. `dragon` — Rồng chầu hai bên

**File:** `node-frame-dragon.svg`

**Prompt biến thể:**

```
Variant: Stylized dragon head silhouettes facing inward on left and right mid-edges only (not full dragon body). Gold line on red. Ceremonial royal genealogy. Keep center 70% empty for vertical name.
```

---

### 9. `lotus` — Hoa sen / lá thiếp

**File:** `node-frame-lotus.svg`

**Prompt biến thể:**

```
Variant: Lotus petal scallops along top and bottom edges; straight vertical sides with simple gold lines. Buddhist–Vietnamese memorial card. Red center, gold #FFEA00 and accent #C5A059.
```

---

### 10. `scroll` — Cuốn thư mini

**File:** `node-frame-scroll.svg`

**Prompt biến thể:**

```
Variant: Top edge styled like a small rolled scroll (cuốn thư) cap; bottom edge flat or with tassel hint. Side borders straight gold lines. Red name field below scroll header band.
```

---

### 11. `filigree` — Khung vàng chạm nổi

**File:** `node-frame-filigree.svg`

**Prompt biến thể:**

```
Variant: Embossed gold filigree border (flat 2D illusion only), baroque East Asian pattern on four sides, red lacquer center. Rich but readable at small size. Avoid micro-details under 4px.
```

---

### 12. `root` — Thẻ đời tổ (thủy tổ)

**File:** `node-frame-root.svg`

**Prompt biến thể:**

```
Variant: "Thủy tổ" ancestor root card — same 3:4 ratio but bolder: triple gold border, thicker top band with sun-ray or flame crown motif. More prominent than child nodes. Red center unchanged.
```

> Node gốc trong export dùng `strokeWidth` dày hơn (2.5 vs 1.5) — frame `root` nên nổi bật hơn các node con.

---

## Prompt tạo bảng so sánh (một lần, 8 ô)

Dùng khi muốn xem nhanh nhiều style trước khi export từng file riêng.

```
Create a comparison sheet of 8 Vietnamese genealogy name-card FRAMES (no text), each 3:4 portrait, on dark brown #1C1412 background.

Grid: 2 rows × 4 columns. Same red fill #F20202 and gold border #FFEA00 palette.

Styles left to right:
1) Classic double line
2) Thick double frame
3) Corner flourishes only
4) Cloud rounded
5) Minimal single stroke
6) Plain fill only
7) Lotus top/bottom scallops
8) Root ancestor triple border with top crown band

Each card identical inner safe zone for vertical name. Flat vector heritage style. Labels below each: style name in small gray text only for the comparison sheet (not on the card art itself).
```

---

## Xuất file & tích hợp vào app

### Cách A — SVG (khuyên dùng)

| Ưu điểm | Scale tốt, chỉnh màu stroke/fill trong code |
| Đường dẫn | `public/images/node-frames/node-frame-{id}.svg` |
| Tích hợp | Trace / tối giản path → thêm `render()` trong `node-card-styles.tsx` |

### Cách B — PNG viền (nền trong suốt ngoài thẻ)

| Ưu điểm | Stitch ra đẹp, hoa văn phức tạp |
| Kích thước | 360×480 hoặc 720×960 |
| Tích hợp | `<image href="..." width={w} height={h} />` trong `NodeCardStyle.render` |

### Cách C — PNG full card (có nền đỏ sẵn)

Chỉ dùng nếu **không** cần đổi màu nền động trong UI export — kém linh hoạt.

### Quy ước đặt tên

```
node-frame-classic.svg
node-frame-double.svg
node-frame-ornate.svg
node-frame-cloud.svg
node-frame-modern.svg
node-frame-plain.svg
node-frame-trigram.svg
node-frame-dragon.svg
node-frame-lotus.svg
node-frame-scroll.svg
node-frame-filigree.svg
node-frame-root.svg
```

### Ví dụ thêm style ảnh vào code (PNG)

```tsx
// lib/family-tree/node-card-styles.tsx — ví dụ minh họa
{
  id: "lotus",
  label: "Hoa sen",
  render: (w, h) => (
    <image
      href="/images/node-frames/node-frame-lotus.webp"
      width={w}
      height={h}
      preserveAspectRatio="none"
    />
  ),
},
```

Với SVG programmatic (hiện tại), `render` nhận `(width, height, fill, stroke, strokeWidth)` — màu nền/viền user chọn vẫn áp dụng qua `<rect>` hoặc `stroke`/`fill` trên path.

---

## Checklist trước khi import

- [ ] Đọc rõ ở **90×120 px** (zoom 25%) — viền không vỡ, không mờ
- [ ] Vùng giữa **phẳng**, không họa tiết che chữ dọc (2–4 ký tự)
- [ ] Viền vàng tách khỏi nền đỏ (contrast đủ)
- [ ] Không có chữ, watermark, logo
- [ ] Đối xứng trái/phải (trừ style có motif một phía, ví dụ cuốn thư)
- [ ] File đặt đúng `public/images/node-frames/`
- [ ] Thêm option trong dropdown **Kiểu viền thẻ** (export panel)

---

## Gợi ý chỉnh trong Stitch

| Vấn đề | Prompt follow-up |
|--------|------------------|
| Viền quá mảnh khi thu nhỏ | `Make border 20% thicker, simplify inner details` |
| Hoa văn che chữ | `Enlarge flat red center safe zone to 75% height, reduce corner ornaments` |
| Sai tông màu | Nhắc lại `#F20202` + `#FFEA00` + `#C5A059` |
| Quá hiện đại | `More traditional Vietnamese temple genealogy document, less app UI` |

---

## Tài liệu liên quan

- Khung **cả trang** A0 (`/images/khung/`): [`stitch-export-khung-prompts.md`](./stitch-export-khung-prompts.md)

Các id sau đã implement bằng SVG thuần trong `node-card-styles.tsx` — có thể dùng làm reference khi so với ảnh Stitch:

| id | Label |
|----|-------|
| `classic` | Cổ điển |
| `double` | Khung kép |
| `ornate` | Hoa văn góc |
| `cloud` | Mây bo tròn |
| `modern` | Tối giản |
| `plain` | Không viền |

Ảnh từ Stitch dùng cho các id **mới** (`trigram`, `dragon`, `lotus`, …) hoặc **thay thế** visual của id cũ nếu đẹp hơn.
