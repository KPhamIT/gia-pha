import { Suspense } from 'react';
import UpcomingCeremoniesPageContent from './UpcomingCeremoniesContent';
import AuthPageLoading from '@/components/ui/AuthPageLoading';

export default function UpcomingCeremoniesPage() {
  return (
    <Suspense fallback={<AuthPageLoading />}>
      <UpcomingCeremoniesPageContent />
    </Suspense>
  );
}
