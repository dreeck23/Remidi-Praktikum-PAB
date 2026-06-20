import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, AlertTriangle, Radio, Rocket, Circle, CheckCheck } from 'lucide-react';
import { NotificationItem } from '../types';
import { DBService } from '../services/db';

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const list = DBService.getNotifications();
    // Sort chronologically (newest first)
    list.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setNotifications(list);
  };

  const handleMarkAsRead = (id: string) => {
    const updated = DBService.markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = () => {
    notifications.forEach(notif => {
      if (!notif.isRead) {
        DBService.markNotificationAsRead(notif.id);
      }
    });
    loadNotifications();
  };

  // Helper to resolve icon based on event category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'launch':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded bg-sky-500/10 border border-sky-500/20 text-sky-450">
            <Rocket className="h-4.5 w-4.5" />
          </div>
        );
      case 'alert':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded bg-amber-500/10 border border-amber-500/20 text-amber-450">
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
        );
      default:
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Radio className="h-4.5 w-4.5" />
          </div>
        );
    }
  };

  // Human-friendly relative time counter
  const formatTimeAgo = (dateStr: string) => {
    const past = new Date(dateStr).getTime();
    const now = Date.now();
    const diff = now - past;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return `${days} hari lalu`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-4 pb-20">
      {/* Header Panel */}
      <div className="flex items-end justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="font-mono text-[9px] uppercase tracking-widest text-sky-450">
            Pusat Informasi
          </h2>
          <h1 className="font-display text-lg font-bold tracking-tight text-white mt-0.5 flex items-center space-x-2">
            <span>REMIDI PAB</span>
            {unreadCount > 0 && (
              <span className="flex h-4 bg-sky-600 text-[9px] font-mono px-1.5 items-center justify-center rounded text-white shadow font-bold">
                {unreadCount} UNREAD
              </span>
            )}
          </h1>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center space-x-1 text-xs text-sky-450 hover:text-sky-350 font-mono font-bold focus:outline-none bg-[#0F172A] border border-slate-800 px-2 py-1 rounded"
          >
            <CheckCheck className="h-3.5 w-3.5 text-sky-450" />
            <span>MARK READ</span>
          </button>
        )}
      </div>

      {/* Notifications list queue */}
      <AnimatePresence mode="popLayout">
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center rounded border border-dashed border-slate-800 p-8 bg-[#0F172A]/35"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-900 border border-slate-800 text-slate-500 mb-4 animate-pulse">
              <Bell className="h-4 w-4" />
            </div>
            <p className="text-xs font-mono text-slate-400">TIDAK ADA PEMBERITAHUAN</p>
            <p className="text-[11px] text-slate-550 max-w-xs mt-1 font-sans">
              Kotak masuk Anda kosong untuk saat ini. Kami akan mengabari Anda jika ada laporan peluncuran roket orbital terbaru!
            </p>
          </motion.div>
        ) : (
          <div className="divide-y divide-slate-900 border-t border-b border-slate-900">
            {notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
                onClick={() => handleMarkAsRead(notif.id)}
                className={`py-3 px-1.5 flex gap-3 transition-colors cursor-pointer select-none relative ${
                  !notif.isRead ? 'bg-sky-950/5' : ''
                }`}
              >
                {/* Visual Unread dot indicator at left margin */}
                {!notif.isRead && (
                  <div className="absolute left-0 top-5">
                    <Circle className="h-1.5 w-1.5 fill-sky-400 text-sky-400 animate-pulse" />
                  </div>
                )}

                {/* Left side Category Icon Badge */}
                <div className="flex-shrink-0 ml-2">
                  {getCategoryIcon(notif.category)}
                </div>

                {/* Central details */}
                <div className="flex-1 space-y-0.5">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-display text-[11px] sm:text-xs font-bold leading-tight ${
                      !notif.isRead ? 'text-sky-300 font-extrabold' : 'text-slate-350 font-semibold'
                    }`}>
                      {notif.title}
                    </h3>
                  </div>
                  <p className="font-sans text-[11px] text-slate-400 leading-relaxed pr-2">
                    {notif.body}
                  </p>
                  <div className="text-[9px] text-slate-500 font-mono tracking-wide pt-1 uppercase">
                    • {formatTimeAgo(notif.timestamp)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
