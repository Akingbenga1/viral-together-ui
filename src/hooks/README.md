# Authentication Error Handling

## useAuthErrorHandler Hook

The `useAuthErrorHandler` hook provides a consistent way to handle authentication errors (401 status) across all authenticated pages in the application.

### Features

- **Automatic 401 Detection**: Detects when API calls return 401 (Unauthorized) status
- **Toast Notifications**: Shows user-friendly error messages
- **Automatic Logout**: Clears user session and redirects to login page
- **Graceful Redirects**: Uses Next.js router for proper navigation
- **Reusable**: Can be used in any authenticated component

### Usage

#### Basic Usage

```tsx
import { useAuthErrorHandler } from '@/hooks/useAuthErrorHandler';

function MyAuthenticatedPage() {
  const { handleAuthError } = useAuthErrorHandler();

  const fetchData = async () => {
    try {
      const data = await apiClient.getSomeData();
      // Handle success
    } catch (error: any) {
      // Handle authentication errors first
      if (handleAuthError(error, 'Authentication required. Please log in again.')) {
        return; // Exit early if it was an auth error
      }
      
      // Handle other errors normally
      toast.error('Failed to load data');
    }
  };

  return <div>My Page</div>;
}
```

#### Using the Wrapper Function

```tsx
import { useAuthErrorHandler } from '@/hooks/useAuthErrorHandler';

function MyAuthenticatedPage() {
  const { withAuthErrorHandling } = useAuthErrorHandler();

  const fetchData = async () => {
    try {
      const data = await withAuthErrorHandling(
        () => apiClient.getSomeData(),
        'Authentication required. Please log in again.'
      );
      // Handle success
    } catch (error: any) {
      if (error.message === 'AUTH_ERROR') {
        // Auth error was already handled, just return
        return;
      }
      
      // Handle other errors normally
      toast.error('Failed to load data');
    }
  };

  return <div>My Page</div>;
}
```

### API Reference

#### `handleAuthError(error, customMessage?)`

- **Parameters:**
  - `error`: The error object from API calls
  - `customMessage` (optional): Custom error message to show
- **Returns:** `boolean` - `true` if it was an auth error (and handled), `false` otherwise

#### `withAuthErrorHandling(apiCall, customErrorMessage?)`

- **Parameters:**
  - `apiCall`: Function that returns a Promise (your API call)
  - `customErrorMessage` (optional): Custom error message for auth errors
- **Returns:** Promise that resolves to the API response or rejects with non-auth errors

### Implementation Details

When a 401 error is detected:

1. Shows a toast notification with the error message
2. Calls `logout()` to clear the user session
3. Redirects to `/auth/login` after a 1.5-second delay
4. Returns `true` to indicate the error was handled

### Best Practices

1. **Always check for auth errors first** in your error handling
2. **Use custom messages** that are specific to the context
3. **Exit early** when auth errors are detected to avoid showing additional error messages
4. **Use the wrapper function** for cleaner code when you have simple API calls

### Example Implementation

See `src/app/dashboard/recommendations/page.tsx` for a complete example of how to implement this hook in an authenticated page.
