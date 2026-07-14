import { Suspense } from "react";
import Script from "next/script";
import {
  getClarityProjectId,
  getGaMeasurementId,
} from "@/lib/analytics/env";
import AnalyticsPageViews from "./AnalyticsPageViews";

function GaScripts({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}',{send_page_view:false});`}
      </Script>
      <Suspense fallback={null}>
        <AnalyticsPageViews measurementId={measurementId} />
      </Suspense>
    </>
  );
}

function ClarityScript({ projectId }: { projectId: string }) {
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`}
    </Script>
  );
}

/** Gắn GA4 + Clarity khi có biến môi trường tương ứng. */
export default function AnalyticsScripts() {
  const gaId = getGaMeasurementId();
  const clarityId = getClarityProjectId();
  if (!gaId && !clarityId) return null;

  return (
    <>
      {gaId ? <GaScripts measurementId={gaId} /> : null}
      {clarityId ? <ClarityScript projectId={clarityId} /> : null}
    </>
  );
}
