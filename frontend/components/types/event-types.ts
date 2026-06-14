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
  donationTotal: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
};

/** A single person's payment record for an event. */
export type EventContribution = {
  personId: number;
  paid: boolean;
};

/** A free-form merit/donation entry (anyone, not tied to the family tree). */
export type EventDonation = {
  id: number;
  eventId: number;
  personId?: number | null;
  donorName: string;
  amount: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
};

/** A single event with its full contribution + donation lists (detail endpoint). */
export type FamilyEventDetail = FamilyEvent & {
  contributions: EventContribution[];
  donations: EventDonation[];
};

export type CreateDonationInput = {
  donorName: string;
  personId?: number | null;
  amount?: number;
  note?: string;
};

export type UpdateDonationInput = Partial<CreateDonationInput>;

export type CreateEventInput = {
  title: string;
  description?: string;
  type: EventType;
  eventDate?: string;
  amountPerPerson?: number;
};

export type UpdateEventInput = Partial<CreateEventInput>;
