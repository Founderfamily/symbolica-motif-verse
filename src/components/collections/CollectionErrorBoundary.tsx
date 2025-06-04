
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CollectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Collections Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              <I18nText translationKey="collections.errorBoundary.title">
                Something went wrong
              </I18nText>
            </h2>
            <p className="text-slate-600 mb-6">
              <I18nText translationKey="collections.errorBoundary.message">
                An error occurred while loading the collections. Please try again.
              </I18nText>
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleRetry} variant="default">
                <RefreshCw className="w-4 h-4 mr-2" />
                <I18nText translationKey="collections.errorBoundary.retry">Retry</I18nText>
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="outline">
                <Home className="w-4 h-4 mr-2" />
                <I18nText translationKey="collections.errorBoundary.home">Home</I18nText>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
