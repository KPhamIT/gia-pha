import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";
import type { SubscriptionTier } from "@/lib/constants/billing";

const submitPaidInflight = new Map<number, Promise<BillingOrder>>();

export type PaymentQuote = {
  organizationId: number;
  organizationName: string;
  personCount: number;
  tier: SubscriptionTier;
  tierLabel: string;
  amountVnd: number;
  bankDisplay: BillingOrder["bankDisplay"];
  openOrder: BillingOrder | null;
};

export type BillingTierInfo = {
  tier: SubscriptionTier;
  label: string;
  priceVnd: number;
  maxPersons: number;
  storageQuotaGb: number;
  maxAdmins: number | null;
  color: string;
};

export type BillingConfig = {
  billingEnabled: boolean;
  freeDownloadMaxNodes: number;
  orderExpireDays: number;
  qrImageUrl: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  tiers: BillingTierInfo[];
};

export type BillingOrderStatus =
  | "PENDING_PAYMENT"
  | "AWAITING_REVIEW"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";

export type BillingOrder = {
  id: number;
  organizationId: number;
  organizationName: string;
  transferCode: string;
  tier: SubscriptionTier;
  tierLabel: string;
  personCountAtOrder: number;
  amountVnd: number;
  status: BillingOrderStatus;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  note: string | null;
  paidAt: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  expiresAt: string;
  createdAt: string;
  bankDisplay: {
    qrImageUrl: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
};

export type ExportEligibility =
  | { allowed: true; nodeCount?: number; personCount?: number; tier?: SubscriptionTier; expiresAt?: string }
  | {
      allowed: false;
      reason:
        | "NO_SUBSCRIPTION"
        | "TIER_TOO_LOW"
        | "EXPIRED"
        | "ENTERPRISE_REQUIRED"
        | "DEMO"
        | "INVALID_NODE_COUNT";
      nodeCount?: number;
      personCount?: number;
      requiredTier?: SubscriptionTier;
      requiredTierLabel?: string;
      currentTier?: SubscriptionTier;
      expiresAt?: string;
    };

export type OrganizationSubscriptionSummary = {
  personCount: number;
  requiredTier: SubscriptionTier | null;
  requiredTierLabel: string | null;
  active: {
    id: number;
    tier: SubscriptionTier;
    tierLabel: string;
    status: string;
    startsAt: string;
    expiresAt: string;
    amountVnd: number;
  } | null;
};

export const billing = {
  getConfig: () =>
    axiosClient.get<BillingConfig>(API_ROUTES.BILLING_CONFIG).then((r) => r.data),

  getQuote: (organizationId: number) =>
    axiosClient
      .get<PaymentQuote>(API_ROUTES.BILLING_QUOTE, {
        params: { organizationId },
      })
      .then((r) => r.data),

  submitPaid: (body: {
    organizationId: number;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    note?: string;
  }) => {
    const inflight = submitPaidInflight.get(body.organizationId);
    if (inflight) return inflight;

    const request = axiosClient
      .post<BillingOrder>(API_ROUTES.BILLING_ORDER_SUBMIT_PAID, body)
      .then((r) => r.data)
      .finally(() => {
        submitPaidInflight.delete(body.organizationId);
      });
    submitPaidInflight.set(body.organizationId, request);
    return request;
  },

  /** @deprecated — dùng getQuote + submitPaid */
  createOrder: (body: {
    organizationId: number;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    note?: string;
  }) => {
    const inflight = submitPaidInflight.get(body.organizationId);
    if (inflight) return inflight;

    const request = axiosClient
      .post<BillingOrder>(API_ROUTES.BILLING_ORDERS, body)
      .then((r) => r.data)
      .finally(() => {
        submitPaidInflight.delete(body.organizationId);
      });
    submitPaidInflight.set(body.organizationId, request);
    return request;
  },

  getOrderByCode: (transferCode: string) =>
    axiosClient
      .get<BillingOrder>(API_ROUTES.BILLING_ORDER_BY_CODE(transferCode))
      .then((r) => r.data),

  listOrders: (status?: BillingOrderStatus) =>
    axiosClient
      .get<BillingOrder[]>(API_ROUTES.BILLING_ORDERS, {
        params: status ? { status } : undefined,
      })
      .then((r) => r.data),

  markPaid: (id: number) =>
    axiosClient
      .post<BillingOrder>(API_ROUTES.BILLING_ORDER_MARK_PAID(id))
      .then((r) => r.data),

  confirm: (id: number, body: { paymentRef?: string; reviewNote?: string }) =>
    axiosClient
      .post<{ order: BillingOrder; subscription: { id: number; tier: SubscriptionTier; expiresAt: string } }>(
        API_ROUTES.BILLING_ORDER_CONFIRM(id),
        body,
      )
      .then((r) => r.data),

  reject: (id: number, reviewNote: string) =>
    axiosClient
      .post<BillingOrder>(API_ROUTES.BILLING_ORDER_REJECT(id), { reviewNote })
      .then((r) => r.data),

  cancel: (id: number) =>
    axiosClient
      .post<BillingOrder>(API_ROUTES.BILLING_ORDER_CANCEL(id))
      .then((r) => r.data),

  getSubscription: (organizationId: number) =>
    axiosClient
      .get<OrganizationSubscriptionSummary>(
        API_ROUTES.ORGANIZATION_SUBSCRIPTION(organizationId),
      )
      .then((r) => r.data),

  getExportEligibility: (organizationId: number, nodeCount: number) =>
    axiosClient
      .get<ExportEligibility>(
        API_ROUTES.ORGANIZATION_EXPORT_ELIGIBILITY(organizationId),
        { params: { nodeCount } },
      )
      .then((r) => r.data),
};
