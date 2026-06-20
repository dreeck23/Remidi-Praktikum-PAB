import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { DBService } from '../services/db';
import AppLogo from './AppLogo';

interface LoginViewProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onLoginSuccess: () => void;
}

export default function LoginView({
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onLoginSuccess
}: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      return setError('Silakan isi Email dan Password terlebih dahulu!');
    }

    setLoading(true);

    setTimeout(() => {
      try {
        // Authenticate user session
        DBService.loginUser(email, password);
        onLoginSuccess();
      } catch (err: any) {
        setError(err.message || 'Login gagal.');
      } finally {
        setLoading(false);
      }
    }, 1000); // network latency lag
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* LOGO AREA - Premium stylized Rocket News logo */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="group relative"
          >
            <AppLogo size="lg" showText={false} />
          </motion.div>

          <h2 className="mt-4 text-center font-display text-2xl font-bold tracking-tight text-white">
            SpaceNews <span className="text-sky-400">Core</span>
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            Masuk dan baca kabar luar angkasa terbaru
          </p>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-center text-xs text-rose-400"
          >
            {error}
          </motion.div>
        )}

        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@gmail.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          {/* PASSWORD & FORGOT PASSWORD LINK */}
          <div>
            <div className="flex justify-between items-center mb-1 ml-1">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-xs text-indigo-400 hover:underline hover:text-indigo-300 focus:outline-none"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password Anda"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* BUTTON LOGIN */}
          <button
            type="submit"
            className="w-full relative overflow-hidden rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition-all flex items-center justify-center mt-6"
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* REDIRECT SIGNUP */}
        <div className="text-center pt-2">
          <span className="text-xs text-slate-500 font-sans">Belum punya akun? </span>
          <button
            onClick={onNavigateToRegister}
            className="text-xs text-cyan-400 font-semibold hover:underline focus:outline-none ml-1"
            disabled={loading}
          >
            Daftar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
