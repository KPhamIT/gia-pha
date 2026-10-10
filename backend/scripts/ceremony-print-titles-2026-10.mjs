/**
 * Thêm cột CeremonyTemplate.printTitle (nếu chưa có) và điền tiêu đề in cho
 * các mẫu bài cúng hệ thống, đặt theo nội dung từng bài.
 *
 * Khớp theo tên mẫu hệ thống (id khác nhau giữa các DB); bỏ qua tên bị trùng.
 * Chỉ ghi khi printTitle đang trống (không đè tiêu đề người dùng đã nhập). Mặc định chạy thử. Ghi DB:
 *   node scripts/ceremony-print-titles-2026-10.mjs --apply
 */
import 'dotenv/config';
import pg from 'pg';

/** [id trên DB demo (tham khảo), tên mẫu, tiêu đề in]. "Tết Trung Nguyên" chưa có nội dung nên bỏ qua. */
const TITLES = [
  [1, 'Cúng ngày Giỗ (Mẫu 1)', 'Văn khấn ngày giỗ'],
  [2, 'Bài cúng thổ công ngày giỗ', 'Văn khấn Thổ công ngày giỗ'],
  [3, 'Bài Cúng Thổ Công Rằm Tháng 7', 'Văn khấn Thổ công rằm tháng Bảy'],
  [4, 'Văn khấn ngày mồng một và ngày rằm hàng tháng (ngày 1 và ngày 15 hàng tháng)', 'Văn khấn mùng Một và ngày Rằm'],
  [5, 'Tết Hạ Nguyên (Tết Cơm mới)', 'Văn khấn Tết Hạ Nguyên (Tết Cơm mới)'],
  [6, 'Tết Đoan Ngọ', 'Văn khấn Tết Đoan Ngọ'],
  [7, 'Tết Hàn Thực (Ngày Mồng 3 Tháng 3)', 'Văn khấn Tết Hàn Thực'],
  [8, 'Tiết Thanh minh - cúng bốc mộ (Từ mồng 5 Đến Mồng 10 Tháng Ba)', 'Văn khấn Tiết Thanh minh tảo mộ'],
  [9, 'Lễ dâng sao giải hạn vào ngày tết Nguyên Tiêu', 'Văn khấn dâng sao giải hạn'],
  [10, 'Lễ Nguyên Tiêu (Lễ Thượng nguyên)', 'Văn khấn Tết Nguyên Tiêu'],
  [12, 'Lễ Tân Gia', 'Văn khấn lễ Tân gia'],
  [13, 'Lễ Nhạp Trạch (lễ dọn vào nhà mới, có thể là nhà tự xây cất hoặc,ngôi nhà', 'Văn khấn lễ Nhập trạch'],
  [14, 'Lễ cúng Mụ (Đầy cữ, đầy tháng, đầy năm)', 'Văn khấn cúng Mụ'],
  [15, 'Cúng ngày Giỗ (Mẫu 2)', 'Văn khấn ngày giỗ'],
  [16, 'Tết Trung Thu', 'Văn khấn Tết Trung Thu'],
  [17, 'Tết Trung Nguyên (Ngày Rằm Tháng 7)', 'Văn khấn gia tiên rằm tháng Bảy'],
  [18, 'Văn khấn lễ hồi hoàn địa mạch', 'Văn khấn lễ hồi hoàn địa mạch'],
  [19, 'Văn khấn lễ khai trương cửa hàng', 'Văn khấn lễ khai trương'],
  [20, 'Văn khấn lễ động thổ', 'Văn khấn lễ động thổ'],
  [21, 'Văn khấn khi cưới gả', 'Văn khấn gia tiên lễ thành hôn'],
  [22, 'Văn Khấn lễ tạ năm mới', 'Văn khấn lễ tạ năm mới'],
  [23, 'Giỗ Tổ Tháng 7', 'Văn khấn giỗ Tổ dòng họ mùa Vu Lan'],
];

const apply = process.argv.includes('--apply');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const { rows: cols } = await client.query(
  `select 1 from information_schema.columns
   where table_name = 'CeremonyTemplate' and column_name = 'printTitle'`,
);
const hasColumn = cols.length > 0;
console.log(`Cột printTitle: ${hasColumn ? 'đã có' : 'CHƯA có — sẽ thêm'}`);

const { rows } = await client.query(
  `select id, name ${hasColumn ? ', "printTitle"' : ', null as "printTitle"'}
   from "CeremonyTemplate" where "isSystemTemplate" = true`,
);
const byName = new Map();
for (const r of rows) byName.set(r.name, [...(byName.get(r.name) ?? []), r]);

const updates = [];
for (const [, name, title] of TITLES) {
  const matches = byName.get(name) ?? [];
  if (matches.length === 0) console.log(`  "${name}": không có trong DB — bỏ qua`);
  else if (matches.length > 1) console.log(`  "${name}": trùng ${matches.length} mẫu — bỏ qua`);
  else if (matches[0].printTitle) console.log(`  "${name}": đã có tiêu đề "${matches[0].printTitle}" — giữ nguyên`);
  else updates.push([matches[0].id, title, name]);
}
for (const [id, title, name] of updates) console.log(`  #${id} ${name} → ${title}`);
console.log(`${updates.length}/${TITLES.length} mẫu sẽ được điền tiêu đề.`);

if (!apply) {
  console.log('Chạy thử — chưa ghi gì. Thêm --apply để ghi.');
} else {
  await client.query('begin');
  await client.query(
    'ALTER TABLE "CeremonyTemplate" ADD COLUMN IF NOT EXISTS "printTitle" TEXT',
  );
  for (const [id, title] of updates) {
    await client.query(
      'update "CeremonyTemplate" set "printTitle" = $2 where id = $1 and "printTitle" is null',
      [id, title],
    );
  }
  await client.query('commit');
  console.log('Đã ghi.');
}
await client.end();
