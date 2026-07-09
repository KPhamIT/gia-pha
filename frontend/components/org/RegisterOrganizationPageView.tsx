import Link from "next/link";
import JoinPublicShell from "@/components/public/join/JoinPublicShell";
import RegisterOrganizationForm from "@/components/org/RegisterOrganizationForm";
import RegisterOrganizationHero from "@/components/org/RegisterOrganizationHero";
import { UI } from "@/lib/constants/ui-strings";

export default function RegisterOrganizationPageView() {
  return (
    <JoinPublicShell>
      <RegisterOrganizationHero />
      <section className="bg-[#fcf9f4] px-4 py-8 md:-mt-6 md:rounded-t-[3rem] md:px-10 md:pb-16 md:pt-12 md:shadow-2xl">
        <div className="mx-auto w-full max-w-lg">
          <RegisterOrganizationForm />
          <p className="mt-8 text-center text-sm text-[#504443]">
            <Link
              href="/join"
              className="font-semibold text-[#944a00] underline-offset-2 hover:underline"
            >
              {UI.ORG_REGISTER_JOIN_LINK} →
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-[#827472]">
            <Link href="/huong-dan" className="hover:text-[#504443] hover:underline">
              {UI.LANDING_CTA_GUIDE}
            </Link>
          </p>
        </div>
      </section>
    </JoinPublicShell>
  );
}
