"use client";

import { useRouter } from "next/navigation";
import BottomSheet from "@/components/ui/BottomSheet";
import Icon from "@/components/icons/Icon";
import IconRoundButton from "@/components/ui/IconRoundButton";
import {
  formatContactLines,
  getContactInfo,
  hasContactInfo,
} from "@/lib/constants/contact-info";
import { LAYOUT } from "@/lib/constants/ui-layout";
import { BT } from "@/lib/constants/ui-theme";
import { UI } from "@/lib/constants/ui-strings";
import { useAuthGateStore } from "@/store/authGateStore";

export default function AuthRequiredSheet() {
  const router = useRouter();
  const reason = useAuthGateStore((state) => state.reason);
  const close = useAuthGateStore((state) => state.close);

  if (!reason) return null;

  const isLogin = reason === "login";
  const isPermission = reason === "permission";
  const title = isLogin
    ? UI.AUTH_GATE_LOGIN_TITLE
    : isPermission
      ? UI.AUTH_GATE_PERMISSION_TITLE
      : UI.AUTH_GATE_ADMIN_TITLE;
  const message = isLogin
    ? UI.AUTH_GATE_LOGIN_DESC
    : isPermission
      ? UI.AUTH_GATE_PERMISSION_DESC
      : UI.AUTH_GATE_ADMIN_DESC;
  const contact = getContactInfo();
  const contactLines = formatContactLines(contact);

  const handleLogin = () => {
    close();
    router.push("/login");
  };

  return (
    <BottomSheet onClose={close} maxWidth="md" zClass="z-[80]">
      <div className={`${LAYOUT.pagePad} pb-6`}>
        <div className="flex flex-col items-center text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-950 shadow-lg">
            <Icon
              path="lock"
              size={26}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              pointer={false}
            />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          <p className={`mt-2 text-sm leading-relaxed ${BT.mutedOnLight}`}>
            {message}
          </p>
        </div>

        {hasContactInfo(contact) ? (
          <div
            className={`mt-5 rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4`}
          >
            <p className="text-sm font-semibold text-amber-950">
              {UI.CONTACT_INFO_TITLE}
            </p>
            <p className={`mt-1 text-xs ${BT.mutedOnLight}`}>
              {UI.LOGIN_CONTACT_HINT}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-800">
              {contactLines.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={`mt-6 flex justify-center gap-3 ${isLogin ? "" : ""}`}>
          <IconRoundButton
            icon="close"
            variant="outline"
            label={UI.BTN_DISMISS}
            onClick={close}
          />
          {isLogin ? (
            <IconRoundButton
              icon="lock"
              variant="primary"
              label={UI.BTN_LOGIN}
              onClick={handleLogin}
            />
          ) : null}
        </div>
      </div>
    </BottomSheet>
  );
}
