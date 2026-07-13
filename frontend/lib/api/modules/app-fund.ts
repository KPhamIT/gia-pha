import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";
import type { SubscriptionTier } from "@/lib/constants/billing";

export type AppFundContributionStatus =
  | "AWAITING_REVIEW"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED";

export type AppFundBankDisplay = {
  qrImageUrl: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
};

export type AppFundContribution = {
  id: number;
  organizationId: number;
  personId?: number | null;
  donorName: string;
  amount: number;
  note?: string | null;
  createdByUserId?: number | null;
  status: AppFundContributionStatus;
  transferCode: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AppFundAdminItem = AppFundContribution & {
  organizationName: string;
};

export type AppFundSummary = {
  organizationId: number;
  personCount: number;
  requiredTier: SubscriptionTier | null;
  requiredTierLabel: string | null;
  requiredAmountVnd: number;
  totalRaisedVnd: number;
  shortfallVnd: number;
  subscriptionExpiresAt: string | null;
  daysUntilExpiry: number | null;
  hasActiveSubscription: boolean;
  bankDisplay: AppFundBankDisplay;
  contributions: AppFundContribution[];
};

export type SubmitAppFundInput = {
  organizationId: number;
  donorName: string;
  amount: number;
  personId?: number;
  note?: string;
  contactEmail?: string;
};

export type SubmitAppFundResult = {
  contribution: AppFundContribution;
  summary: AppFundSummary;
};

export const appFund = {
  getSummary: (organizationId: number) =>
    axiosClient
      .get<AppFundSummary>(API_ROUTES.APP_FUND, {
        params: { organizationId },
      })
      .then((r) => r.data),

  submitPaid: (body: SubmitAppFundInput) =>
    axiosClient
      .post<SubmitAppFundResult>(API_ROUTES.APP_FUND_SUBMIT_PAID, body)
      .then((r) => r.data),

  remove: (id: number) =>
    axiosClient
      .delete<AppFundSummary>(API_ROUTES.APP_FUND_ITEM(id))
      .then((r) => r.data),

  listAdmin: (status?: AppFundContributionStatus) =>
    axiosClient
      .get<AppFundAdminItem[]>(API_ROUTES.APP_FUND_ADMIN, {
        params: status ? { status } : undefined,
      })
      .then((r) => r.data),

  confirm: (id: number, body?: { reviewNote?: string }) =>
    axiosClient
      .post<AppFundAdminItem>(API_ROUTES.APP_FUND_ADMIN_CONFIRM(id), body ?? {})
      .then((r) => r.data),

  reject: (id: number, body: { reviewNote: string }) =>
    axiosClient
      .post<AppFundAdminItem>(API_ROUTES.APP_FUND_ADMIN_REJECT(id), body)
      .then((r) => r.data),
};
