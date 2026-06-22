export type EventType = "INFO" | "CONTRIBUTION";

export type DonationKind = "MONEY" | "IN_KIND";

/** An event row as returned by the list endpoint (with derived stats). */
export type FamilyEvent = {
  id: number;
  organizationId: number;
  title: string;
  description?: string | null;
  type: EventType;
  eventDate?: string | null;
  amountPerPerson: number;
  maleOnly: boolean;
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
  amountPaid: number;
};

/** A free-form merit/donation entry (anyone, not tied to the family tree). */
export type EventDonation = {
  id: number;
  eventId: number;
  personId?: number | null;
  donorName: string;
  kind: DonationKind;
  amount: number;
  itemDescription?: string | null;
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
  kind?: DonationKind;
  amount?: number;
  itemDescription?: string;
  note?: string;
};

export type UpdateDonationInput = Partial<CreateDonationInput>;

export type CreateEventInput = {
  title: string;
  description?: string;
  type: EventType;
  eventDate?: string;
  amountPerPerson?: number;
  maleOnly?: boolean;
};

export type UpdateEventInput = Partial<CreateEventInput>;

export type SaveContributionsInput = {
  contributions: { personId: number; amountPaid: number }[];
};

/** Local draft row before batch save (công đức). */
export type DonationDraftItem = {
  draftKey: string;
  id?: number;
  donorName: string;
  personId?: number | null;
  kind: DonationKind;
  amount: number;
  itemDescription?: string | null;
  note?: string | null;
};

export type SaveDonationsInput = {
  create: CreateDonationInput[];
  update: ({ id: number } & UpdateDonationInput)[];
  remove: number[];
};
