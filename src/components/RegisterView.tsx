import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { DBService } from '../services/db';
import AppLogo from './AppLogo';

interface RegisterViewProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: () => void;
}

export default function RegisterView({ onNavigateToLogin, onRegisterSuccess }: RegisterViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instagram, setInstagram] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError('Nama Lengkap wajib diisi!');
    if (!email.trim()) return setError('Email wajib diisi!');
    if (!password.trim()) return setError('Password wajib diisi!');
    if (password.length < 6) return setError('Password minimal 6 karakter!');

    setLoading(true);

    setTimeout(() => {
      try {
        // Register user via our secure authentication persistence service
        DBService.registerUser(name, email, password, instagram);
        onRegisterSuccess();
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat mendaftar.');
      } finally {
        setLoading(false);
      }
    }, 1000); // realistic network lag
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* LOGO AREA - Modern design logo */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="group relative"
          >
            <AppLogo size="lg" showText={false} />
          </motion.div>

          <h2 className="mt-4 text-center font-display text-2xl font-bold tracking-tight text-white">
            Daftar Akun Baru
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            Bergabung dengan Portal SpaceNews Core
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
          {/* NAMA LENGKAP */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Jane Doe"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

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
                placeholder="cth. user@gmail.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          {/* INSTAGRAM (for dynamic profile load) */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">
              Akun Instagram (Opsional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500 font-mono text-sm">
                @
              </div>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="username_kamu"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
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

          {/* BUTTON REGISTER */}
          <button
            type="submit"
            className="w-full relative overflow-hidden rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition-all flex items-center justify-center mt-6"
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
            ) : (
              'Daftar'
            )}
          </button>
        </form>

        {/* NAVIGATION SWITCH BUTTON */}
        <div className="text-center">
          <button
            onClick={onNavigateToLogin}
            className="text-xs text-indigo-400 hover:underline hover:text-indigo-300 transition-colors"
            disabled={loading}
          >
            Apakah sudah punya akun? Login
          </button>
        </div>
      </div>
    </div>
  );
}
