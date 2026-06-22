export const CEREMONY_TEMPLATE_VARIABLES = [
  { key: 'person.full_name', label: 'Họ tên người được cúng' },
  { key: 'person.name', label: 'Họ tên (alias)' },
  { key: 'person.birth_date', label: 'Năm sinh' },
  { key: 'person.birth_year', label: 'Năm sinh (alias)' },
  { key: 'person.death_date', label: 'Năm mất' },
  { key: 'person.death_year', label: 'Năm mất (alias)' },
  { key: 'person.birth_place', label: 'Nơi sinh' },
  { key: 'person.current_location', label: 'Nơi ở hiện tại' },
  { key: 'person.grave_cemetery', label: 'Nghĩa trang / mộ' },
  { key: 'person.grave_address', label: 'Địa chỉ mộ (nghĩa trang + địa chỉ)' },
  { key: 'person.grave_notes', label: 'Ghi chú mộ' },
  { key: 'organization.name', label: 'Tên dòng họ / tổ chức' },
  {
    key: 'ceremony.lunar_date',
    label: 'Ngày giỗ âm lịch (đủ: 15 tháng 07 âm lịch)',
  },
  { key: 'ceremony.lunar_day', label: 'Ngày giỗ (âm lịch, số)' },
  { key: 'ceremony.lunar_month', label: 'Tháng giỗ (âm lịch, số)' },
  { key: 'ceremony.lunar_year', label: 'Năm âm lịch hiện tại' },
  { key: 'today.lunar_day', label: 'Hôm nay — ngày âm lịch' },
  { key: 'today.lunar_month', label: 'Hôm nay — tháng âm lịch' },
  { key: 'today.lunar_year', label: 'Hôm nay — năm âm lịch' },
  { key: 'today.lunar_date', label: 'Hôm nay — ngày tháng âm lịch' },
  { key: 'worshipper.full_name', label: 'Tín chủ — họ tên (user liên kết)' },
  { key: 'worshipper.name', label: 'Tín chủ — họ tên (alias)' },
  { key: 'worshipper.address', label: 'Tín chủ — địa chỉ / ngụ tại' },
] as const;

export const DEFAULT_CEREMONY_TEMPLATE_NAME = 'Bài cúng ngày giỗ (mặc định)';

export const DEFAULT_CEREMONY_TEMPLATE = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Bài cúng — {{person.full_name}}</title>
  <style>
    body { font-family: "Noto Serif", Georgia, serif; max-width: 720px; margin: 2rem auto; padding: 1.5rem; line-height: 1.8; color: #1a1a1a; }
    h1 { text-align: center; font-size: 1.5rem; margin-bottom: 1.5rem; }
    .meta { text-align: center; margin-bottom: 2rem; color: #555; }
    .content { white-space: pre-wrap; }
    @media print { body { margin: 0; padding: 1rem; } }
  </style>
</head>
<body>
  <h1>BÀI CÚNG NGÀY GIỖ</h1>
  <p class="meta">{{organization.name}} — {{ceremony.lunar_date}}</p>
  <div class="content">
Kính cúng linh hồn cụ {{person.full_name}}

Hôm nay, ngày {{ceremony.lunar_date}}, con cháu dòng họ {{organization.name}} thành kính dâng lễ vật, thắp hương thành tâm, tưởng nhớ công lao và đức hạnh của cụ.

Cụ sinh năm {{person.birth_date}}, mất năm {{person.death_date}}.

Mộ phần an táng tại {{person.grave_address}}.

Nguyện cầu linh hồn cụ được an lạc, phù hộ con cháu mạnh khỏe, gia đạo hưng thịnh.

Nam mô A Di Đà Phật.
  </div>
</body>
</html>`;

export {
  buildCeremonyVars,
  renderCeremonyTemplate,
} from './build-ceremony-vars.js';
export type { CeremonyVarGroups } from './build-ceremony-vars.js';
