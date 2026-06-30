-- Hủy đơn mở trùng (giữ đơn mới nhất mỗi dòng họ).
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "organizationId"
      ORDER BY "createdAt" DESC
    ) AS rn
  FROM "BillingOrder"
  WHERE "status" IN ('PENDING_PAYMENT', 'AWAITING_REVIEW')
)
UPDATE "BillingOrder"
SET "status" = 'CANCELLED'
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- Mỗi dòng họ chỉ được có tối đa một đơn đang mở (chờ CK / chờ duyệt).
CREATE UNIQUE INDEX "BillingOrder_one_open_per_org_idx"
ON "BillingOrder" ("organizationId")
WHERE "status" IN ('PENDING_PAYMENT', 'AWAITING_REVIEW');
