import { Activity, BarChart3, Target, Zap, Globe, ShieldAlert, Cpu, Layers, Maximize, GitMerge, FileCode2, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LandingFeatures() {
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

  const features = [
    { icon: Activity, title: "Live Monitoring", desc: "Log your daily activities across transport, energy, and consumption. See your emissions calculate in real-time.", bg: "bg-[var(--ct-bg-surface)]", iconBg: "bg-white" },
    { icon: BarChart3, title: "Deep Analytics", desc: "Break down your footprint with high-contrast charts. Identify your biggest emission sources instantly without any visual clutter.", bg: "bg-white", iconBg: "bg-[var(--ct-accent)]" },
    { icon: Target, title: "AI Strategies", desc: "Leverage our AI simulator to generate customized, highly-effective strategies to slash your carbon output based on your exact habits.", bg: "bg-[var(--ct-bg-surface)]", iconBg: "bg-[var(--ct-warning)]" },
    { icon: Zap, title: "Automated Sync", desc: "Connect your tools and let the engine automatically calculate your footprint without manual entry. Precision algorithms at work.", bg: "bg-[var(--ct-ink)]", iconBg: "bg-white", text: "text-white", descText: "text-white/80" },
    { icon: Globe, title: "Global Context", desc: "Compare your footprint against regional and global benchmarks to understand your true impact relative to the rest of the planet.", bg: "bg-white", iconBg: "bg-[var(--ct-bg-surface)]" },
    { icon: ShieldAlert, title: "Data Privacy", desc: "Your tracking data is yours. We prioritize strict local-first architecture and zero-knowledge encryption protocols.", bg: "bg-[var(--ct-bg-surface)]", iconBg: "bg-[var(--ct-accent)]" },
  ];

  const deepFeatures = [
    { icon: Cpu, title: "Neural Processing", desc: "Our engine uses advanced local algorithms to crunch your data faster than cloud-based competitors. Instant feedback means instant habit correction." },
    { icon: Layers, title: "Categorical Depth", desc: "Don't just track 'Food'. Track the exact carbon footprint of a beef meal vs a vegan meal. Precision leads to real-world reductions." },
    { icon: Maximize, title: "Scalable Goals", desc: "Start small with daily challenges, and scale up to annual footprint reduction campaigns. The system grows with your commitment." },
    { icon: GitMerge, title: "API Integrations", desc: "Plug into your smart home devices and EV chargers to automatically pull energy consumption data directly into the dashboard." },
    { icon: FileCode2, title: "Raw Data Export", desc: "Export your entire emission history into raw CSV formats. Bring your data anywhere, perform your own analysis, own your history." },
    { icon: Command, title: "Keyboard Centric", desc: "Navigate the entire interface using just your keyboard. Designed for power users who hate taking their hands off the keys." }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-32 px-6 sm:px-12 bg-white">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6">
            <motion.div variants={fadeInUp}>
              <div className="inline-block bg-[var(--ct-ink)] text-white text-sm font-bold uppercase tracking-widest px-4 py-1 mb-8 border-2 border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)]">
                The Features
              </div>
              <h2 className="text-5xl sm:text-7xl font-black font-display uppercase tracking-tighter leading-none mb-6">
                Built For <br /> Maximum Action
              </h2>
              <p className="text-[var(--ct-ink-muted)] text-xl max-w-2xl font-medium leading-relaxed">
                We stripped away the fluff, the greenwashing, and the vanity metrics to give you a dashboard that focuses entirely on hard data and real-world impact.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {features.map((feature, i) => (
              <motion.div key={i} variants={fadeInUp} className={`card-brutal p-10 ${feature.bg} ${feature.text || ''} hover:-translate-y-2 transition-transform`}>
                <div className={`w-16 h-16 ${feature.iconBg} border-4 border-[var(--ct-border-hard)] shadow-[4px_4px_0px_var(--ct-border-hard)] flex items-center justify-center mb-8`}>
                  <feature.icon className={`w-8 h-8 ${feature.text === 'text-white' ? 'text-[var(--ct-ink)]' : 'text-[var(--ct-ink)]'}`} />
                </div>
                <h3 className="text-2xl font-black font-display uppercase mb-4">{feature.title}</h3>
                <p className={`font-medium leading-relaxed text-lg ${feature.descText || 'text-[var(--ct-ink-muted)]'}`}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Deep Dive Section */}
      <section className="py-32 px-6 sm:px-12 bg-[var(--ct-bg-surface)] border-t-4 border-[var(--ct-border-hard)]">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-24 text-center">
            <h2 className="text-4xl sm:text-6xl font-black font-display uppercase tracking-tighter leading-none mb-8">
              Under The Hood
            </h2>
            <p className="text-xl text-[var(--ct-ink-muted)] font-medium max-w-3xl mx-auto leading-relaxed">
              CarbonTrack isn't just a pretty UI. It's powered by robust logic processing, precise emission factors, and systems designed to handle thousands of localized data points without breaking a sweat.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16">
            {deepFeatures.map((feat, i) => (
              <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white border-4 border-[var(--ct-border-hard)] rounded-full flex items-center justify-center mb-8 shadow-[6px_6px_0px_var(--ct-border-hard)]">
                  <feat.icon className="w-10 h-10 text-[var(--ct-ink)]" />
                </div>
                <h4 className="text-2xl font-black font-display uppercase tracking-wide mb-4">{feat.title}</h4>
                <p className="text-[var(--ct-ink-muted)] text-lg font-medium leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 sm:px-12 bg-[var(--ct-ink)] text-white border-t-4 border-[var(--ct-border-hard)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl sm:text-7xl font-black font-display uppercase tracking-tighter leading-none mb-8">
            Ready to track?
          </h2>
          <p className="text-xl text-gray-400 font-medium mb-12">
            Join the brutalist revolution in carbon accounting. Data-driven, uncompromising, and absolutely free.
          </p>
          <Link to="/auth" className="btn-brutal inline-block bg-[var(--ct-accent)] text-[var(--ct-ink)] text-xl px-12 py-5 font-black uppercase tracking-wider mx-auto hover:bg-white transition-colors shadow-[8px_8px_0px_var(--ct-border-hard)]">
            Open The Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
