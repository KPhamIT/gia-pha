# SEO Architecture — Cội Nguồn

Tài liệu mô tả kiến trúc SEO tập trung cho frontend Next.js (App Router).

## Tổng quan

Mọi metadata, Open Graph, Twitter Card, canonical URL và JSON-LD đều xuất phát từ **một cấu hình thương hiệu duy nhất**:

| File | Vai trò |
|------|---------|
| `config/site.ts` | Brand, site name, URL, title/description mặc định, keywords, logo, OG image |
| `lib/seo/` | Helper tạo metadata, canonical, robots, OG, Twitter, JSON-LD graph |
| `lib/schema/` | Generator Schema.org theo loại nội dung |
| `components/seo/` | Component render JSON-LD (`JsonLd`, `SeoSchemas`) |

**Không hard-code** brand, domain, hoặc canonical URL trong page/component.

## Thương hiệu

| Khái niệm | Giá trị |
|-----------|---------|
| Brand | Cội Nguồn |
| Website | Cội Nguồn - Gia phả điện tử |
| URL chính thức | https://www.coinguon.io.vn |

## Luồng metadata

```
config/site.ts
       ↓
lib/seo/createMetadata()  ←── page export metadata / generateMetadata
       ↓
Next.js <head>  (title, description, canonical, robots, OG, Twitter)
```

### Root layout

`app/layout.tsx` dùng `createRootMetadata()`:

- `metadataBase` → domain từ `getSiteUrl()`
- `title.template` → `%s | Cội Nguồn`
- `title.default` → title trang chủ
- Robots mặc định: index, follow, max-snippet:-1, max-image-preview:large

### Trang con

```typescript
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Giới thiệu",
  description: "...",
  path: "/gioi-thieu",
  keywords: ["..."],       // optional — merge với keywords site
  pageType: "webpage",     // optional — ảnh hưởng JSON-LD
  type: "article",         // optional — cho blog
  publishedAt: "...",      // optional — Article schema
  titleAbsolute: true,     // optional — không thêm suffix brand
  noIndex: true,           // optional
});
```

`createMetadata()` tự sinh:

- Title (hoặc `{ absolute }` / template)
- Description, keywords
- Canonical + `alternates.languages`
- Robots (Googlebot directives)
- Open Graph (siteName = brand, locale vi_VN, default OG image)
- Twitter Card (`summary_large_image`)

## Luồng JSON-LD

```
Page props (path, title, description, pageType, faq, …)
       ↓
lib/seo/json-ld.ts → generatePageJsonLd()
       ↓
lib/schema/index.ts → generateSchemaGraph()
       ↓
components/seo/SeoSchemas.tsx → JsonLd (next/script)
```

Một `<Script type="application/ld+json">` duy nhất mỗi page, gom nhiều schema trong `@graph` khi cần.

### Mapping loại trang → schema

| `pageType` | Schema |
|------------|--------|
| `home` | Organization, WebSite, WebPage, SoftwareApplication, BreadcrumbList |
| `article` | WebPage, BreadcrumbList, Article (+ FAQPage nếu có `faq`) |
| `collection` | WebPage, BreadcrumbList, CollectionPage |
| `contact` | WebPage, BreadcrumbList, ContactPage |
| `software` | WebPage, BreadcrumbList, SoftwareApplication |
| `guide` | WebPage, BreadcrumbList (+ HowTo riêng nếu page truyền thêm) |
| `webpage` (default) | WebPage, BreadcrumbList |

### BreadcrumbList

Tự sinh từ `path` qua `breadcrumbsFromPath()`. Override bằng prop `breadcrumbs` trên `SeoSchemas`.

## Thêm trang mới

1. Export metadata:

```typescript
export const metadata = createMetadata({
  title: "Tiêu đề trang",
  description: "Mô tả",
  path: "/duong-dan",
});
```

2. Render schema trong page component:

```tsx
<SeoSchemas
  path="/duong-dan"
  title="Tiêu đề trang"
  description="Mô tả"
/>
```

3. Thêm path vào `app/sitemap.ts` nếu là trang public indexable.

4. Thêm nhãn segment vào `PATH_SEGMENT_LABELS` trong `lib/schema/breadcrumb.ts` (nếu cần tên breadcrumb tiếng Việt).

## Thêm loại nội dung mới

1. Tạo generator trong `lib/schema/<type>.ts`
2. Đăng ký trong `lib/schema/index.ts` (`SchemaPayload` + `generateSchema`)
3. Thêm case trong `lib/seo/json-ld.ts` → `pageTypeSchemas()`
4. Thêm `pageType` vào `lib/seo/types.ts` nếu cần

Ví dụ tương lai: `AncestorProfile`, `Memorial`, `Event` — chỉ cần schema file + mapping, không sửa logic metadata cốt lõi.

## FAQ trên bài viết

Truyền `faq` vào `createMetadata` (metadata) và `SeoSchemas`:

```typescript
faq: [
  { question: "Câu hỏi?", answer: "Trả lời." },
],
```

Tự động thêm `FAQPage` schema.

## Article / Blog

`app/bai-viet/[slug]/page.tsx`:

- `generateMetadata()` với `type: "article"`, `publishedAt`, `updatedAt`
- `SeoSchemas` với `pageType: "article"`

## Sitemap & Robots

| File | Nội dung |
|------|----------|
| `app/sitemap.ts` | Trang marketing + blog; mỗi entry có `lastModified`, `changeFrequency`, `priority` |
| `app/robots.ts` | Allow `/`, disallow app/auth routes; `host` + `sitemap` URL |

Không đưa `/login`, `/join`, `/book`, `/family-tree` vào sitemap.

## OG Image mặc định

- Config: `SITE.defaultOgImagePath` → `/icons/pwa-512` (512×512 PNG)
- Mọi trang dùng ảnh này trừ khi truyền `image` riêng trong `createMetadata()`

## Best practices

- Dùng `createMetadata()` / `SeoSchemas` — không copy-paste OG/canonical
- Title trang con: chỉ truyền phần cụ thể (template thêm `| Cội Nguồn`)
- Trang chủ: `titleAbsolute: true` + `SITE.title`
- Trang private/share: `noIndex: true`
- Một `JsonLd` / `SeoSchemas` mỗi page — tránh duplicate schema
- UI strings (`ui-strings/`) cho nội dung hiển thị; SEO strings trong `config/site.ts` hoặc page metadata

## Kiểm tra sau deploy

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- Facebook Sharing Debugger / Twitter Card Validator
- Lighthouse SEO audit

## Biến môi trường

| Biến | Mục đích |
|------|----------|
| `NEXT_PUBLIC_SITE_URL` | Override canonical URL (staging) |
| `NEXT_PUBLIC_VERCEL_URL` | Preview deployments only |

Production mặc định: `https://www.coinguon.io.vn`
