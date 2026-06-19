import { NavLink } from 'react-router-dom';
import { Home, BarChart3, Zap, User, Plus } from 'lucide-react';
import type { SVGProps } from 'react';

interface MobileNavItem {
  to: string;
  label: string;
  icon: React.FC<SVGProps<SVGSVGElement>>;
}

const LEFT_ITEMS: MobileNavItem[] = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/footprint', label: 'Footprint', icon: BarChart3 },
];

const RIGHT_ITEMS: MobileNavItem[] = [
  { to: '/insights', label: 'Insights', icon: Zap },
  { to: '/profile', label: 'Profile', icon: User },
];

export const MobileNav = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t-4 border-[var(--ct-border-hard)] px-2 pb-safe pt-2"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-between px-2 h-16 relative">
        {/* Left items */}
        {LEFT_ITEMS.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                  isActive ? 'text-[var(--ct-ink)]' : 'text-[var(--ct-ink-faint)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} aria-hidden="true" />
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? 'text-[var(--ct-ink)]' : 'text-[var(--ct-ink-faint)]'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* Center FAB */}
        <div className="flex-1 flex justify-center -mt-8 relative z-10">
          <NavLink
            to="/track"
            aria-label="Add new activity"
            className="w-16 h-16 bg-[var(--ct-accent)] border-4 border-[var(--ct-border-hard)] flex items-center justify-center text-[var(--ct-ink)] shadow-[4px_4px_0px_var(--ct-border-hard)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <Plus className="w-8 h-8 stroke-[3px]" aria-hidden="true" />
          </NavLink>
        </div>

        {/* Right items */}
        {RIGHT_ITEMS.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                  isActive ? 'text-[var(--ct-ink)]' : 'text-[var(--ct-ink-faint)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} aria-hidden="true" />
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? 'text-[var(--ct-ink)]' : 'text-[var(--ct-ink-faint)]'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
