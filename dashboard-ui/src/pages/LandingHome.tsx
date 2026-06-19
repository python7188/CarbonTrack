import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function LandingHome() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleCTA = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[calc(100vh-76px)] px-6 sm:px-12 flex flex-col items-center justify-center text-center bg-[var(--ct-bg-light)] overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(var(--ct-border-hard) 1px, transparent 1px), linear-gradient(90deg, var(--ct-border-hard) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        <motion.div 
          className="max-w-4xl relative z-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-block bg-[var(--ct-accent)] text-[var(--ct-ink)] text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-1 mb-8 border-2 border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)] -rotate-2">
            The Ultimate Carbon Tracking Engine
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-7xl md:text-8xl font-black font-display uppercase leading-[0.9] tracking-tighter mb-8">
            Take Control Of <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--ct-ink)] to-[var(--ct-ink-muted)] stroke-text">
              Your Footprint
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-12 text-[var(--ct-ink-muted)] leading-relaxed">
            Stop guessing your environmental impact. CarbonTrack provides raw, uncompromised data analytics to measure, analyze, and systematically reduce your carbon emissions.
          </motion.p>

          <motion.button 
            variants={fadeInUp}
            onClick={handleCTA}
            className="btn-brutal bg-white text-[var(--ct-ink)] text-lg sm:text-xl px-12 py-5 font-black uppercase tracking-wider flex items-center gap-4 mx-auto group hover:bg-[var(--ct-accent)] mb-16"
          >
            Start Tracking Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t-2 border-[var(--ct-border-hard)]">
            <div className="flex flex-col items-center">
              <Leaf className="w-8 h-8 mb-2" />
              <span className="font-bold uppercase text-sm">Actionable Metrics</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-8 h-8 mb-2" />
              <span className="font-bold uppercase text-sm">Real-time Analysis</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 mb-2" />
              <span className="font-bold uppercase text-sm">100% Private Data</span>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
