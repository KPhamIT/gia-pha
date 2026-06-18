# Hướng dẫn cho AI agents (Cursor, Claude Code, …)

Repo **Gia phả** — Next.js frontend + NestJS backend. Đọc rule Cursor tại `.cursor/rules/` và tài liệu `docs/`.

## Bắt buộc trước khi sửa auth / phân quyền / chặn chức năng

1. **[`docs/auth-roles-permissions.md`](docs/auth-roles-permissions.md)** — quy tắc role, feature permission, guard backend, hook frontend. **Không mỗi page một kiểu.**
2. **[`docs/auth-roles-setup.md`](docs/auth-roles-setup.md)** — seed, env, tài khoản mặc định.

Rule Cursor tương ứng (luôn áp dụng): `.cursor/rules/auth-roles-permissions.mdc`

## Tóm tắt nhanh

| Lớp | Frontend | Backend |
|-----|----------|---------|
| Đăng nhập | `authStore`, `api.auth.me()` | JWT guards |
| Role ADMIN/SYSTEM | `canMutate`, `requireAdmin()` | `MutateGuard`, `SystemGuard` |
| Feature STANDARD | `canUseFeature(key)`, `requireFeature(key)` | `FeatureMutateGuard` + `@RequireFeature` |

Hook chuẩn UI: `useFeatureAccess()` (`frontend/hooks/useFeatureAccess.ts`).

Page admin: `useSystemAccess()` (`/system`), `useOrgAdminAccess()` (`/org-users`).

## Quy ước repo khác

- UI tiếng Việt → `frontend/lib/constants/ui-strings.ts`
- API frontend → `frontend/lib/api`, routes → `api-routes.ts`
- Code style → `.cursor/rules/code-style.mdc`
- Tổng quan → `.cursor/rules/project-overview.mdc`
