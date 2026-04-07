
import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
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
    
    this.setState({ errorInfo });

    // Log to analytics if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: true,
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.href = '/';
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    const subject = encodeURIComponent('MetaHers Error Report');
    const body = encodeURIComponent(
      `Error: ${this.state.error?.message}\n\n` +
      `Stack: ${this.state.error?.stack}\n\n` +
      `Component Stack: ${this.state.errorInfo?.componentStack}`
    );
    window.location.href = `mailto:nadia@metahers.ai?subject=${subject}&body=${body}`;
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
                <div className="p-3 rounded-lg bg-muted text-sm font-mono text-foreground overflow-auto max-h-32">
                  {this.state.error.message}
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button onClick={this.handleReset} className="w-full gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                
                <Button onClick={this.handleGoHome} variant="outline" className="w-full gap-2">
                  <Home className="w-4 h-4" />
                  Go to Dashboard
                </Button>

                <Button onClick={this.handleReportError} variant="ghost" className="w-full gap-2">
                  <Mail className="w-4 h-4" />
                  Report This Error
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-foreground">
                    Component Stack
                  </summary>
                  <pre className="mt-2 p-2 text-xs bg-muted rounded overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
