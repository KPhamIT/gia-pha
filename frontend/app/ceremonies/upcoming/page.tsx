import { Suspense } from 'react';
import UpcomingCeremoniesPageContent from './UpcomingCeremoniesContent';
import AuthPageLoading from '@/components/ui/AuthPageLoading';
import { UI } from '@/lib/constants/ui-strings';

export default function UpcomingCeremoniesPage() {
  return (
    <Suspense fallback={<AuthPageLoading />}>
      <UpcomingCeremoniesPageContent />
    </Suspense>
  );
}
