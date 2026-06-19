import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const TOUR_STEPS = [
  {
    title: 'Dashboard Hub',
    description: 'Your central hub for tracking your digital footprint and managing emissions.',
    route: '/dashboard'
  },
  {
    title: 'Log Activities',
    description: 'Track transport, food, energy, or custom AI activities here.',
    route: '/dashboard/track'
  },
  {
    title: 'Activity History',
    description: 'Review everything you\'ve logged and spot trends in your emissions.',
    route: '/dashboard/history'
  },
  {
    title: 'AI Insights',
    description: 'Get personalized feedback and strategies directly from our AI.',
    route: '/dashboard/insights'
  },
  {
    title: 'Goals & Challenges',
    description: 'Join challenges and set reduction goals. Take action!',
    route: '/dashboard/goals'
  }
];

export function TourGuide() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('ct_has_seen_tour');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const updatePosition = () => {
    if (!isVisible) return;
    const step = TOUR_STEPS[currentStep];
    // Find the NavLink that matches the route exactly
    const el = document.querySelector(`nav a[href="${step.route}"]`);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentStep, isVisible]);

  // Recalculate if route changes, since DOM elements unmount/remount
  useEffect(() => {
    const timer = setTimeout(updatePosition, 300); // Wait for page transition
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleClose = () => {
    localStorage.setItem('ct_has_seen_tour', 'true');
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      navigate(TOUR_STEPS[nextStep].route);
    } else {
      handleClose();
    }
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const isMobile = window.innerWidth < 1024;
  
  let top = 0;
  let left = 0;
  
  if (targetRect) {
    if (isMobile) {
      // Position above the nav item on mobile
      top = targetRect.top - 200; 
      left = Math.max(10, targetRect.left - 120);
    } else {
      // Position to the right of the sidebar item on desktop
      top = targetRect.top;
      left = targetRect.right + 20;
    }
  } else {
    // Fallback to center if element not found
    top = window.innerHeight / 2 - 100;
    left = window.innerWidth / 2 - 160;
  }

  return (
    <AnimatePresence>
      {/* We no longer use a full-screen backdrop so the user can see the highlighted element clearly */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.9, x: isMobile ? 0 : -20, y: isMobile ? 20 : 0 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed z-[100] card-brutal bg-[var(--ct-accent)] p-6 border-4 border-[var(--ct-border-hard)] shadow-[8px_8px_0px_var(--ct-border-hard)] w-80 max-w-[90vw]"
        style={{ top, left }}
      >
        {/* Pointer Arrow - Desktop (Left) */}
        {!isMobile && targetRect && (
          <div className="absolute top-8 -left-4 w-6 h-6 bg-[var(--ct-accent)] border-l-4 border-b-4 border-[var(--ct-border-hard)] transform rotate-45" />
        )}
        
        {/* Pointer Arrow - Mobile (Bottom) */}
        {isMobile && targetRect && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-[var(--ct-accent)] border-r-4 border-b-4 border-[var(--ct-border-hard)] transform rotate-45" />
        )}

        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 border-2 border-transparent hover:border-[var(--ct-border-hard)] hover:bg-white transition-all group"
        >
          <X className="w-5 h-5 text-[var(--ct-ink)] group-hover:rotate-90 transition-transform" />
        </button>

        <h3 className="text-xl font-bold font-display uppercase tracking-widest text-[var(--ct-ink)] mb-2 mt-2">
          {step.title}
        </h3>
        <p className="text-sm font-bold text-[var(--ct-ink)] mb-6">
          {step.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {TOUR_STEPS.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 border-2 border-[var(--ct-border-hard)] ${idx === currentStep ? 'w-4 bg-[var(--ct-ink)]' : 'w-2 bg-white'}`}
              />
            ))}
          </div>
          <button 
            onClick={handleNext}
            className="btn-brutal bg-white px-4 py-2 border-2 border-[var(--ct-border-hard)] shadow-[2px_2px_0px_var(--ct-border-hard)] font-bold text-xs uppercase flex items-center gap-1 hover:-translate-y-0.5 transition-transform"
          >
            {isLast ? 'DONE' : 'NEXT'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
