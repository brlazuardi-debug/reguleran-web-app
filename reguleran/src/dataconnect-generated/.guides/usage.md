# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateGigSlot, useBookGig, useListAvailableGigs, useAddReview } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateGigSlot(createGigSlotVars);

const { data, isPending, isSuccess, isError, error } = useBookGig(bookGigVars);

const { data, isPending, isSuccess, isError, error } = useListAvailableGigs(listAvailableGigsVars);

const { data, isPending, isSuccess, isError, error } = useAddReview(addReviewVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createGigSlot, bookGig, listAvailableGigs, addReview } from '@dataconnect/generated';


// Operation CreateGigSlot:  For variables, look at type CreateGigSlotVars in ../index.d.ts
const { data } = await CreateGigSlot(dataConnect, createGigSlotVars);

// Operation BookGig:  For variables, look at type BookGigVars in ../index.d.ts
const { data } = await BookGig(dataConnect, bookGigVars);

// Operation ListAvailableGigs:  For variables, look at type ListAvailableGigsVars in ../index.d.ts
const { data } = await ListAvailableGigs(dataConnect, listAvailableGigsVars);

// Operation AddReview:  For variables, look at type AddReviewVars in ../index.d.ts
const { data } = await AddReview(dataConnect, addReviewVars);


```