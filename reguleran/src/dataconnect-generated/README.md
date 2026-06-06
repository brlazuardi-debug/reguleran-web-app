# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAvailableGigs*](#listavailablegigs)
- [**Mutations**](#mutations)
  - [*CreateGigSlot*](#creategigslot)
  - [*BookGig*](#bookgig)
  - [*AddReview*](#addreview)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListAvailableGigs
You can execute the `ListAvailableGigs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAvailableGigs(vars?: ListAvailableGigsVariables, options?: ExecuteQueryOptions): QueryPromise<ListAvailableGigsData, ListAvailableGigsVariables>;

interface ListAvailableGigsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListAvailableGigsVariables): QueryRef<ListAvailableGigsData, ListAvailableGigsVariables>;
}
export const listAvailableGigsRef: ListAvailableGigsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAvailableGigs(dc: DataConnect, vars?: ListAvailableGigsVariables, options?: ExecuteQueryOptions): QueryPromise<ListAvailableGigsData, ListAvailableGigsVariables>;

interface ListAvailableGigsRef {
  ...
  (dc: DataConnect, vars?: ListAvailableGigsVariables): QueryRef<ListAvailableGigsData, ListAvailableGigsVariables>;
}
export const listAvailableGigsRef: ListAvailableGigsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAvailableGigsRef:
```typescript
const name = listAvailableGigsRef.operationName;
console.log(name);
```

### Variables
The `ListAvailableGigs` query has an optional argument of type `ListAvailableGigsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListAvailableGigsVariables {
  minFee?: number | null;
}
```
### Return Type
Recall that executing the `ListAvailableGigs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAvailableGigsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListAvailableGigs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAvailableGigs, ListAvailableGigsVariables } from '@dataconnect/generated';

// The `ListAvailableGigs` query has an optional argument of type `ListAvailableGigsVariables`:
const listAvailableGigsVars: ListAvailableGigsVariables = {
  minFee: ..., // optional
};

// Call the `listAvailableGigs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAvailableGigs(listAvailableGigsVars);
// Variables can be defined inline as well.
const { data } = await listAvailableGigs({ minFee: ..., });
// Since all variables are optional for this query, you can omit the `ListAvailableGigsVariables` argument.
const { data } = await listAvailableGigs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAvailableGigs(dataConnect, listAvailableGigsVars);

console.log(data.gigSlots);

// Or, you can use the `Promise` API.
listAvailableGigs(listAvailableGigsVars).then((response) => {
  const data = response.data;
  console.log(data.gigSlots);
});
```

### Using `ListAvailableGigs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAvailableGigsRef, ListAvailableGigsVariables } from '@dataconnect/generated';

// The `ListAvailableGigs` query has an optional argument of type `ListAvailableGigsVariables`:
const listAvailableGigsVars: ListAvailableGigsVariables = {
  minFee: ..., // optional
};

// Call the `listAvailableGigsRef()` function to get a reference to the query.
const ref = listAvailableGigsRef(listAvailableGigsVars);
// Variables can be defined inline as well.
const ref = listAvailableGigsRef({ minFee: ..., });
// Since all variables are optional for this query, you can omit the `ListAvailableGigsVariables` argument.
const ref = listAvailableGigsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAvailableGigsRef(dataConnect, listAvailableGigsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.gigSlots);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.gigSlots);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateGigSlot
You can execute the `CreateGigSlot` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createGigSlot(vars: CreateGigSlotVariables): MutationPromise<CreateGigSlotData, CreateGigSlotVariables>;

interface CreateGigSlotRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGigSlotVariables): MutationRef<CreateGigSlotData, CreateGigSlotVariables>;
}
export const createGigSlotRef: CreateGigSlotRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createGigSlot(dc: DataConnect, vars: CreateGigSlotVariables): MutationPromise<CreateGigSlotData, CreateGigSlotVariables>;

interface CreateGigSlotRef {
  ...
  (dc: DataConnect, vars: CreateGigSlotVariables): MutationRef<CreateGigSlotData, CreateGigSlotVariables>;
}
export const createGigSlotRef: CreateGigSlotRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createGigSlotRef:
```typescript
const name = createGigSlotRef.operationName;
console.log(name);
```

### Variables
The `CreateGigSlot` mutation requires an argument of type `CreateGigSlotVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateGigSlotVariables {
  venueId: UUIDString;
  startTime: TimestampString;
  endTime: TimestampString;
  offeredFee?: number | null;
}
```
### Return Type
Recall that executing the `CreateGigSlot` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateGigSlotData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateGigSlotData {
  gigSlot_insert: GigSlot_Key;
}
```
### Using `CreateGigSlot`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createGigSlot, CreateGigSlotVariables } from '@dataconnect/generated';

// The `CreateGigSlot` mutation requires an argument of type `CreateGigSlotVariables`:
const createGigSlotVars: CreateGigSlotVariables = {
  venueId: ..., 
  startTime: ..., 
  endTime: ..., 
  offeredFee: ..., // optional
};

// Call the `createGigSlot()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createGigSlot(createGigSlotVars);
// Variables can be defined inline as well.
const { data } = await createGigSlot({ venueId: ..., startTime: ..., endTime: ..., offeredFee: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createGigSlot(dataConnect, createGigSlotVars);

console.log(data.gigSlot_insert);

// Or, you can use the `Promise` API.
createGigSlot(createGigSlotVars).then((response) => {
  const data = response.data;
  console.log(data.gigSlot_insert);
});
```

### Using `CreateGigSlot`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createGigSlotRef, CreateGigSlotVariables } from '@dataconnect/generated';

// The `CreateGigSlot` mutation requires an argument of type `CreateGigSlotVariables`:
const createGigSlotVars: CreateGigSlotVariables = {
  venueId: ..., 
  startTime: ..., 
  endTime: ..., 
  offeredFee: ..., // optional
};

// Call the `createGigSlotRef()` function to get a reference to the mutation.
const ref = createGigSlotRef(createGigSlotVars);
// Variables can be defined inline as well.
const ref = createGigSlotRef({ venueId: ..., startTime: ..., endTime: ..., offeredFee: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createGigSlotRef(dataConnect, createGigSlotVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.gigSlot_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.gigSlot_insert);
});
```

## BookGig
You can execute the `BookGig` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
bookGig(vars: BookGigVariables): MutationPromise<BookGigData, BookGigVariables>;

interface BookGigRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: BookGigVariables): MutationRef<BookGigData, BookGigVariables>;
}
export const bookGigRef: BookGigRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
bookGig(dc: DataConnect, vars: BookGigVariables): MutationPromise<BookGigData, BookGigVariables>;

interface BookGigRef {
  ...
  (dc: DataConnect, vars: BookGigVariables): MutationRef<BookGigData, BookGigVariables>;
}
export const bookGigRef: BookGigRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the bookGigRef:
```typescript
const name = bookGigRef.operationName;
console.log(name);
```

### Variables
The `BookGig` mutation requires an argument of type `BookGigVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface BookGigVariables {
  gigSlotId: UUIDString;
  musicianId: UUIDString;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `BookGig` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `BookGigData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface BookGigData {
  booking_insert: Booking_Key;
}
```
### Using `BookGig`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, bookGig, BookGigVariables } from '@dataconnect/generated';

// The `BookGig` mutation requires an argument of type `BookGigVariables`:
const bookGigVars: BookGigVariables = {
  gigSlotId: ..., 
  musicianId: ..., 
  notes: ..., // optional
};

// Call the `bookGig()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await bookGig(bookGigVars);
// Variables can be defined inline as well.
const { data } = await bookGig({ gigSlotId: ..., musicianId: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await bookGig(dataConnect, bookGigVars);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
bookGig(bookGigVars).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

### Using `BookGig`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, bookGigRef, BookGigVariables } from '@dataconnect/generated';

// The `BookGig` mutation requires an argument of type `BookGigVariables`:
const bookGigVars: BookGigVariables = {
  gigSlotId: ..., 
  musicianId: ..., 
  notes: ..., // optional
};

// Call the `bookGigRef()` function to get a reference to the mutation.
const ref = bookGigRef(bookGigVars);
// Variables can be defined inline as well.
const ref = bookGigRef({ gigSlotId: ..., musicianId: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = bookGigRef(dataConnect, bookGigVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

## AddReview
You can execute the `AddReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addReview(vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;

interface AddReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
}
export const addReviewRef: AddReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addReview(dc: DataConnect, vars: AddReviewVariables): MutationPromise<AddReviewData, AddReviewVariables>;

interface AddReviewRef {
  ...
  (dc: DataConnect, vars: AddReviewVariables): MutationRef<AddReviewData, AddReviewVariables>;
}
export const addReviewRef: AddReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addReviewRef:
```typescript
const name = addReviewRef.operationName;
console.log(name);
```

### Variables
The `AddReview` mutation requires an argument of type `AddReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddReviewVariables {
  bookingId: UUIDString;
  rating: number;
  comment: string;
}
```
### Return Type
Recall that executing the `AddReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddReviewData {
  review_insert: Review_Key;
}
```
### Using `AddReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addReview, AddReviewVariables } from '@dataconnect/generated';

// The `AddReview` mutation requires an argument of type `AddReviewVariables`:
const addReviewVars: AddReviewVariables = {
  bookingId: ..., 
  rating: ..., 
  comment: ..., 
};

// Call the `addReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addReview(addReviewVars);
// Variables can be defined inline as well.
const { data } = await addReview({ bookingId: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addReview(dataConnect, addReviewVars);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
addReview(addReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

### Using `AddReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addReviewRef, AddReviewVariables } from '@dataconnect/generated';

// The `AddReview` mutation requires an argument of type `AddReviewVariables`:
const addReviewVars: AddReviewVariables = {
  bookingId: ..., 
  rating: ..., 
  comment: ..., 
};

// Call the `addReviewRef()` function to get a reference to the mutation.
const ref = addReviewRef(addReviewVars);
// Variables can be defined inline as well.
const ref = addReviewRef({ bookingId: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addReviewRef(dataConnect, addReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

