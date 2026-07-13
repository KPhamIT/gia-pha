import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../dist/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { loadCeremonyTemplatesFromPdf } from './ceremony-pdf-seed-data.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL ?? '',
  max: 1,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

function defaultExportSettings() {
  return {
    backgroundColor: '#f7f0dd',
    borderStyleId: 'classic',
    borderColor: '#7c2d12',
    headerHeight: 420,
    scroll: { x: null, y: null, width: null, height: null, visible: true },
    dragonLeft: { x: null, y: null, width: null, height: null, visible: true },
    dragonRight: { x: null, y: null, width: null, height: null, visible: true },
    coupletLeft: {
      x: 155.16116273557986,
      y: 469.2951402540331,
      width: null,
      height: null,
      visible: true,
      text: 'Tổ Tiên Công Đức Thiên Niên Thịnh',
    },
    coupletRight: {
      x: null,
      y: 459.6610154981737,
      width: null,
      height: null,
      visible: true,
      text: 'Tử Hiếu Tôn Hiền Vạn Đại Vinh',
    },
    coupletFontId: 'thanhcong',
    coupletColor: '#7f1d1d',
    coupletFontSize: 62,
    nodeBgColor: '#f20202',
    nodeTextColor: '#ffdd00',
    nodeBorderColor: '#ffea00',
    nodeBorderStyleId: 'ornate',
    nodeFontSize: 20,
  };
}

function exportPreset(id, label, overrides = {}) {
  return { id, label, settings: { ...defaultExportSettings(), ...overrides } };
}

function buildExportPresets() {
  return [
    exportPreset('traditional-red', 'Truyền thống đỏ vàng'),
    exportPreset('elegant-blue', 'Thanh lịch xanh lam', {
      backgroundColor: '#eef3fb',
      borderStyleId: 'double',
      borderColor: '#1e3a8a',
      coupletColor: '#1e3a8a',
      coupletFontSize: 56,
      nodeBgColor: '#0f4c81',
      nodeTextColor: '#fef3c7',
      nodeBorderColor: '#facc15',
      nodeBorderStyleId: 'classic',
      nodeFontSize: 19,
    }),
    exportPreset('monochrome', 'Đơn sắc hiện đại', {
      backgroundColor: '#f8f8f8',
      borderStyleId: 'modern',
      borderColor: '#111827',
      coupletColor: '#111827',
      coupletFontSize: 54,
      nodeBgColor: '#111827',
      nodeTextColor: '#f9fafb',
      nodeBorderColor: '#374151',
      nodeBorderStyleId: 'plain',
      nodeFontSize: 18,
    }),
    exportPreset('imperial-gold', 'Hoàng kim cung đình', {
      backgroundColor: '#f6ead2',
      borderStyleId: 'double',
      borderColor: '#a16207',
      coupletColor: '#854d0e',
      coupletFontSize: 58,
      nodeBgColor: '#b45309',
      nodeTextColor: '#fef3c7',
      nodeBorderColor: '#facc15',
      nodeBorderStyleId: 'ornate',
      nodeFontSize: 19,
    }),
    exportPreset('jade-emerald', 'Ngọc bích phú quý', {
      backgroundColor: '#eef7f1',
      borderStyleId: 'cloud',
      borderColor: '#166534',
      coupletColor: '#166534',
      coupletFontSize: 56,
      nodeBgColor: '#065f46',
      nodeTextColor: '#ecfccb',
      nodeBorderColor: '#4ade80',
      nodeBorderStyleId: 'cloud',
      nodeFontSize: 18,
    }),
    exportPreset('royal-purple', 'Tím hoàng gia', {
      backgroundColor: '#f4eefc',
      borderStyleId: 'ornate',
      borderColor: '#581c87',
      coupletColor: '#6b21a8',
      coupletFontSize: 58,
      nodeBgColor: '#4c1d95',
      nodeTextColor: '#fef9c3',
      nodeBorderColor: '#c084fc',
      nodeBorderStyleId: 'double',
      nodeFontSize: 19,
    }),
    exportPreset('ink-classic', 'Mực tàu cổ thư', {
      backgroundColor: '#f3f0ea',
      borderStyleId: 'classic',
      borderColor: '#1f2937',
      coupletColor: '#111827',
      coupletFontSize: 54,
      nodeBgColor: '#1f2937',
      nodeTextColor: '#f9fafb',
      nodeBorderColor: '#6b7280',
      nodeBorderStyleId: 'modern',
      nodeFontSize: 18,
    }),
    exportPreset('sunset-bronze', 'Hoàng hôn đồng đỏ', {
      backgroundColor: '#fdf2e8',
      borderStyleId: 'double',
      borderColor: '#9a3412',
      coupletColor: '#9a3412',
      coupletFontSize: 57,
      nodeBgColor: '#b45309',
      nodeTextColor: '#fff7ed',
      nodeBorderColor: '#fb923c',
      nodeBorderStyleId: 'classic',
      nodeFontSize: 19,
    }),
    exportPreset('navy-gold', 'Lam ngọc kim tuyến', {
      backgroundColor: '#eef2ff',
      borderStyleId: 'classic',
      borderColor: '#1e40af',
      coupletColor: '#1d4ed8',
      coupletFontSize: 56,
      nodeBgColor: '#1e3a8a',
      nodeTextColor: '#fef3c7',
      nodeBorderColor: '#facc15',
      nodeBorderStyleId: 'ornate',
      nodeFontSize: 19,
    }),
    exportPreset('rose-ceremony', 'Hồng ngọc lễ nghi', {
      backgroundColor: '#fff1f2',
      borderStyleId: 'cloud',
      borderColor: '#9f1239',
      coupletColor: '#9f1239',
      coupletFontSize: 56,
      nodeBgColor: '#9f1239',
      nodeTextColor: '#fff7ed',
      nodeBorderColor: '#fb7185',
      nodeBorderStyleId: 'double',
      nodeFontSize: 18,
    }),
    exportPreset('ivory-minimal', 'Ngà tối giản cao cấp', {
      backgroundColor: '#fafaf9',
      borderStyleId: 'modern',
      borderColor: '#44403c',
      coupletColor: '#44403c',
      coupletFontSize: 54,
      nodeBgColor: '#57534e',
      nodeTextColor: '#fafaf9',
      nodeBorderColor: '#a8a29e',
      nodeBorderStyleId: 'modern',
      nodeFontSize: 18,
    }),
  ];
}

async function ensureOrganization() {
  const existing = await prisma.organization.findFirst({
    where: { name: 'Họ Phạm' },
  });
  if (existing) return existing;

  const organization = await prisma.organization.create({
    data: { name: 'Họ Phạm' },
  });
  console.log('Created organization:', organization.name);
  return organization;
}

function ceremonyTemplateData(organizationId, template, isDefault) {
  return {
    organizationId,
    name: template.name,
    content: template.content,
    intro: template.intro,
    meaning: template.meaning,
    preparation: template.preparation,
    sourceBookTitle: template.sourceBookTitle,
    seoSlug: template.seoSlug,
    seoTitle: template.seoTitle,
    seoDescription: template.seoDescription,
    seoExcerpt: template.seoExcerpt,
    seoKeywords: template.seoKeywords,
    isDefault,
    isSystemTemplate: true,
  };
}

async function upsertCeremonyTemplate(existing, data) {
  if (existing) {
    await prisma.ceremonyTemplate.update({ where: { id: existing.id }, data });
    return;
  }
  await prisma.ceremonyTemplate.create({ data });
}

async function seedCeremonyTemplates(organizationId) {
  const existingTemplates = await prisma.ceremonyTemplate.findMany({
    where: { organizationId },
    select: { id: true, name: true, isDefault: true },
  });
  const templatesFromBook = await loadCeremonyTemplatesFromPdf();
  let seededCount = 0;

  for (let i = 0; i < templatesFromBook.length; i += 1) {
    const template = templatesFromBook[i];
    const existing = existingTemplates.find(
      (item) => item.name === template.name,
    );
    const isDefault =
      existingTemplates.length === 0 && i === 0
        ? true
        : (existing?.isDefault ?? false);
    await upsertCeremonyTemplate(
      existing,
      ceremonyTemplateData(organizationId, template, isDefault),
    );
    seededCount += 1;
  }

  console.log(`Seeded ${seededCount} ceremony templates from PDF`);
}

async function ensureDefaultCeremonyTemplate(organizationId) {
  const hasDefault = await prisma.ceremonyTemplate.findFirst({
    where: { organizationId, isDefault: true },
    select: { id: true },
  });
  if (hasDefault) return;

  const fallback = await prisma.ceremonyTemplate.findFirst({
    where: { organizationId },
    orderBy: { id: 'asc' },
    select: { id: true },
  });
  if (!fallback) return;

  await prisma.ceremonyTemplate.update({
    where: { id: fallback.id },
    data: { isDefault: true },
  });
}

async function seedRootPerson(organizationId) {
  const existingRoot = await prisma.person.findFirst({
    where: { organizationId, fullName: 'Thủy Tổ' },
  });
  if (existingRoot) {
    console.log('Root person already exists');
    return;
  }

  const rootPerson = await prisma.person.create({
    data: {
      organizationId,
      fullName: 'Thủy Tổ',
      gender: 'male',
      generation: 0,
      branch: 1,
    },
  });
  console.log('Created root person:', rootPerson.fullName);
}

async function ensureDevUser() {
  const existing = await prisma.user.findFirst({
    where: { provider: 'dev', providerId: 'dev-local' },
  });
  if (existing) return existing;

  const devUser = await prisma.user.create({
    data: { provider: 'dev', providerId: 'dev-local', role: 'STANDARD' },
  });
  console.log('Created dev user for settings seeding');
  return devUser;
}

async function resolvePrimaryOrg(fallbackOrg) {
  return (
    (await prisma.organization.findFirst({ where: { name: 'Family Tree' } })) ??
    fallbackOrg
  );
}

async function seedAdminUser(fallbackOrg) {
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const primaryOrg = await resolvePrimaryOrg(fallbackOrg);

  await prisma.user.upsert({
    where: { providerId: 'local:admin' },
    create: {
      provider: 'local',
      providerId: 'local:admin',
      username: 'admin',
      email: 'admin@local.dev',
      passwordHash: adminHash,
      role: 'ADMIN',
      organizationId: primaryOrg.id,
    },
    update: {
      username: 'admin',
      passwordHash: adminHash,
      role: 'ADMIN',
      organizationId: primaryOrg.id,
    },
  });
  console.log(`Seeded admin user (username: admin) → org ${primaryOrg.name}`);
}

async function seedAdminSettings() {
  const adminUser = await prisma.user.findUnique({
    where: { providerId: 'local:admin' },
  });
  if (!adminUser) return;

  await prisma.userSettings.upsert({
    where: { userId: adminUser.id },
    create: { userId: adminUser.id, data: {} },
    update: {},
  });
  console.log('Seeded default user settings for admin');
}

async function seedSystemUser() {
  const systemPassword = process.env.SYSTEM_PASSWORD ?? 'system123';
  const systemHash = await bcrypt.hash(systemPassword, 10);

  await prisma.user.upsert({
    where: { providerId: 'local:system' },
    create: {
      provider: 'local',
      providerId: 'local:system',
      username: 'system',
      email: 'phamvankhanhvmm@gmail.com',
      passwordHash: systemHash,
      role: 'SYSTEM',
      organizationId: null,
    },
    update: {
      username: 'system',
      passwordHash: systemHash,
      role: 'SYSTEM',
      organizationId: null,
    },
  });
  console.log('Seeded system user (username: system)');
}

async function linkSystemTemplatesToSystemUser() {
  const systemUser = await prisma.user.findUnique({
    where: { providerId: 'local:system' },
    select: { id: true },
  });
  if (!systemUser) return;

  await prisma.ceremonyTemplate.updateMany({
    where: { isSystemTemplate: true, createdByUserId: null },
    data: { createdByUserId: systemUser.id },
  });
}

async function seedExportPresets(devUserId) {
  const presets = buildExportPresets();
  await prisma.$transaction([
    prisma.exportPreset.deleteMany({ where: { userId: devUserId } }),
    prisma.exportPreset.createMany({
      data: presets.map((preset, index) => ({
        userId: devUserId,
        key: preset.id,
        label: preset.label,
        sortOrder: index,
        data: preset.settings,
      })),
    }),
  ]);
  await prisma.userSettings.upsert({
    where: { userId: devUserId },
    create: { userId: devUserId, data: {} },
    update: {},
  });
  console.log(`Seeded ${presets.length} export presets to export_preset table`);
}

async function seedStandardFeatureDefaults() {
  await prisma.appConfig.upsert({
    where: { key: 'standard_features_default' },
    create: {
      key: 'standard_features_default',
      value: {
        tree: true,
        book: true,
        events: true,
        export: true,
        search: true,
        editTree: false,
        editBook: false,
        editEvents: false,
        linkAccount: true,
        settings: true,
      },
    },
    update: {},
  });
  console.log('Seeded standard feature defaults');
}

async function seedBlogPosts() {
  const { buildAllBlogPosts } = await import('./blog-posts-data.js');
  const blogPosts = buildAllBlogPosts();
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: post,
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        metaDescription: post.metaDescription,
        category: post.category,
        tags: post.tags,
        published: post.published,
      },
    });
  }
  console.log(`Seeded ${blogPosts.length} blog posts`);
}

async function main() {
  console.log('Starting seed...');

  // const organization = await ensureOrganization();
  // await seedCeremonyTemplates(organization.id);
  // await ensureDefaultCeremonyTemplate(organization.id);
  // await seedRootPerson(organization.id);

  // const devUser = await ensureDevUser();
  // await seedAdminUser(organization);
  // await seedAdminSettings();
  // await seedSystemUser();
  // await linkSystemTemplatesToSystemUser();
  // await seedExportPresets(devUser.id);
  // await seedStandardFeatureDefaults();
  // await seedBlogPosts();

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
