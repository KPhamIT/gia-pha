import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";

export type CeremonyHtmlResponse = {
  personId: number;
  fullName: string;
  organizationId: number;
  html: string;
};

export type CeremonyTemplate = {
  id: number;
  organizationId: number;
  name: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CeremonyTemplateVariable = {
  key: string;
  label: string;
};

export type CreateCeremonyTemplateInput = {
  name: string;
  content: string;
  isDefault?: boolean;
};

export type UpdateCeremonyTemplateInput = Partial<CreateCeremonyTemplateInput>;

export const ceremonies = {
  getHtml: (personId: number, templateId?: number) =>
    axiosClient
      .get<CeremonyHtmlResponse>(API_ROUTES.CEREMONY_HTML(personId), {
        params: templateId != null ? { templateId } : undefined,
      })
      .then((r) => r.data),

  getShareToken: (personId: number) =>
    axiosClient
      .get<{
        token: string;
        personId: number;
      }>(API_ROUTES.CEREMONY_SHARE_TOKEN(personId))
      .then((r) => r.data),

  getPublicHtml: (token: string) =>
    axiosClient
      .get<CeremonyHtmlResponse>(API_ROUTES.CEREMONY_PUBLIC_HTML(token))
      .then((r) => r.data),

  getDemoHtml: () =>
    axiosClient
      .get<CeremonyHtmlResponse>(API_ROUTES.CEREMONY_DEMO_HTML)
      .then((r) => r.data),

  getDemoShareToken: () =>
    axiosClient
      .get<{ token: string; personId: number }>(
        API_ROUTES.CEREMONY_DEMO_SHARE_TOKEN,
      )
      .then((r) => r.data),

  listTemplates: () =>
    axiosClient
      .get<CeremonyTemplate[]>(API_ROUTES.CEREMONY_TEMPLATES)
      .then((r) => r.data),

  getTemplate: (id: number) =>
    axiosClient
      .get<CeremonyTemplate>(API_ROUTES.CEREMONY_TEMPLATE(id))
      .then((r) => r.data),

  listVariables: () =>
    axiosClient
      .get<CeremonyTemplateVariable[]>(API_ROUTES.CEREMONY_TEMPLATE_VARIABLES)
      .then((r) => r.data),

  createTemplate: (input: CreateCeremonyTemplateInput) =>
    axiosClient
      .post<CeremonyTemplate>(API_ROUTES.CEREMONY_TEMPLATES, input)
      .then((r) => r.data),

  updateTemplate: (id: number, input: UpdateCeremonyTemplateInput) =>
    axiosClient
      .patch<CeremonyTemplate>(API_ROUTES.CEREMONY_TEMPLATE(id), input)
      .then((r) => r.data),

  setDefaultTemplate: (id: number) =>
    axiosClient
      .patch<CeremonyTemplate>(API_ROUTES.CEREMONY_TEMPLATE_DEFAULT(id))
      .then((r) => r.data),

  deleteTemplate: (id: number) =>
    axiosClient
      .delete<{ id: number }>(API_ROUTES.CEREMONY_TEMPLATE(id))
      .then((r) => r.data),
};
