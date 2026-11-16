/**
 * Cập nhật blog production (11/2026) — cụm "cách tính đời":
 *  - Viết lại 2 bài đang có lượt hiển thị (giữ nguyên publishedAt, chỉ đổi nội dung + updatedAt).
 *  - Thêm 2 bài mới (NEW_POSTS_G).
 *
 * Mặc định chạy thử. Ghi DB: `node scripts/blog-seo-2026-11.mjs --apply`
 * Luôn sao lưu bảng BlogPost ra prisma/backups/ trước khi ghi.
 * Hoàn tác: `node scripts/blog-seo-cleanup-2026-10.mjs --restore prisma/backups/<file>.json`
 * Sau khi ghi: tăng BLOG_CACHE_VERSION trong frontend/lib/blog/server-api.ts rồi deploy.
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { REWRITES_A } from '../prisma/blog-rewrite-2026-10-a.js';
import { NEW_POSTS_G } from '../prisma/blog-new-2026-11-g.js';

const REWRITE_SLUGS = [
  'the-he-chi-nhanh-trong-gia-pha-dong-ho-giai-thich-de-hieu',
  'gia-pha-3-doi-5-doi-la-gi-cach-ghi-dung-the-he',
];
const REWRITES = REWRITES_A.filter((p) => REWRITE_SLUGS.includes(p.slug));
const NEW_PUBLISHED_AT = new Date();

const apply = process.argv.includes('--apply');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const { rows: posts } = await client.query('select slug, title, published from "BlogPost" where slug = any($1)', [
  [...REWRITE_SLUGS, ...NEW_POSTS_G.map((p) => p.slug)],
]);
const bySlug = new Map(posts.map((p) => [p.slug, p]));
for (const slug of REWRITE_SLUGS) if (!bySlug.get(slug)?.published) throw new Error(`Không tìm thấy bài đang đăng: ${slug}`);

for (const post of REWRITES) console.log(`Viết lại: ${bySlug.get(post.slug).title}\n       → ${post.title}`);
for (const post of NEW_POSTS_G) console.log(`${bySlug.has(post.slug) ? 'Cập nhật' : 'Thêm'}: ${post.title}`);

if (!apply) {
  console.log('\nDry-run — chưa ghi gì. Thêm --apply để ghi DB.');
  await client.end();
  process.exit(0);
}

const { rows: all } = await client.query('select * from "BlogPost" order by id');
const dir = path.resolve('prisma/backups');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `blog-posts-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
fs.writeFileSync(file, JSON.stringify(all, null, 1));
console.log(`Backup ${all.length} posts → ${file}`);

await client.query('begin');
try {
  for (const p of REWRITES) {
    await client.query(
      `update "BlogPost" set title=$2, excerpt=$3, content=$4, "metaDescription"=$5, category=$6, tags=$7, "updatedAt"=now() where slug=$1`,
      [p.slug, p.title, p.excerpt, p.content, p.metaDescription, p.category, p.tags],
    );
  }
  for (const p of NEW_POSTS_G) {
    await client.query(
      `insert into "BlogPost"(slug,title,excerpt,content,"metaDescription",category,tags,published,"publishedAt","updatedAt")
       values ($1,$2,$3,$4,$5,$6,$7,true,$8,now())
       on conflict (slug) do update set title=$2, excerpt=$3, content=$4, "metaDescription"=$5, category=$6, tags=$7, published=true, "updatedAt"=now()`,
      [p.slug, p.title, p.excerpt, p.content, p.metaDescription, p.category, p.tags, NEW_PUBLISHED_AT],
    );
  }
  await client.query('commit');
  console.log('Đã ghi DB.');
} catch (error) {
  await client.query('rollback');
  throw error;
} finally {
  await client.end();
}
