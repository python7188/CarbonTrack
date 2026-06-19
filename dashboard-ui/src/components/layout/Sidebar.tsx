import { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Leaf, X, Bell, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const timeStr = time.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <div className="flex flex-col text-[var(--ct-ink)] mb-6 mt-6 border-t-2 border-b-2 border-[var(--ct-border-hard)] py-3">
      <span className="text-xl font-bold font-display tracking-widest">{timeStr}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--ct-ink-muted)]">{dateStr}</span>
    </div>
  );
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  exit: { x: '-100%', transition: { duration: 0.2 } },
};

interface SidebarContentProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const SidebarFooter = () => {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="shrink-0 p-6 border-t-4 border-[var(--ct-border-hard)] bg-white mt-auto">
      <LiveClock />

      <div className="flex items-center gap-3 w-full">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowDropdown(false);
            }}
            aria-label="Notifications"
            className="w-12 h-12 card-brutal flex items-center justify-center relative hover:bg-[var(--ct-accent)] transition-colors shrink-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <Bell className="w-5 h-5 text-[var(--ct-ink)] stroke-[2px]" aria-hidden="true" />
            <span
              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[var(--ct-warning)] rounded-none border-2 border-[var(--ct-border-hard)]"
              aria-hidden="true"
            />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 bottom-full mb-4 w-64 card-brutal bg-white z-50 py-2 shadow-[8px_8px_0px_var(--ct-border-hard)]"
              >
                <div className="px-4 py-3 border-b-2 border-[var(--ct-border-hard)] mb-2 flex justify-between items-center">
                  <span className="font-bold uppercase tracking-widest text-xs">Notifications</span>
                  <span className="text-[10px] bg-[var(--ct-bg-surface)] px-2 font-bold border-2 border-[var(--ct-border-hard)]">0 NEW</span>
                </div>
                <div className="flex flex-col">
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm font-bold text-[var(--ct-ink-muted)]">No new notifications</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar dropdown */}
        <div className="relative flex-1">
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotifications(false);
            }}
            aria-haspopup="true"
            aria-expanded={showDropdown}
            aria-label="User menu"
            className="flex items-center gap-2 card-brutal w-full p-2 pr-3 hover:bg-[var(--ct-accent)] transition-colors shrink-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none justify-between"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="w-8 h-8 rounded-none border-2 border-[var(--ct-border-hard)] object-cover bg-white shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-none border-2 border-[var(--ct-border-hard)] bg-[var(--ct-ink)] text-[var(--ct-bg-light)] flex items-center justify-center font-bold text-sm shrink-0">
                  {currentUser?.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-xs font-bold text-[var(--ct-ink)] truncate font-display hidden xl:block uppercase">{currentUser?.displayName?.split(' ')[0] || 'User'}</span>
            </div>
            <ChevronDown className="w-5 h-5 text-[var(--ct-ink)] stroke-[2px] shrink-0" aria-hidden="true" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 bottom-full mb-4 w-56 card-brutal bg-white z-50 py-2 shadow-[8px_8px_0px_var(--ct-border-hard)]"
              >
                <div className="px-4 py-2 border-b-2 border-[var(--ct-border-hard)] mb-2">
                  <p className="text-sm font-bold font-display truncate">{currentUser?.displayName || 'User'}</p>
                  <p className="text-xs text-[var(--ct-ink-muted)] truncate">{currentUser?.email || ''}</p>
                </div>
                <button
                  onClick={() => logout()}
                  className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-[var(--ct-bg-surface)] flex items-center gap-2 text-[var(--ct-warning)] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const SidebarContent: React.FC<SidebarContentProps> = ({ onClose, isMobile = false }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col flex-1 py-8 px-6 relative bg-white overflow-y-auto overflow-x-hidden">
      {/* Header: Branding + Close button (mobile only) */}
      <div className="flex items-center justify-between shrink-0 relative z-10 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[var(--ct-accent)] flex items-center justify-center border-2 border-[var(--ct-border-hard)] shadow-[3px_3px_0px_var(--ct-border-hard)]">
            <Leaf className="w-8 h-8 text-[var(--ct-ink)]" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--ct-ink)] leading-none font-display uppercase">
              CarbonTrack
            </h1>
            <p className="text-xs text-[var(--ct-ink-muted)] font-bold uppercase tracking-widest border-t-2 border-[var(--ct-border-hard)] pt-1 mt-1">
              Every Action Counts
            </p>
          </div>
        </div>

        {isMobile && onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="w-10 h-10 border-2 border-[var(--ct-border-hard)] bg-white hover:bg-[var(--ct-accent)] flex items-center justify-center transition-colors shadow-[2px_2px_0px_var(--ct-border-hard)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_var(--ct-border-hard)] shrink-0 ml-4"
          >
            <X className="w-5 h-5 text-[var(--ct-ink)]" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav 
        role="navigation" 
        aria-label="Main navigation" 
        className="shrink-0 mb-8"
        style={{ marginTop: '10vh' }}
      >
        <ul className="flex flex-col gap-4 relative z-10 list-none">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.id;
            const IconComponent = item.icon;

            return (
              <li key={item.id} className="border-b-2 border-transparent mb-10">
                <NavLink
                  to={item.id}
                  onClick={isMobile ? onClose : undefined}
                  className={`group flex items-center gap-5 px-6 py-6 text-xl font-black transition-all border-2 ${
                    isActive
                      ? 'bg-[var(--ct-accent)] text-[var(--ct-ink)] border-[var(--ct-border-hard)] shadow-[6px_6px_0px_var(--ct-border-hard)] -translate-y-1'
                      : 'bg-white text-[var(--ct-ink-muted)] border-[var(--ct-border-hard)] shadow-[2px_2px_0px_var(--ct-border-hard)] hover:border-[var(--ct-border-hard)] hover:text-[var(--ct-ink)] hover:shadow-[4px_4px_0px_var(--ct-border-hard)] hover:-translate-y-0.5'
                  } uppercase tracking-wider font-display`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <motion.div
                    whileHover={{ scale: 1.15, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <IconComponent
                      className={`w-8 h-8 transition-colors ${isActive ? 'text-[var(--ct-ink)]' : 'stroke-[2px] group-hover:text-[var(--ct-ink)]'}`}
                      aria-hidden="true"
                    />
                  </motion.div>
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <>
      {/* Desktop Sidebar — static in flex flow on lg+ */}
      <aside
        className="hidden lg:flex w-[320px] bg-white text-[var(--ct-ink)] flex-col shrink-0 h-screen z-30 border-r-4 border-[var(--ct-border-hard)]"
        aria-label="Sidebar"
      >
        <SidebarContent />
        <SidebarFooter />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sidebar-backdrop"
              className="fixed inset-0 bg-[var(--ct-ink)]/80 backdrop-blur-sm z-40 lg:hidden"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <motion.aside
              key="sidebar-drawer"
              className="fixed top-0 left-0 h-screen w-[320px] bg-white text-[var(--ct-ink)] flex flex-col z-50 lg:hidden border-r-4 border-[var(--ct-border-hard)] shadow-[10px_0_0_var(--ct-border-hard)]"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <SidebarContent onClose={handleClose} isMobile />
              <SidebarFooter />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

