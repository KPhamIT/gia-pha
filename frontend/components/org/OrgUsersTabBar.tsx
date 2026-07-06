"use client";

type TabItem<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  tabs: TabItem<T>[];
  active: T;
  onChange: (tab: T) => void;
};

export default function OrgUsersTabBar<T extends string>({
  tabs,
  active,
  onChange,
}: Props<T>) {
  return (
    <div
      className="mb-6 flex flex-wrap gap-2 border-b border-[#d4c3c1] pb-4"
      role="tablist"
      aria-label="Org admin sections"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-95 ${
              isActive
                ? "bg-[#321716] text-white shadow-md"
                : "border border-[#d4c3c1] bg-white text-[#504443] hover:bg-[#f6f3ee]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
