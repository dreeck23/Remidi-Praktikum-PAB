import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Instagram, LogOut, Check, Edit3, X, Camera, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';
import { DBService } from '../services/db';

interface ProfilePanelProps {
  user: UserProfile;
  onLogout: () => void;
  onUpdateSuccess: () => void;
}

export default function ProfilePanel({ user, onLogout, onUpdateSuccess }: ProfilePanelProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user.displayName);
  const [editInstagram, setEditInstagram] = useState(user.instagram);
  const [saving, setSaving] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const handleUpdateProfile = (e: FormEvent) => {
    e.preventDefault();
    setErrorCode(null);

    if (!editName.trim()) {
      return setErrorCode('Nama Lengkap tidak boleh kosong.');
    }

    setSaving(true);
    setTimeout(() => {
      try {
        // Enforce instagram @ prefix if missing
        let igHandle = editInstagram.trim();
        if (igHandle && !igHandle.startsWith('@')) {
          igHandle = '@' + igHandle;
        }

        DBService.updateUserProfile(user.uid, {
          displayName: editName.trim(),
          instagram: igHandle || '@spacenews.user'
        });

        // Trigger notification and callback success
        DBService.addCustomNewsNotification(
          'Profil Diperbarui',
          `Informasi untuk ${editName.trim()} berhasil disimpan ke cloud database.`,
          'info'
        );

        onUpdateSuccess();
        setEditing(false);
      } catch (err: any) {
        setErrorCode(err.message || 'Gagal memperbarui profil.');
      } finally {
        setSaving(false);
      }
    }, 800);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Panel header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="font-mono text-[9px] uppercase tracking-widest text-sky-450">
          Akun Pengguna
        </h2>
        <h1 className="font-display text-lg font-bold tracking-tight text-white mt-0.5">
          Halaman <span className="text-sky-400">Profile</span>
        </h1>
      </div>

      {/* Main Profile Info Card */}
      <div className="rounded border border-slate-800 bg-[#0F172A]/70 p-5 flex flex-col items-center shadow-md relative overflow-hidden">
        {/* Decorative galaxy design flare */}
        <div className="absolute top-0 right-0 h-16 w-16 bg-sky-500/5 rounded-full blur-xl pointer-events-none" />
        
        {/* Foto Profil Avatar */}
        <div className="relative group/avatar">
          <div className="h-20 w-20 rounded-full p-1 bg-gradient-to-tr from-sky-500 to-sky-650 shadow overflow-hidden">
            <img
              src={user.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName)}`}
              alt={user.displayName}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover rounded-full bg-slate-950"
            />
          </div>
          {/* Custom Avatar editor icon decoration */}
          <div className="absolute bottom-0 right-0 h-6 w-6 bg-slate-900 hover:bg-slate-800 border border-slate-705 rounded-full flex items-center justify-center text-sky-400 cursor-pointer transition-colors">
            <Camera className="h-3 w-3" />
          </div>
        </div>

        {/* User main titles */}
        <div className="text-center mt-3.5 space-y-0.5">
          <h2 className="font-display text-sm font-bold text-white tracking-tight">
            {user.displayName}
          </h2>
          <div className="flex items-center justify-center space-x-1 font-mono text-[10px] text-sky-400">
            <Instagram className="h-3 w-3" />
            <span>{user.instagram}</span>
          </div>
        </div>

        {/* Small metadata stats container */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-4 border-t border-slate-800 text-center select-none font-mono">
          <div className="rounded bg-[#020617] border border-slate-800 p-2">
            <span className="block text-[8px] text-slate-550 uppercase tracking-widest">Database</span>
            <span className="block text-[9px] font-bold text-emerald-400 uppercase mt-0.5">Firestore</span>
          </div>
          <div className="rounded bg-[#020617] border border-slate-800 p-2">
            <span className="block text-[8px] text-slate-550 uppercase tracking-widest">Auth Provider</span>
            <span className="block text-[9px] font-bold text-[#38BDF8] uppercase mt-0.5">Firebase</span>
          </div>
        </div>
      </div>

      {/* Profile detail list fields */}
      <AnimatePresence mode="wait">
        {!editing ? (
          <motion.div
            key="display_mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {/* Nama Lengkap field */}
            <div className="flex items-center p-3 bg-[#0F172A]/40 border border-slate-800 rounded space-x-3">
              <User className="h-4.5 w-4.5 text-slate-500" />
              <div>
                <span className="block text-[8px] uppercase font-mono tracking-widest text-slate-550">
                  Nama Lengkap
                </span>
                <span className="font-sans text-xs font-semibold text-white">
                  {user.displayName}
                </span>
              </div>
            </div>

            {/* Email field */}
            <div className="flex items-center p-3 bg-[#0F172A]/40 border border-slate-800 rounded space-x-3">
              <Mail className="h-4.5 w-4.5 text-slate-500" />
              <div className="overflow-hidden">
                <span className="block text-[8px] uppercase font-mono tracking-widest text-slate-550">
                  Email Terdaftar
                </span>
                <span className="font-sans text-xs font-semibold text-white break-all">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Instagram field */}
            <div className="flex items-center p-3 bg-[#0F172A]/40 border border-slate-800 rounded space-x-3">
              <Instagram className="h-4.5 w-4.5 text-slate-500" />
              <div>
                <span className="block text-[8px] uppercase font-mono tracking-widest text-slate-550">
                  Akun Instagram
                </span>
                <span className="font-mono text-xs text-sky-400">
                  {user.instagram}
                </span>
              </div>
            </div>

            {/* Edit Trigger button */}
            <button
              onClick={() => {
                setEditName(user.displayName);
                setEditInstagram(user.instagram);
                setEditing(true);
              }}
              className="w-full flex items-center justify-center space-x-1.5 rounded bg-slate-900 border border-slate-700 hover:border-slate-600 py-2.5 text-xs font-mono font-bold text-slate-350 hover:text-white transition-all text-center uppercase"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>EDIT DATA PROFIL</span>
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="edit_mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleUpdateProfile}
            className="space-y-3.5 border border-sky-900/40 bg-sky-950/5 p-4 rounded"
          >
            <div className="text-[10px] font-mono font-bold text-sky-450 uppercase tracking-widest mb-1">
              EDIT DATA PENGGUNA
            </div>

            {errorCode && (
              <div className="rounded bg-rose-500/10 border border-rose-500/20 p-2 text-center text-[10px] font-mono text-rose-450 uppercase">
                {errorCode}
              </div>
            )}

            {/* Edit Name input */}
            <div>
              <label className="block text-[9px] text-slate-550 uppercase tracking-wider mb-1 ml-0.5 font-mono">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                placeholder=" ct. Jane Doe"
              />
            </div>

            {/* Edit Instagram input */}
            <div>
              <label className="block text-[9px] text-slate-550 uppercase tracking-wider mb-1 ml-0.5 font-mono">
                Akun Instagram
              </label>
              <input
                type="text"
                value={editInstagram}
                onChange={(e) => setEditInstagram(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded py-2 px-3 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                placeholder="ct. @username"
              />
            </div>

            {/* Action edit group buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex items-center justify-center space-x-1 rounded bg-slate-900 border border-slate-700 py-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-all uppercase"
                disabled={saving}
              >
                <X className="h-3.5 w-3.5" />
                <span>BATAL</span>
              </button>
              <button
                type="submit"
                className="flex items-center justify-center space-x-1 rounded bg-sky-600 border border-sky-500 hover:bg-sky-550 py-2 text-xs font-mono font-bold text-white transition-all uppercase"
                disabled={saving}
              >
                {saving ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>SIMPAN</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Logout Warning Segment Banner */}
      <div className="rounded border border-rose-500/15 bg-rose-500/5 p-3.5 flex gap-3 text-xs text-slate-400 items-start">
        <ShieldAlert className="h-4.5 w-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-mono text-[10px] uppercase font-bold text-slate-200 block">Sesi Keamanan</span>
          <p className="mt-0.5 text-[10px] text-slate-450 leading-relaxed font-sans">
            Menekan tombol Log Out di bawah akan mengakhiri sesi Firebase autentikasi Anda saat ini, membersihkan local token tumpukan halaman, dan mengarahkan kembali ke gerbang login pendaftaran.
          </p>
        </div>
      </div>

      {/* Button “Log Out” (Section 10. Tombol Log Out) */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center space-x-2 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 py-3 text-xs font-mono font-bold text-rose-400 hover:text-rose-350 transition-all text-center uppercase"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span>Log Out Sesi Aktif</span>
      </button>
    </div>
  );
}
