import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddReviewData {
  review_insert: Review_Key;
}

export interface AddReviewVariables {
  bookingId: UUIDString;
  rating: number;
  comment: string;
}

export interface BookGigData {
  booking_insert: Booking_Key;
}

export interface BookGigVariables {
  gigSlotId: UUIDString;
  musicianId: UUIDString;
  notes?: string | null;
}

export interface Booking_Key {
  id: UUIDString;
  __typename?: 'Booking_Key';
}

export interface CreateGigSlotData {
  gigSlot_insert: GigSlot_Key;
}

export interface CreateGigSlotVariables {
  venueId: UUIDString;
  startTime: TimestampString;
  endTime: TimestampString;
  offeredFee?: number | null;
}

export interface GigSlot_Key {
  id: UUIDString;
  __typename?: 'GigSlot_Key';
}

export interface ListAvailableGigsData {
  gigSlots: ({
    id: UUIDString;
    startTime: TimestampString;
    endTime: TimestampString;
    venue: {
      name: string;
      address: string;
    };
  } & GigSlot_Key)[];
}

export interface ListAvailableGigsVariables {
  minFee?: number | null;
}

export interface Musician_Key {
  id: UUIDString;
  __typename?: 'Musician_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface Venue_Key {
  id: UUIDString;
  __typename?: 'Venue_Key';
}

interface CreateGigSlotRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGigSlotVariables): MutationRef<CreateGigSlotData, CreateGigSlotVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateGigSlotVariables): MutationRef<CreateGigSlotData, CreateGigSlotVariables>;
  operationName: string;
}
export const createGigSlotRef: CreateGigSlotRef;

export function createGigSlot(vars: CreateGigSlotVariables): MutationPromise<CreateGigSlotData, CreateGigSlotVariables>;
export function createGigSlot(dc: DataConnect, vars: CreateGigSlotVariables): MutationPromise<CreateGigSlotData, CreateGigSlotVariables>;

interface BookGigRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: BookGigVariables): MutationRef<BookGigData, BookGigVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: BookGigVariables): MutationRef<BookGigData, BookGigVariables>;
  operationName: string;
}
export const bookGigRef: BookGigRef;

export function bookGig(vars: BookGigVariables): MutationPromise<BookGigData, BookGigVariables>;
export function bookGig(dc: DataConnect, vars: BookGigVariables): MutationPromise<BookGigData, BookGigVariables>;

interface ListAvailableGigsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListAvailableGigsVariables): QueryRef<ListAvailableGigsData, ListAvailableGigsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListAvailableGigsVariables): QueryRef<ListAvailableGigsData, ListAvailableGigsVariables>;
  operationName: string;
}
export const listAvailableGigsRef: ListAvailableGigsRef;

export function listAvailableGigs(vars?: ListAvailableGigsVariables, options?: ExecuteQueryOptions): QueryPromise<ListAvailableGigsData, ListAvailableGigsVariables>;
export function listAvailableGigs(dc: DataConnect, vars?: ListAvailableGigsVariables, options?: ExecuteQueryOptions): QueryPromise<ListAvailableGigsData, ListAvailableGigsVariables>;

interface AddReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
  operationName: string;
}
export const addReviewRef: AddReviewRef;

export function addReview(vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;
export function addReview(dc: DataConnect, vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;

