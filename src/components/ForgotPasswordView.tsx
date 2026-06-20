import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { DBService } from '../services/db';

interface ForgotPasswordViewProps {
  onNavigateToLogin: () => void;
}

export default function ForgotPasswordView({ onNavigateToLogin }: ForgotPasswordViewProps) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      return setError('Silakan masukkan alamat Email Anda!');
    }

    setLoading(true);

    setTimeout(() => {
      try {
        DBService.forgotPassword(email);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || 'Gagal mengirim email pemulihan.');
      } finally {
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Navigation back */}
        <button
          onClick={onNavigateToLogin}
          className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm font-medium self-start"
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke login</span>
        </button>

        <div className="space-y-2">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-white">
            Forgot Password?
          </h2>
          <p className="font-sans text-sm text-slate-400">
            Masukkan email terdaftar Anda di bawah. Kami akan mengirimkan pesan verifikasi untuk mengatur ulang password Anda.
          </p>
        </div>

        {/* FEEDBACK MASSAGES */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-4 text-center text-xs text-rose-400"
          >
            {error}
          </motion.div>
        )}

        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-6 text-center space-y-3"
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Send className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-white">Email Pemulihan Dikirim!</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tautan pemulihan password berhasil dikirim ke <span className="font-semibold text-emerald-300">{email}</span>. Silakan periksa folder masuk atau spam Anda.
            </p>
            <button
              onClick={onNavigateToLogin}
              className="mt-4 text-xs font-semibold text-indigo-400 hover:underline"
            >
              Masuk dengan Password baru Anda
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL ROW */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 uppercase tracking-wider">
                Alamat Email
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

            {/* ACTION FORGOT BUTTON */}
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
              ) : (
                <>
                  <span>Send to email</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
