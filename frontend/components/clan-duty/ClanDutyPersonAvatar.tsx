"use client";

type Props = {
  name: string;
  avatar?: string | null;
};

export default function ClanDutyPersonAvatar({ name, avatar }: Props) {
  if (avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar}
        alt=""
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <span className="grid h-full w-full place-items-center bg-[#f0ede9] text-sm font-semibold text-[#663100]">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
