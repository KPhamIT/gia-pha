/**
 * Cập nhật blog production (10/2026) — 29 bài:
 *  - Viết lại 13 bài đang có lượt hiển thị; thêm 16 bài mới.
 *  - Gỡ (published=false) bài nhóm SEO và bài văn mẫu trùng lặp (frontend đã redirect 301).
 *  - Sửa ngày đăng giả (2025) của bài giữ lại về ngày đăng thật 12/07/2026.
 *
 * Mặc định chạy thử. Ghi DB: `node scripts/blog-seo-cleanup-2026-10.mjs --apply`
 * Luôn sao lưu bảng BlogPost ra prisma/backups/ trước khi ghi.
 * Hoàn tác: `node scripts/blog-seo-cleanup-2026-10.mjs --restore prisma/backups/<file>.json`
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { REWRITES_A } from '../prisma/blog-rewrite-2026-10-a.js';
import { REWRITES_B } from '../prisma/blog-rewrite-2026-10-b.js';
import { NEW_POSTS_C } from '../prisma/blog-new-2026-10-c.js';
import { NEW_POSTS_D } from '../prisma/blog-new-2026-10-d.js';
import { NEW_POSTS_E } from '../prisma/blog-new-2026-10-e.js';
import { NEW_POSTS_F } from '../prisma/blog-new-2026-10-f.js';

const REAL_PUBLISHED_AT = new Date('2026-07-12T00:00:00+07:00');
const NEW_PUBLISHED_AT = new Date('2026-10-10T00:00:00+07:00');
const REWRITES = [...REWRITES_A, ...REWRITES_B];
const NEW_POSTS = [...NEW_POSTS_C, ...NEW_POSTS_D, ...NEW_POSTS_E, ...NEW_POSTS_F];

/** Bài giữ nguyên nội dung (không phải văn mẫu), chỉ sửa ngày đăng. */
const KEEP_AS_IS = [
  '5-buoc-tao-va-in-gia-pha-dong-ho-coi-nguon',
  'gia-pha-dong-toc-la-gi-vai-tro-cua-gia-pha-dong-toc-ngay-nay',
  'gia-pha-dong-ho-khai-niem-cau-truc-va-cach-xay-dung',
  'phan-mem-gia-pha-nen-chon-phan-mem-gia-pha-nao-cho-dong-ho',
  'gia-pha-online-la-gi-huong-dan-dung-gia-pha-online-hieu-qua',
  'website-gia-pha-tieu-chi-chon-website-gia-pha-cho-dong-ho',
  'so-gia-pha-truyen-thong-va-so-gia-pha-dien-tu-so-sanh-chi-tiet',
];

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const restoreIdx = args.indexOf('--restore');

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

async function backup() {
  const { rows } = await client.query('select * from "BlogPost" order by id');
  const dir = path.resolve('prisma/backups');
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(dir, `blog-posts-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(rows, null, 1));
  console.log(`Backup ${rows.length} posts → ${file}`);
}

async function restore(file) {
  const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
  const ids = rows.map((r) => r.id);
  await client.query('begin');
  await client.query('delete from "BlogPost" where not (id = any($1))', [ids]);
  for (const r of rows) {
    await client.query(
      `update "BlogPost" set title=$2, excerpt=$3, content=$4, "metaDescription"=$5, category=$6, tags=$7, published=$8, "publishedAt"=$9 where id=$1`,
      [r.id, r.title, r.excerpt, r.content, r.metaDescription, r.category, r.tags, r.published, r.publishedAt],
    );
  }
  await client.query('commit');
  console.log(`Restored ${rows.length} posts from ${file}`);
}

function plan(posts) {
  const existing = new Set(posts.map((p) => p.slug));
  for (const slug of [...REWRITES.map((r) => r.slug), ...KEEP_AS_IS])
    if (!existing.has(slug)) throw new Error(`Không tìm thấy bài: ${slug}`);
  const keep = new Set([...REWRITES, ...NEW_POSTS].map((p) => p.slug).concat(KEEP_AS_IS));
  return {
    unpublish: posts.filter((p) => p.published && !keep.has(p.slug)),
    inserts: NEW_POSTS.filter((p) => !existing.has(p.slug)),
    newUpdates: NEW_POSTS.filter((p) => existing.has(p.slug)),
  };
}

async function upsertPost(post, publishedAt) {
  await client.query(
    `insert into "BlogPost"(slug,title,excerpt,content,"metaDescription",category,tags,published,"publishedAt","updatedAt")
     values ($1,$2,$3,$4,$5,$6,$7,true,$8,now())
     on conflict (slug) do update set title=$2, excerpt=$3, content=$4, "metaDescription"=$5, category=$6, tags=$7, published=true, "publishedAt"=$8, "updatedAt"=now()`,
    [post.slug, post.title, post.excerpt, post.content, post.metaDescription, post.category, post.tags, publishedAt],
  );
}

if (restoreIdx >= 0) {
  await restore(args[restoreIdx + 1]);
  await client.end();
  process.exit(0);
}

const { rows: posts } = await client.query('select id, slug, category, published from "BlogPost"');
const { unpublish, inserts, newUpdates } = plan(posts);
console.log(`Viết lại: ${REWRITES.length} | Bài mới: ${NEW_POSTS.length} (thêm ${inserts.length}, cập nhật ${newUpdates.length})`);
console.log(`Giữ nguyên nội dung (sửa ngày đăng): ${KEEP_AS_IS.length}`);
console.log(`Gỡ: ${unpublish.length} bài (SEO: ${unpublish.filter((p) => p.category === 'SEO').length})`);

if (!apply) {
  console.log('\nDry-run — chưa ghi gì. Thêm --apply để ghi DB.');
  await client.end();
  process.exit(0);
}

await backup();
await client.query('begin');
try {
  await client.query(`update "BlogPost" set published=false, "updatedAt"=now() where id = any($1)`, [unpublish.map((p) => p.id)]);
  for (const post of REWRITES) await upsertPost(post, REAL_PUBLISHED_AT);
  for (const post of NEW_POSTS) await upsertPost(post, NEW_PUBLISHED_AT);
  await client.query(
    `update "BlogPost" set "publishedAt"=$2, published=true where slug = any($1) and "publishedAt" < '2026-07-01'`,
    [KEEP_AS_IS, REAL_PUBLISHED_AT],
  );
  await client.query('commit');
  console.log('Đã ghi DB.');
} catch (error) {
  await client.query('rollback');
  throw error;
} finally {
  await client.end();
}
