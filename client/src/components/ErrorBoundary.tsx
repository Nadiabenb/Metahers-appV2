
import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to analytics if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-destructive/10">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                We encountered an unexpected error. Don't worry, your data is safe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="p-3 rounded-lg bg-muted text-sm font-mono text-muted-foreground overflow-auto max-h-32">
                  {this.state.error.message}
                </div>
              )}
              <Button onClick={this.handleReset} className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
