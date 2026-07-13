"use client";

import AuthPageLoading from "@/components/ui/AuthPageLoading";
import ResponsiveAppPageLayout from "@/components/layout/ResponsiveAppPageLayout";
import { UI } from "@/lib/constants/ui-strings";
import CoverDesignList from "./CoverDesignList";
import CoverStudioEditor from "./CoverStudioEditor";
import { useCoverStudio } from "./useCoverStudio";

export default function CoverStudioPageView() {
  const {
    ready,
    designs,
    draft,
    side,
    setSide,
    isDirty,
    createDesign,
    openDesign,
    closeEditor,
    patchDraft,
    patchFront,
    patchBack,
    saveDraft,
    duplicateDesign,
    deleteDesign,
  } = useCoverStudio();

  if (!ready) {
    return <AuthPageLoading message={UI.COVER_STUDIO_LOADING} />;
  }

  if (draft) {
    return (
      <ResponsiveAppPageLayout
        title={draft.name || UI.COVER_STUDIO_TITLE}
        backHref="/book/covers"
        contentClassName="w-full px-3 pb-24 pt-[calc(4.75rem+env(safe-area-inset-top))] md:px-6 md:pb-6 md:pt-6"
      >
        <CoverStudioEditor
          draft={draft}
          side={side}
          isDirty={isDirty}
          onSideChange={setSide}
          onPatch={patchDraft}
          onPatchFront={patchFront}
          onPatchBack={patchBack}
          onSave={saveDraft}
          onBack={() => {
            closeEditor();
          }}
          onDuplicate={() => duplicateDesign(draft.id)}
          onDelete={() => deleteDesign(draft.id)}
        />
      </ResponsiveAppPageLayout>
    );
  }

  return (
    <ResponsiveAppPageLayout
      title={UI.COVER_STUDIO_TITLE}
      backHref="/book"
      fab={
        <button
          type="button"
          onClick={createDesign}
          className="fixed bottom-24 right-6 z-40 rounded-full border-4 border-white/20 bg-[#321716] px-5 py-3 text-sm font-semibold text-white shadow-2xl md:hidden"
          aria-label={UI.COVER_STUDIO_CREATE}
        >
          {UI.COVER_STUDIO_CREATE}
        </button>
      }
    >
      <p className="mb-4 max-w-2xl text-sm text-[#504443]">
        {UI.COVER_STUDIO_SUBTITLE}
      </p>
      <CoverDesignList
        designs={designs}
        onOpen={openDesign}
        onCreate={createDesign}
        onDuplicate={duplicateDesign}
        onDelete={deleteDesign}
      />
    </ResponsiveAppPageLayout>
  );
}
