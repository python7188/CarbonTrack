import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../../lib/logger';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 card-brutal bg-red-50 text-red-900 m-8">
          <h2 className="text-3xl font-black uppercase mb-4">Something went wrong</h2>
          <p className="font-bold mb-6">The application encountered an unexpected error.</p>
          <button 
            className="btn-brutal bg-[var(--ct-ink)] text-white px-6 py-3"
            onClick={() => window.location.href = '/'}
          >
            RETURN TO HOME
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
