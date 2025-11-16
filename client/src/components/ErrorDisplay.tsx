
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  error?: Error | any;
  onRetry?: () => void;
  onGoHome?: () => void;
  showDetails?: boolean;
}

export function ErrorDisplay({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  error,
  onRetry,
  onGoHome,
  showDetails = false,
}: ErrorDisplayProps) {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/dashboard';
    }
  };

  const errorMessage = error?.message || error?.error || message;
  const errorCode = error?.code;

  return (
    <Card className="max-w-lg w-full">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-destructive/10">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{errorMessage}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorCode && (
          <div className="text-sm text-muted-foreground">
            Error code: <code className="font-mono bg-muted px-1 py-0.5 rounded">{errorCode}</code>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {onRetry && (
            <Button onClick={onRetry} className="w-full gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          
          <Button onClick={handleGoHome} variant="outline" className="w-full gap-2">
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Button>
        </div>

        {showDetails && error?.stack && process.env.NODE_ENV === 'development' && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-2 p-2 text-xs bg-muted rounded overflow-auto max-h-40">
              {error.stack}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
}
