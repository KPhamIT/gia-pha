"use client";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export default function SystemSubpageHero({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="py-4 md:py-8">
      <span className="text-sm font-semibold uppercase tracking-widest text-[#944a00]">
        {eyebrow}
      </span>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-[#321716] md:text-[32px] md:leading-10">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-base text-[#504443]">{subtitle}</p>
    </section>
  );
}
