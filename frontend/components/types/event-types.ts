export type EventType = 'INFO' | 'CONTRIBUTION';

/** An event row as returned by the list endpoint (with derived stats). */
export type FamilyEvent = {
  id: number;
  organizationId: number;
  title: string;
  description?: string | null;
  type: EventType;
  eventDate?: string | null;
  amountPerPerson: number;
  paidCount: number;
  totalCollected: number;
  createdAt: string;
  updatedAt: string;
};

/** A single person's payment record for an event. */
export type EventContribution = {
  personId: number;
  paid: boolean;
};

/** A single event with its full contribution list (detail endpoint). */
export type FamilyEventDetail = Omit<FamilyEvent, 'paidCount' | 'totalCollected'> & {
  contributions: EventContribution[];
};

export type CreateEventInput = {
  title: string;
  description?: string;
  type: EventType;
  eventDate?: string;
  amountPerPerson?: number;
};

export type UpdateEventInput = Partial<CreateEventInput>;
