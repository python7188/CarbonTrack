import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const { loginWithGoogle, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to dashboard
  if (currentUser) {
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
    return null;
  }

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setIsLoggingIn(true);
      await loginWithGoogle();
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch {
      setError('Failed to log in. Please check your Firebase Configuration keys.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--ct-bg-surface)] relative overflow-hidden font-body text-[var(--ct-ink)] p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--ct-accent)]/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[var(--ct-warning)]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="card-brutal w-full max-w-md p-8 relative z-10 bg-white">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[var(--ct-accent)] flex items-center justify-center border-2 border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)] mb-6">
            <Leaf className="w-10 h-10 text-[var(--ct-ink)]" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--ct-ink)] leading-tight font-display uppercase">
            CarbonTrack
          </h1>
          <p className="text-xs text-[var(--ct-ink-muted)] font-bold uppercase tracking-widest border-t-2 border-[var(--ct-border-hard)] pt-1 mt-1">
            Every Action Counts
          </p>
        </div>

        {error && (
          <div className="bg-[var(--ct-warning)]/10 border-2 border-[var(--ct-warning)] text-[var(--ct-ink)] p-3 mb-6 text-sm font-bold font-display">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-center text-sm text-[var(--ct-ink-muted)] mb-6 font-medium">
            Sign in to track your carbon footprint and access the simulator.
          </p>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full btn-brutal btn-brutal-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn className="w-5 h-5" />
            {isLoggingIn ? 'Authenticating...' : 'Sign In With Google'}
          </button>
        </div>

        <div className="mt-8 border-t-2 border-dashed border-[var(--ct-border-light)] pt-6 text-center">
          <p className="text-xs text-[var(--ct-ink-faint)] uppercase tracking-wider font-bold">
            Secure Authentication powered by Firebase
          </p>
        </div>
      </div>
    </div>
  );
}
