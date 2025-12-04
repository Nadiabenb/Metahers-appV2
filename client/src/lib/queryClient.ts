import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function throwIfResNotOk(res: Response) {
  // 304 Not Modified is OK - it means use cached version
  if (!res.ok && res.status !== 304) {
    let errorData: any;
    try {
      errorData = await res.json();
    } catch {
      errorData = { error: res.statusText };
    }

    const message = errorData.error || errorData.message || res.statusText;
    const code = errorData.code || 'UNKNOWN_ERROR';
    
    throw new APIError(res.status, code, message, errorData.details);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

export async function apiRequestJson<T>(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok && res.status !== 304) {
    let errorData: any;
    try {
      errorData = await res.json();
    } catch {
      errorData = { error: res.statusText };
    }
    const message = errorData.error || errorData.message || res.statusText;
    const code = errorData.code || 'UNKNOWN_ERROR';
    throw new APIError(res.status, code, message, errorData.details);
  }
  
  const contentType = res.headers.get('content-type');
  if (res.status === 204 || !contentType?.includes('application/json')) {
    return {} as T;
  }
  
  return await res.json() as T;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Exponential backoff retry logic
function retryDelayFunction(attemptIndex: number) {
  return Math.min(1000 * 2 ** attemptIndex, 30000); // Max 30 seconds
}

// Determine if error should be retried
function shouldRetry(failureCount: number, error: any): boolean {
  if (failureCount >= 3) return false;
  
  // Retry network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return true;
  }
  
  // Retry on specific API errors
  if (error instanceof APIError) {
    // Retry on server errors and rate limits
    return error.status >= 500 || error.status === 429;
  }
  
  return false;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: shouldRetry,
      retryDelay: retryDelayFunction,
    },
    mutations: {
      retry: false,
      onError: (error: any) => {
        // Global mutation error handler
        const message = error instanceof APIError 
          ? error.message 
          : error.message || 'An unexpected error occurred';
        
        let description = error instanceof APIError && error.code
          ? `Error code: ${error.code}`
          : undefined;

        // Add helpful guidance for common errors
        if (error instanceof APIError) {
          if (error.status === 401) {
            description = 'Please log in to continue';
          } else if (error.status === 403) {
            description = 'You don\'t have permission for this action';
          } else if (error.status === 429) {
            description = 'Too many requests. Please wait a moment and try again';
          } else if (error.status >= 500) {
            description = 'Server error. Please try again in a moment';
          }
        }

        toast({
          variant: "destructive",
          title: "Action failed",
          description: description || message,
        });
      },
    },
  },
});
