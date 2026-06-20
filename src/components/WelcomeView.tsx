import { motion } from 'motion/react';
import { Newspaper, ChevronRight } from 'lucide-react';

interface WelcomeViewProps {
  onContinue: () => void;
}

export default function WelcomeView({ onContinue }: WelcomeViewProps) {
  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-[#020617] px-6 py-10 text-slate-300">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-sky-600">
            <Newspaper className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-white">
            SpaceNews Core
          </span>
        </div>
        <div className="flex items-center space-x-1.5 font-mono text-[9px] bg-slate-850 px-2 py-0.5 rounded border border-slate-700">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="font-semibold text-slate-400 uppercase">STABLE</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="my-auto flex flex-col items-center py-6">
        {/* Journalism Illustration from Unsplash */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-800 shadow-xl shadow-sky-950/10"
        >
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=700&h=450&fit=crop&auto=format"
            alt="Journalism Illustration"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover brightness-[0.8]"
          />
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        </motion.div>

        {/* Welcome Messages */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-center font-display text-xl font-extrabold leading-snug text-white"
        >
          Welcome to <span className="text-sky-400">SpaceNews Core</span> Portal
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-3 text-center font-sans text-xs text-slate-400 leading-relaxed"
        >
          Your advanced professional deck for global cosmic intel, live orbital tracker data, telemetry records, and verified exploration feeds.
        </motion.p>
      </div>

      {/* Action Footer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="flex w-full flex-col space-y-4"
      >
        <button
          onClick={onContinue}
          className="group flex w-full items-center justify-center space-x-2 rounded-md bg-sky-600 py-3 px-4 text-xs font-semibold text-white shadow shadow-sky-500/10 transition-all hover:bg-sky-500 active:scale-[0.98]"
        >
          <span>Buka Dashboard Live</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>

        <div className="text-center font-mono text-[9px] text-slate-500 uppercase tracking-widest bg-slate-900/40 py-1.5 rounded border border-slate-800/80">
          SHIELDS ACTIVE • SECURE INTEGRITY LAYER
        </div>
      </motion.div>
    </div>
  );
}
