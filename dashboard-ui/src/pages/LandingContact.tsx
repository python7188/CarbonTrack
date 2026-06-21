import { Mail, Send, MapPin, Clock, ShieldCheck, Database, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LandingContact() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="flex flex-col">
      {/* Contact Header & Form Section */}
      <section className="py-32 px-6 sm:px-12 bg-white">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
            <motion.div variants={fadeInUp}>
              <div className="inline-block bg-[var(--ct-warning)] text-[var(--ct-ink)] text-sm font-bold uppercase tracking-widest px-4 py-1 mb-10 border-2 border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)]">
                Transmission Portal
              </div>
              
              <h2 className="text-6xl sm:text-8xl font-black font-display uppercase tracking-tighter leading-none mb-10">
                Get In <br /> Touch
              </h2>
              
              <p className="text-[var(--ct-ink-muted)] text-xl font-medium mb-16 max-w-lg leading-relaxed">
                Have a question about the engine? Want to request a feature, report a bug, or just talk data? Drop us a line. We read every single message. No automated bots, just real engineers.
              </p>
              
              <div className="space-y-10">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-[var(--ct-bg-surface)] border-4 border-[var(--ct-border-hard)] flex items-center justify-center shadow-[6px_6px_0px_var(--ct-border-hard)]">
                    <Mail className="w-10 h-10 text-[var(--ct-ink)]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mb-2">Direct Transmission</h4>
                    <span className="text-2xl sm:text-3xl font-black uppercase font-display tracking-widest">hello@carbontrack.io</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-[var(--ct-accent)] border-4 border-[var(--ct-border-hard)] flex items-center justify-center shadow-[6px_6px_0px_var(--ct-border-hard)]">
                    <MapPin className="w-10 h-10 text-[var(--ct-ink)]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mb-2">Headquarters</h4>
                    <span className="text-2xl sm:text-3xl font-black uppercase font-display tracking-widest">Global Remote</span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-[var(--ct-warning)] border-4 border-[var(--ct-border-hard)] flex items-center justify-center shadow-[6px_6px_0px_var(--ct-border-hard)]">
                    <Clock className="w-10 h-10 text-[var(--ct-ink)]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--ct-ink-muted)] mb-2">Response Time</h4>
                    <span className="text-2xl sm:text-3xl font-black uppercase font-display tracking-widest">&lt; 24 Hours</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="card-brutal bg-[var(--ct-bg-surface)] p-8 sm:p-12 relative h-fit mt-10 lg:mt-0">
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-[var(--ct-ink)] border-4 border-[var(--ct-border-hard)] rounded-full flex items-center justify-center shadow-[8px_8px_0px_var(--ct-border-hard)] z-10 hidden sm:flex">
                <Send className="w-12 h-12 text-white translate-x-1 -translate-y-1" />
              </div>
              
              <h3 className="text-3xl font-black font-display uppercase tracking-widest mb-8 border-b-4 border-[var(--ct-border-hard)] pb-4">Initialize Contact</h3>

              {isSubmitted && (
                <div role="alert" className="mb-8 p-6 border-4 border-[var(--ct-ink)] bg-[var(--ct-accent)] text-[var(--ct-ink)]">
                  <h4 className="text-xl font-black uppercase mb-2">Transmission Received</h4>
                  <p className="font-bold">Our agents will respond shortly.</p>
                </div>
              )}

              <form method="POST" className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-black uppercase tracking-widest mb-3">Your Name</label>
                  <input id="contact-name" name="name" type="text" autoComplete="name" className="w-full bg-white border-4 border-[var(--ct-border-hard)] px-6 py-5 text-xl font-bold focus:outline-none focus:shadow-[8px_8px_0px_var(--ct-border-hard)] transition-shadow" placeholder="JOHN DOE" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-black uppercase tracking-widest mb-3">Email Address</label>
                  <input id="contact-email" name="email" type="email" autoComplete="email" className="w-full bg-white border-4 border-[var(--ct-border-hard)] px-6 py-5 text-xl font-bold focus:outline-none focus:shadow-[8px_8px_0px_var(--ct-border-hard)] transition-shadow" placeholder="JOHN@EXAMPLE.COM" />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-black uppercase tracking-widest mb-3">Message payload</label>
                  <textarea id="contact-message" name="message" rows={6} autoComplete="off" className="w-full bg-white border-4 border-[var(--ct-border-hard)] px-6 py-5 text-xl font-bold focus:outline-none focus:shadow-[8px_8px_0px_var(--ct-border-hard)] transition-shadow resize-none" placeholder="YOUR TRANSMISSION DATA..."></textarea>
                </div>
                <button type="submit" className="btn-brutal bg-[var(--ct-ink)] text-white py-6 text-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-gray-800 transition-colors mt-4">
                  TRANSMIT <Send className="w-8 h-8" />
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 px-6 sm:px-12 bg-[var(--ct-ink)] text-white border-t-4 border-[var(--ct-border-hard)]">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div variants={fadeInUp} className="flex flex-col items-center">
              <ShieldCheck className="w-16 h-16 text-[var(--ct-accent)] mb-6" />
              <h4 className="text-2xl font-black uppercase tracking-widest mb-4">Enterprise Security</h4>
              <p className="text-gray-400 font-medium text-lg leading-relaxed">Your data is locked down with military-grade encryption. We never sell your personal information.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center">
              <Database className="w-16 h-16 text-[var(--ct-warning)] mb-6" />
              <h4 className="text-2xl font-black uppercase tracking-widest mb-4">Data Portability</h4>
              <p className="text-gray-400 font-medium text-lg leading-relaxed">You own your data. Export your entire history in raw JSON or CSV format at any time with one click.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center">
              <Zap className="w-16 h-16 text-white mb-6" />
              <h4 className="text-2xl font-black uppercase tracking-widest mb-4">99.9% Uptime</h4>
              <p className="text-gray-400 font-medium text-lg leading-relaxed">Our robust cloud infrastructure ensures the tracking engine is online and available exactly when you need it.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
