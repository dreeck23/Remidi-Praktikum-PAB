import { useEffect } from 'react';
import { motion } from 'motion/react';
import AppLogo from './AppLogo';

interface SplashViewProps {
  onComplete: () => void;
}

export default function SplashView({ onComplete }: SplashViewProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Wajib berjalan dengan delay tepat 3 detik
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#020617] text-slate-300 select-none">
      <div className="relative flex flex-col items-center">
        {/* Animated App Logo Container exactly matching Rocket News */}
        <motion.div
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: [0.82, 1.05, 1], opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative"
        >
          <AppLogo size="lg" showText={false} />
          
          {/* Ambient Outer Rings */}
          <div className="absolute -inset-2 rounded-3xl border border-sky-500/20 animate-ping opacity-40 pointer-events-none" />
          <div className="absolute -inset-4 rounded-[2.5rem] border border-sky-500/5 opacity-20 pointer-events-none" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
        >
          SpaceNews <span className="text-sky-400">Core</span>
        </motion.h1>

        {/* Tagline / Telemetry indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-2 flex items-center space-x-1 font-mono text-[10px] tracking-wide text-slate-400 uppercase"
        >
          <span>v3.19.4</span>
          <span className="text-slate-600">•</span>
          <span className="text-sky-400 font-bold">STABLE</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400">ONLINE</span>
        </motion.div>
      </div>

      {/* CircularProgressIndicator di tengah layar bagian bawah */}
      <div className="absolute bottom-24 flex flex-col items-center space-y-3">
        {/* Smooth Custom iOS/Flutter style Spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-sky-400" />
        <span className="font-mono text-[9px] tracking-wider text-slate-500">
          LOADING CORE DATA...
        </span>
      </div>

      <div className="absolute bottom-6 font-mono text-[9px] text-slate-600">
        SPACENEWS CORE DEV ENV
      </div>
    </div>
  );
}
