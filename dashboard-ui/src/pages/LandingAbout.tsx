import { motion } from 'framer-motion';

export default function LandingAbout() {
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
      {/* Manifesto Section */}
      <section className="py-32 px-6 sm:px-12 bg-[var(--ct-bg-surface)]">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-block bg-white text-[var(--ct-ink)] text-sm font-bold uppercase tracking-widest px-4 py-1 mb-10 border-2 border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)]">
            Our Manifesto
          </motion.div>
          
          <motion.h2 variants={fadeInUp} className="text-6xl sm:text-7xl md:text-8xl font-black font-display uppercase tracking-tighter leading-[0.85] mb-16">
            Data Over Guilt. <br />
            <span className="text-[var(--ct-accent)] stroke-text">Action Over Anxiety.</span>
          </motion.h2>

          <div className="space-y-10 text-xl sm:text-2xl font-medium text-[var(--ct-ink)] leading-relaxed border-l-8 border-[var(--ct-ink)] pl-8 sm:pl-12 mb-24 max-w-4xl">
            <motion.p variants={fadeInUp}>
              For too long, the conversation around personal climate impact has been dominated by guilt-trips and vague, unmeasurable advice. "Use less water." "Drive less." CarbonTrack was built to destroy that paradigm entirely.
            </motion.p>
            <motion.p variants={fadeInUp}>
              We believe in raw, unadulterated data. By treating your carbon footprint like a financial balance sheet, we empower you to make clinical, highly effective reductions without sacrificing your quality of life. Numbers don't lie.
            </motion.p>
            <motion.p variants={fadeInUp}>
              This is not a toy. It is a precision tracking engine designed for people who want to solve problems, not just worry about them. When you understand the metrics, you control the outcome.
            </motion.p>
          </div>

          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
            <div className="card-brutal bg-[var(--ct-ink)] text-white p-12">
              <h3 className="text-4xl font-display font-black uppercase mb-8 text-[var(--ct-warning)]">The Old Way</h3>
              <ul className="space-y-6 font-medium text-white/80 leading-relaxed text-lg">
                <li className="flex items-start gap-4">
                  <span className="font-bold text-[var(--ct-warning)]">01.</span>
                  Most footprint calculators are slow, clunky, and filled with arbitrary assumptions.
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-bold text-[var(--ct-warning)]">02.</span>
                  They give you a single "score" at the end of a 30-minute survey.
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-bold text-[var(--ct-warning)]">03.</span>
                  They offer absolutely no way to actively track improvements over time.
                </li>
              </ul>
            </div>
            <div className="card-brutal bg-white text-[var(--ct-ink)] p-12">
              <h3 className="text-4xl font-display font-black uppercase mb-8 text-[var(--ct-accent)]">The New Way</h3>
              <ul className="space-y-6 font-medium leading-relaxed text-lg">
                <li className="flex items-start gap-4">
                  <span className="font-bold text-[var(--ct-accent)]">01.</span>
                  CarbonTrack acts as a continuous monitor. It integrates directly into your daily life.
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-bold text-[var(--ct-accent)]">02.</span>
                  Calculates emissions per meal, per drive, and per purchase with granular accuracy.
                </li>
                <li className="flex items-start gap-4">
                  <span className="font-bold text-[var(--ct-accent)]">03.</span>
                  Converts overwhelming climate anxiety into achievable, mathematically-backed micro-goals.
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Engineering Philosophy */}
      <section className="py-32 px-6 sm:px-12 bg-white border-t-4 border-[var(--ct-border-hard)]">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-24">
            <h2 className="text-5xl sm:text-6xl font-black font-display uppercase tracking-tighter leading-none mb-8">
              Engineering Philosophy
            </h2>
            <p className="text-xl text-[var(--ct-ink-muted)] font-medium max-w-2xl mx-auto">
              How we built the fastest, most reliable tracking engine on the web.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div variants={fadeInUp} className="border-4 border-[var(--ct-border-hard)] p-8">
              <h4 className="text-2xl font-black font-display uppercase mb-4">Zero Knowledge</h4>
              <p className="text-lg font-medium text-[var(--ct-ink-muted)]">Your data never touches our servers unless you explicitly opt-in. Local storage is treated as the source of absolute truth.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="border-4 border-[var(--ct-border-hard)] p-8 bg-[var(--ct-accent)]">
              <h4 className="text-2xl font-black font-display uppercase mb-4">Blazing Fast</h4>
              <p className="text-lg font-medium">Built on modern rendering frameworks, every interaction takes less than 16 milliseconds. No loading spinners, ever.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="border-4 border-[var(--ct-border-hard)] p-8">
              <h4 className="text-2xl font-black font-display uppercase mb-4">Offline First</h4>
              <p className="text-lg font-medium text-[var(--ct-ink-muted)]">Track your footprint deep in the subway or on an airplane. The engine syncs seamlessly the moment you reconnect.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
