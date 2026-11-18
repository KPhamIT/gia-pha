import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";
import ResendVerificationButton from "./ResendVerificationButton";

/** Hiện sau khi đăng ký dòng họ: nhắc mở email để xác nhận tài khoản. */
export default function VerifyEmailPendingCard({
  email,
  username,
  mailSent,
}: {
  email: string;
  username: string;
  mailSent: boolean;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-[#e8d5b0] bg-[#fffaf0] p-6 shadow-sm md:p-8" role="status">
      <div className="text-4xl" aria-hidden>
        ✉️
      </div>
      <h2 className="font-serif text-xl font-semibold text-[#321716]">{UI.VERIFY_PENDING_TITLE}</h2>
      <p className="text-sm leading-relaxed text-[#504443]">
        {mailSent ? UI.VERIFY_PENDING_BODY(email) : UI.VERIFY_PENDING_MAIL_FAILED}
      </p>
      <p className="text-xs leading-relaxed text-[#827472]">{UI.VERIFY_PENDING_SPAM_HINT}</p>
      <ResendVerificationButton login={username} />
      <Link
        href="/login"
        className="block text-center text-sm font-medium text-[#944a00] underline-offset-4 hover:underline"
      >
        {UI.VERIFY_GO_LOGIN}
      </Link>
    </div>
  );
}
