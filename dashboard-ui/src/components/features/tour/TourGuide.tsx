import { useState, useEffect, useRef, useCallback } from 'react';
import { logger } from '../../../lib/logger';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Activity } from '../../../types';
import { getHistory, saveHistory } from '../../../lib/storage';

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
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem('ct_has_seen_tour') !== 'true';
  });
  const [currentStep, setCurrentStep] = useState(0);
  
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [textPos, setTextPos] = useState({ x: 0, y: 0, w: 0, h: 0 });
  
  const textRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Remove the 1000ms delay that might be getting cleared by StrictMode unmounts
  // The component will just render immediately if not seen.

  const updatePosition = useCallback(() => {
    if (!isVisible) return;
    try {
      const step = TOUR_STEPS[currentStep];
      // Be more forgiving with the selector (e.g. if href has a trailing slash or hash)
      const els = document.querySelectorAll(`nav a[href$="${step.route}"], nav a[href*="${step.route}"]`);
      let found = false;
      for (let i = 0; i < els.length; i++) {
        const rect = els[i].getBoundingClientRect();
        // Only select the element if it's actually visible on the screen!
        if (rect.width > 0 && rect.height > 0) {
          setTargetPos({ x: rect.left, y: rect.top, w: rect.width, h: rect.height });
          found = true;
          break;
        }
      }
      if (!found) {
        setTargetPos({ x: 0, y: 0, w: 0, h: 0 });
      }

      if (textRef.current) {
        const txtRect = textRef.current.getBoundingClientRect();
        setTextPos({ x: txtRect.left, y: txtRect.top, w: txtRect.width, h: txtRect.height });
      }
    } catch (e) {
      logger.error("TourGuide updatePosition error:", e);
    }
  }, [currentStep, isVisible]);

  useEffect(() => {
    const timer = setTimeout(updatePosition, 50);
    window.addEventListener('resize', updatePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition, isVisible]);

  useEffect(() => {
    const timer = setTimeout(updatePosition, 300);
    return () => clearTimeout(timer);
  }, [updatePosition, location.pathname]);

  const handleClose = () => {
    localStorage.setItem('ct_has_seen_tour', 'true');
    setIsVisible(false);

    // Give them a free streak day for completing the tour!
    try {
      const activities = getHistory();
      const today = new Date().toISOString().split('T')[0];
      const hasToday = activities.some((a: Activity) => {
        const dateVal = a.timestamp || a.date;
        return dateVal ? new Date(dateVal).toISOString().split('T')[0] === today : false;
      });
      
      if (!hasToday) {
        activities.push({
          id: 'tour-completed-' + Date.now(),
          activity: 'CUSTOM',
          category: 'waste',
          amount: 1,
          unit: 'tour',
          co2: 0,
          timestamp: new Date().toISOString()
        });
        saveHistory(activities);
      }
    } catch (e) {
      logger.error(e);
    }

    // Force redirect to Dashboard to reload app state
    window.location.href = '/dashboard?tourCompleted=true';
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

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const isMobile = window.innerWidth < 1024;

  // Arrow calculations
  const hasTarget = targetPos.w > 0;
  // Start from the edge of the text box, not the absolute center
  const startX = isMobile ? textPos.x + textPos.w / 2 : textPos.x;
  const startY = isMobile ? textPos.y + textPos.h : textPos.y + textPos.h / 2;
  
  let endX = startX;
  let endY = startY;

  if (hasTarget) {
    if (isMobile) {
      endX = targetPos.x + targetPos.w / 2;
      endY = targetPos.y - 15;
    } else {
      endX = targetPos.x + targetPos.w + 15;
      endY = targetPos.y + targetPos.h / 2;
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-transparent backdrop-blur-none"
        >
        
        {/* SVG Arrow Layer */}
        {hasTarget && textPos.w > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-[101]">
            <defs>
              <marker 
                id="arrowhead" 
                markerWidth="12" 
                markerHeight="12" 
                refX="10" 
                refY="6" 
                orient="auto"
              >
                <path d="M 0 0 L 12 6 L 0 12 z" fill="#FF4500" />
              </marker>
            </defs>
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#FF4500"
              strokeWidth="6"
              strokeDasharray="12 12"
              markerEnd="url(#arrowhead)"
            />
          </svg>
        )}

        {/* Highlight ring for the target element (simulated) */}
        {hasTarget && (
          <motion.div
            className="fixed pointer-events-none border-4 border-[var(--ct-accent)] z-[102]"
            animate={{
              x: targetPos.x - 8,
              y: targetPos.y - 8,
              width: targetPos.w + 16,
              height: targetPos.h + 16,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          />
        )}

        {/* Center Text Box */}
        <motion.div
          key={currentStep}
          ref={textRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: 'spring', damping: 20 }}
          className="absolute z-[105] card-brutal bg-white p-8 md:p-14 border-4 border-[var(--ct-border-hard)] shadow-[16px_16px_0px_var(--ct-border-hard)] w-[90%] max-w-2xl text-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-auto lg:right-12 lg:translate-x-0"
        >
          <button 
            onClick={handleClose}
            aria-label="Close tour"
            className="absolute top-4 right-4 p-2 border-2 border-transparent hover:border-[var(--ct-border-hard)] hover:bg-[var(--ct-bg-surface)] transition-all group"
          >
            <X className="w-8 h-8 text-[var(--ct-ink)] group-hover:rotate-90 transition-transform" />
          </button>

          <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter text-[var(--ct-ink)] mb-6">
            {step.title}
          </h2>
          <p className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] leading-relaxed mb-10">
            {step.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t-4 border-[var(--ct-border-hard)] pt-8">
            <div className="flex gap-3">
              {TOUR_STEPS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-4 border-4 border-[var(--ct-border-hard)] transition-all ${idx === currentStep ? 'w-12 bg-[var(--ct-accent)]' : 'w-4 bg-white'}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              aria-label={isLast ? 'Start tracking' : 'Next step'}
              className="btn-brutal bg-[var(--ct-ink)] text-white px-8 py-4 border-4 border-[var(--ct-border-hard)] shadow-[6px_6px_0px_var(--ct-accent)] font-black text-xl uppercase flex items-center gap-3 hover:-translate-y-1 transition-transform"
            >
              {isLast ? 'START TRACKING' : 'NEXT STEP'} <ChevronRight className="w-6 h-6 stroke-[3px]" />
            </button>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
