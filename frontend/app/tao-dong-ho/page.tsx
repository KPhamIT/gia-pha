import BookPageShell from "@/components/ui/BookPageShell";
import RegisterOrganizationForm from "@/components/org/RegisterOrganizationForm";
import PublicSiteFooter from "@/components/public/PublicSiteFooter";
import { UI } from "@/lib/constants/ui-strings";

export default function RegisterOrganizationPage() {
  return (
    <BookPageShell
      title={UI.ORG_REGISTER_TITLE}
      subtitle={UI.ORG_REGISTER_SUBTITLE}
      backHref="/"
      hideNavFab
    >
      <RegisterOrganizationForm />
      <PublicSiteFooter />
    </BookPageShell>
  );
}
