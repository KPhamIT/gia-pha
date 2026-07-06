import type { ReactNode } from "react";
import LandingScrollArea from "@/components/public/LandingScrollArea";
import LandingHeader from "@/components/public/landing/LandingHeader";
import LandingSiteFooter from "@/components/public/landing/LandingSiteFooter";
import { SITE } from "@/config/site";

type Props = {
  children: ReactNode;
};

export default function JoinPublicShell({ children }: Props) {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#fcf9f4] text-[#1c1c19]">
      <LandingHeader brandName={SITE.brandName} />
      <LandingScrollArea>
        <main>{children}</main>
        <LandingSiteFooter />
      </LandingScrollArea>
    </div>
  );
}
