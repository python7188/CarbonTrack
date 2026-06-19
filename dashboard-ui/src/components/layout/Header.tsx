import { Leaf, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { currentUser } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      {/* Left section: hamburger + greeting */}
      <div className="flex items-center gap-4">
        {/* Hamburger — visible only below lg */}
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="lg:hidden w-12 h-12 card-brutal flex items-center justify-center hover:bg-[var(--ct-accent)] transition-colors active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <Menu className="w-6 h-6 text-[var(--ct-ink)]" aria-hidden="true" />
        </button>

        <div>
          <h2 className="text-2xl sm:text-[32px] font-bold text-[var(--ct-ink)] tracking-tight flex items-center gap-3 font-display uppercase truncate max-w-full">
            {getGreeting()}, {currentUser?.displayName?.split(' ')[0] || 'Warrior'}{' '}
            <Leaf
              className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--ct-ink)] fill-[var(--ct-accent)]"
              aria-hidden="true"
            />
          </h2>
          <p className="text-[var(--ct-ink-muted)] text-xs sm:text-sm font-bold mt-1 uppercase tracking-wider">
            &quot;Small choices today, a better planet tomorrow.&quot;
          </p>
        </div>
      </div>

    </header>
  );
};
