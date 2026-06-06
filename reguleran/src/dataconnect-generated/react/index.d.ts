import { CreateGigSlotData, CreateGigSlotVariables, BookGigData, BookGigVariables, ListAvailableGigsData, ListAvailableGigsVariables, AddReviewData, AddReviewVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateGigSlot(options?: useDataConnectMutationOptions<CreateGigSlotData, FirebaseError, CreateGigSlotVariables>): UseDataConnectMutationResult<CreateGigSlotData, CreateGigSlotVariables>;
export function useCreateGigSlot(dc: DataConnect, options?: useDataConnectMutationOptions<CreateGigSlotData, FirebaseError, CreateGigSlotVariables>): UseDataConnectMutationResult<CreateGigSlotData, CreateGigSlotVariables>;

export function useBookGig(options?: useDataConnectMutationOptions<BookGigData, FirebaseError, BookGigVariables>): UseDataConnectMutationResult<BookGigData, BookGigVariables>;
export function useBookGig(dc: DataConnect, options?: useDataConnectMutationOptions<BookGigData, FirebaseError, BookGigVariables>): UseDataConnectMutationResult<BookGigData, BookGigVariables>;

export function useListAvailableGigs(vars?: ListAvailableGigsVariables, options?: useDataConnectQueryOptions<ListAvailableGigsData>): UseDataConnectQueryResult<ListAvailableGigsData, ListAvailableGigsVariables>;
export function useListAvailableGigs(dc: DataConnect, vars?: ListAvailableGigsVariables, options?: useDataConnectQueryOptions<ListAvailableGigsData>): UseDataConnectQueryResult<ListAvailableGigsData, ListAvailableGigsVariables>;

export function useAddReview(options?: useDataConnectMutationOptions<AddReviewData, FirebaseError, AddReviewVariables>): UseDataConnectMutationResult<AddReviewData, AddReviewVariables>;
export function useAddReview(dc: DataConnect, options?: useDataConnectMutationOptions<AddReviewData, FirebaseError, AddReviewVariables>): UseDataConnectMutationResult<AddReviewData, AddReviewVariables>;
