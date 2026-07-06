# Prompt Google Stitch — ảnh minh họa trang Hướng dẫn

Dùng cho `/huong-dan`. Mỗi ảnh khớp `imageCaption` trong `lib/constants/ui-strings/guide.ts`.

**Xuất file:** `frontend/public/images/guide/guide-{section}-{n}.webp`  
**Tỷ lệ:** 16:9 (khớp `aspect-video` trong `GuideImagePlaceholder`)  
**Độ phân giải đề xuất:** 1280×720 hoặc 1600×900

---

## Prompt gốc — Mobile (dán đầu mọi lần tạo ảnh)

```
Mobile UI screenshot mockup for Vietnamese genealogy web app "Cội Nguồn" (coinguon.io.vn). Heritage Modernism design: warm cream background #fcf9f4, dark brown serif headings #321716, body text #504443, muted labels #827472, accent amber #944a00. White rounded-xl cards with subtle border #d4c3c1. Clean modern Vietnamese UI, realistic product screenshot style, no watermark, no device bezel unless specified. All UI text in Vietnamese. Use fictional Vietnamese family names (Nguyễn Văn An, Trần Thị Lan…). Aspect ratio 16:9, high resolution, sharp typography.
```

## Prompt gốc — Desktop (ảnh in / xuất cây)

```
Desktop web app UI screenshot mockup, browser chrome minimal, for Vietnamese genealogy web app "Cội Nguồn" (coinguon.io.vn). Heritage Modernism design: warm cream background #fcf9f4, dark brown serif headings #321716, body text #504443, muted labels #827472, accent amber #944a00. White rounded-xl cards with subtle border #d4c3c1. Clean modern Vietnamese UI, realistic product screenshot style, no watermark. All UI text in Vietnamese. Use fictional Vietnamese family names. Aspect ratio 16:9, high resolution, sharp typography.
```

---

## Workflow

1. Tạo ảnh mẫu `guide-intro-1.webp` trước, chỉnh prompt gốc cho đúng tone.
2. Dùng **cùng prompt gốc** + **prompt bổ sung** bên dưới cho từng ảnh.
3. Ảnh desktop: `guide-book-3`, `guide-tree-4` — dùng prompt gốc Desktop.
4. Sau khi export, thêm `imageSrc` vào `guide.ts` và cập nhật `GuideImagePlaceholder`.

---

## Danh sách ảnh (25)

### Section `intro` — Gia phả điện tử là gì?

#### `guide-intro-1.webp`
**Caption:** Màn hình chào mừng / trang sổ gia phả lần đầu mở.  
**Device:** Mobile

**Prompt bổ sung:**
```
iPhone Safari full screen. Genealogy book welcome page: vintage cream paper cover, serif title "Họ Nguyễn — Phả đồ", subtitle "Dòng họ Nguyễn Văn". App background cream #fcf9f4. Bottom-left circular FAB with + icon in deep amber. Faint bottom navigation with 4 icons (Book, Tree, Events, Account). Warm, dignified first-visit feeling.
```

#### `guide-intro-2.webp`
**Caption:** Tổng quan menu điều hướng (nút + góc màn hình).  
**Device:** Mobile

**Prompt bổ sung:**
```
Same cream app background. Bottom-left FAB menu open: white rounded panel listing "Sổ gia phả", "Cây gia phả", "Sự kiện", "Ngày giỗ sắp tới", "Tài khoản", "Thông báo" with simple line icons, Vietnamese labels. + button rotated 45° to ×. Blurred book page behind.
```

---

### Section `start` — Bắt đầu — mở liên kết dòng họ

#### `guide-start-1.webp`
**Caption:** Tin nhắn Zalo/Facebook có liên kết join.  
**Device:** Mobile

**Prompt bổ sung:**
```
Phone showing generic messaging app (no brand logos). Chat bubble: "Chào cả nhà, link xem phả đồ dòng họ: coinguon.io.vn/join/abc123". Finger about to tap the blue link. Soft cream outer background, focus on join link. Instructional marketing style.
```

#### `guide-start-2.webp`
**Caption:** Menu + đang mở với các lựa chọn.  
**Device:** Mobile

**Prompt bổ sung:**
```
FAB menu fully open, bottom-left. Highlight "Sổ gia phả" item with #f6f3ee background. Mobile status bar visible. Menu items clearly readable in Vietnamese. Same Heritage Modernism palette.
```

#### `guide-start-3.webp`
**Caption:** Hộp chọn nhánh khi vào cây gia phả.  
**Device:** Mobile

**Prompt bổ sung:**
```
Modal or bottom sheet centered: serif title "Chọn nhánh của bạn", radio list "Nhánh trưởng", "Nhánh thứ", "Nhánh Nguyễn Văn" (one selected). Primary button "Tiếp tục" #321716. Blurred family tree behind.
```

---

### Section `book` — Sổ gia phả

#### `guide-book-1.webp`
**Caption:** Một trang thông tin trong sổ gia phả.  
**Device:** Mobile

**Prompt bổ sung:**
```
Open book spread: left page oval portrait placeholder, right page member profile "Nguyễn Văn Bình", "Đời thứ 8", "Nhánh trưởng", birth date, short biography. Cream paper texture, subtle decorative border. Thin app header with lineage name and search icon.
```

#### `guide-book-2.webp`
**Caption:** Hộp tìm kiếm và kết quả.  
**Device:** Mobile

**Prompt bổ sung:**
```
Search overlay on book view: input "Tìm theo họ tên…" with cursor, dropdown 3 results "Nguyễn Văn An", "Nguyễn Thị Mai"… One result highlighted amber #944a00. Magnifying glass icon.
```

#### `guide-book-3.webp`
**Caption:** Nút in trang / in toàn bộ trên thanh sổ.  
**Device:** Desktop

**Prompt bổ sung:**
```
Book viewer header toolbar: search, print page (highlighted), print all icons. Small tooltip "In trang này". Desktop browser width. Heritage Modernism styling.
```

#### `guide-book-4.webp`
**Caption:** Chuyển từ sổ sang cây.  
**Device:** Mobile

**Prompt bổ sung:**
```
Split composition: left third shows book page, right two-thirds family tree nodes. Arrow or menu item "Cây gia phả" highlighted in open + menu. Transition between book and tree views.
```

---

### Section `tree` — Cây gia phả

#### `guide-tree-1.webp`
**Caption:** Cây gia phả với vài thế hệ.  
**Device:** Mobile

**Prompt bổ sung:**
```
Vertical family tree 4 generations, white rounded node cards, Vietnamese names, small male/female icons. Connector lines #d4c3c1. Cream background. FAB + bottom-left. Zoom controls top-right.
```

#### `guide-tree-2.webp`
**Caption:** Bộ lọc nhánh / đời trên cây.  
**Device:** Mobile

**Prompt bổ sung:**
```
Top filter bar: chip "Nhánh trưởng", dropdown "Hiển thị đời: 5", button "Áp dụng". Tree below shows fewer nodes after filtering.
```

#### `guide-tree-3.webp`
**Caption:** Tìm kiếm và focus vào một node.  
**Device:** Mobile

**Prompt bổ sung:**
```
Search panel with "Trần Văn Hùng" selected. Tree centers on that node with #944a00 ring highlight. Other nodes slightly faded.
```

#### `guide-tree-4.webp`
**Caption:** Hộp thoại xuất ảnh cây gia phả.  
**Device:** Desktop

**Prompt bổ sung:**
```
Modal "Xuất ảnh cây gia phả": tree preview thumbnail, toggle "Ẩn tên con dâu", quality slider, button "Tải PNG" #321716. Desktop mockup.
```

---

### Section `person` — Hồ sơ thành viên

#### `guide-person-1.webp`
**Caption:** Sheet chi tiết một thành viên.  
**Device:** Mobile

**Prompt bổ sung:**
```
Bottom sheet 80% screen: avatar, "Lê Văn Cường", tabs "Thông tin" / "Quan hệ" (Quan hệ active). List Father, Mother, Spouse, Children — tappable rows. Cream background, white cards.
```

#### `guide-person-2.webp`
**Caption:** Form chỉnh sửa thông tin thành viên.  
**Device:** Mobile

**Prompt bổ sung:**
```
Full-screen edit form: fields Họ tên, Ngày sinh, Tiểu sử, Mộ phần. Save button #321716 top-right. Inputs border #d4c3c1. Visible only for users with edit permission.
```

---

### Section `events` — Sự kiện dòng họ

#### `guide-events-1.webp`
**Caption:** Danh sách sự kiện dòng họ.  
**Device:** Mobile

**Prompt bổ sung:**
```
Events landing page: small hero "Sự kiện dòng họ", bento cards "Họp họ 2026", "Giỗ tổ", badge "Thu đóng góp" #944a00. Optional calendar sidebar. Match Events page Heritage Modernism redesign.
```

#### `guide-events-2.webp`
**Caption:** Bảng đóng góp theo từng người.  
**Device:** Mobile

**Prompt bổ sung:**
```
Contribution table: columns Họ tên, Số tiền, Trạng thái chips "Đã nộp" green / "Chưa nộp" gray. Header total "Đã thu: 15.000.000 ₫". White card on cream background.
```

#### `guide-events-3.webp`
**Caption:** Danh sách công đức của một sự kiện.  
**Device:** Mobile

**Prompt bổ sung:**
```
Merit ledger list: donor name, amount or gift, date, note. Header "Sổ công đức — Họp họ 2026". Dignified ledger style, not overly antique.
```

---

### Section `ceremonies` — Ngày giỗ & bài cúng

#### `guide-ceremonies-1.webp`
**Caption:** Trang ngày giỗ sắp tới.  
**Device:** Mobile

**Prompt bổ sung:**
```
Upcoming memorial days list: card "Giỗ cụ Nguyễn Văn A — 12/8 âm lịch", badge "Còn 3 ngày" amber. Hero eyebrow "Lễ nghi". Match /ceremonies/upcoming landing style.
```

#### `guide-ceremonies-2.webp`
**Caption:** Trang bài cúng và nút in / chia sẻ.  
**Device:** Mobile

**Prompt bổ sung:**
```
Ceremony text on cream paper #FAF7F2, traditional serif typography. Toolbar buttons "In trực tiếp", "Chia sẻ" outline #321716.
```

#### `guide-ceremonies-3.webp`
**Caption:** Màn hình cài đặt thông báo.  
**Device:** Mobile

**Prompt bổ sung:**
```
Notification settings page: toggles "Nhắc ngày giỗ" on, "Thông báo trình duyệt" on. White cards, labels #827472. Hero "Cài đặt thông báo". Landing account theme.
```

---

### Section `account` — Tài khoản & đăng nhập

#### `guide-account-1.webp`
**Caption:** Trang đăng nhập.  
**Device:** Mobile

**Prompt bổ sung:**
```
Centered login card: "Cội Nguồn" logo, "Đăng nhập bằng Facebook" blue button, helper text "Xem gia phả không cần đăng nhập nếu có link dòng họ". Full cream background.
```

#### `guide-account-2.webp`
**Caption:** Chọn thành viên để liên kết tài khoản.  
**Device:** Mobile

**Prompt bổ sung:**
```
Account page section "Liên kết thành viên": search box + selectable list "Phạm Thị Hoa" checked, button "Lưu liên kết" #321716.
```

#### `guide-account-3.webp`
**Caption:** Mục sao chép liên kết chia sẻ trong Tài khoản admin.  
**Device:** Mobile

**Prompt bổ sung:**
```
Admin card "Liên kết xem gia phả": readonly URL field, "Sao chép" button with icon, hint "Gửi qua Zalo, Facebook". Badge "Quản trị viên".
```

---

### Section `tips` — Mẹo dùng trên điện thoại

#### `guide-tips-1.webp`
**Caption:** Thêm website vào màn hình chính điện thoại.  
**Device:** Mobile (OS UI)

**Prompt bổ sung:**
```
iPhone Safari share sheet with "Thêm vào Màn hình chính" highlighted, or Android Chrome "Thêm vào màn hình chính". Small home screen preview with "Cội Nguồn" shortcut icon. Instructional, minimal app UI.
```

---

## Lưu ý

- **Chữ tiếng Việt:** Stitch có thể sai dấu — sửa sau bằng Figma nếu cần chính xác.
- **Không logo Zalo/Facebook** trong ảnh chat — dùng generic messaging app.
- **Tên họ giả** — không dùng ảnh người thật.
- **FAB góc dưới trái** (không phải phải), khớp `TreeFab.tsx`.
- **Bottom nav** trên các trang landing mới (`GlobalMobileChrome`).

## Gắn ảnh vào code (sau khi có file)

Trong `guide.ts`, thêm field tùy chọn:

```ts
imageSrc?: string;
// ví dụ:
imageCaption: "Màn hình chào mừng / trang sổ gia phả lần đầu mở.",
imageSrc: "/images/guide/guide-intro-1.webp",
```

Cập nhật `GuideImagePlaceholder` để render `<Image>` khi có `imageSrc`.
