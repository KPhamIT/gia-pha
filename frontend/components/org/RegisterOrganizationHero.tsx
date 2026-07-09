import { UI } from "@/lib/constants/ui-strings";

export default function RegisterOrganizationHero() {
  return (
    <header className="bg-[#4a2c2a] text-white">
      <div className="px-4 py-10 md:px-10 md:py-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#fef3c7]/80">
          {UI.ORG_REGISTER_SUBTITLE}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {UI.ORG_REGISTER_TITLE}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
          {UI.ORG_REGISTER_HINT}
        </p>
        <ol className="mt-6 max-w-xl list-decimal space-y-2 pl-5 text-sm leading-relaxed text-white/75 md:text-base">
          {UI.ORG_REGISTER_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </header>
  );
}
