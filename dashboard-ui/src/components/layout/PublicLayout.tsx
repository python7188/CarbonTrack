import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function PublicLayout() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleCTA = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ct-bg-surface)] font-body text-[var(--ct-ink)] overflow-x-hidden selection:bg-[var(--ct-accent)] selection:text-[var(--ct-ink)] flex flex-col">
      {/* ── Navbar ── */}
      <nav className="w-full border-b-4 border-[var(--ct-border-hard)] bg-white py-4 px-6 sm:px-12 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-[var(--ct-accent)] flex items-center justify-center border-2 border-[var(--ct-border-hard)] shadow-[2px_2px_0px_var(--ct-border-hard)]">
            <Leaf className="w-6 h-6 text-[var(--ct-ink)]" />
          </div>
          <span className="text-2xl font-bold font-display uppercase tracking-tight hidden sm:block">CarbonTrack</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
          <Link to="/features" className="hover:text-[var(--ct-accent)] transition-colors">Features</Link>
          <Link to="/about" className="hover:text-[var(--ct-accent)] transition-colors">About</Link>
          <Link to="/contact" className="hover:text-[var(--ct-accent)] transition-colors">Contact</Link>
        </div>

        <button 
          onClick={handleCTA}
          className="btn-brutal btn-brutal-primary text-sm px-6 py-2"
        >
          {currentUser ? 'Go to Dashboard' : 'Sign In'}
        </button>
      </nav>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t-4 border-[var(--ct-border-hard)] bg-[var(--ct-ink)] text-white py-16 px-6 sm:px-12 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-8 h-8 text-[var(--ct-accent)]" />
              <span className="text-3xl font-bold font-display uppercase tracking-widest text-white">CarbonTrack</span>
            </div>
            <p className="text-gray-400 font-medium max-w-sm leading-relaxed">
              The high-performance, brutalist carbon tracking engine for individuals who want actionable data over vague promises.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6">Navigation</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link to="/" className="hover:text-[var(--ct-accent)] transition-colors">Home</Link></li>
              <li><Link to="/features" className="hover:text-[var(--ct-accent)] transition-colors">Features</Link></li>
              <li><Link to="/about" className="hover:text-[var(--ct-accent)] transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--ct-accent)] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6">System</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><button onClick={handleCTA} className="hover:text-[var(--ct-accent)] transition-colors">Sign In / Dashboard</button></li>
              <li><span className="cursor-not-allowed text-gray-600">Privacy Policy</span></li>
              <li><span className="cursor-not-allowed text-gray-600">Terms of Service</span></li>
              <li><span className="cursor-not-allowed text-gray-600">API Documentation</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t-2 border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            © {new Date().getFullYear()} CarbonTrack Systems. All rights reserved.
          </p>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--ct-accent)]">
            SYSTEM STATUS: OPERATIONAL
          </p>
        </div>
      </footer>
    </div>
  );
}
