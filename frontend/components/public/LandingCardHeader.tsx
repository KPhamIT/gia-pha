import Icon from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/icon-paths";

type LandingCardHeaderProps = {
  icon: IconName;
  title: string;
  titleClassName?: string;
};

export default function LandingCardHeader({
  icon,
  title,
  titleClassName = "font-semibold text-neutral-900",
}: LandingCardHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800"
        aria-hidden
      >
        <Icon
          path={icon}
          size={22}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          pointer={false}
        />
      </div>
      <h3 className={titleClassName}>{title}</h3>
    </div>
  );
}
