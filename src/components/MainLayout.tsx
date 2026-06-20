import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Heart, Bell, User } from 'lucide-react';
import { Article, UserProfile } from '../types';
import { DBService } from '../services/db';
import AppLogo from './AppLogo';

// Modular Panels
import HomePanel from './HomePanel';
import FavoritePanel from './FavoritePanel';
import NotificationPanel from './NotificationPanel';
import ProfilePanel from './ProfilePanel';

interface MainLayoutProps {
  user: UserProfile;
  onLogout: () => void;
  onSelectArticle: (article: Article) => void;
  onUpdateUser: () => void; // force parent session update if profile changed
  favoritesChangedTrigger?: number;
}

type TabType = 'home' | 'favorite' | 'notification' | 'profile';

export default function MainLayout({
  user,
  onLogout,
  onSelectArticle,
  onUpdateUser,
  favoritesChangedTrigger
}: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Load unread notifications dynamically
  const notifications = DBService.getNotifications();
  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-350 flex flex-col justify-between">
      {/* Top Universal Branding Bar (except profile where we have header titles) */}
      <header className="px-4 py-2 border-b border-slate-800 bg-[#1E293B] sticky top-0 backdrop-blur-md z-20 flex items-center justify-between select-none shadow">
        <div className="flex items-center space-x-2">
          {/* Custom brand rocket logo for high consistency */}
          <AppLogo size="sm" showText={false} className="scale-90" />
          <span className="font-display text-xs font-bold uppercase tracking-tight text-white mb-0.5">
            SpaceNews Core
          </span>
        </div>

        {/* Dynamic connection indicator representing SharedPreferences/Firestore */}
        <div className="flex items-center space-x-1 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded text-[9px] font-semibold text-emerald-400 font-mono uppercase tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block mr-1" />
          LIVE SESSION
        </div>
      </header>

      {/* Primary Scrollable Core Container */}
      <main className="flex-1 px-4 py-4 overflow-y-auto max-w-2xl w-full mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'home' && (
              <HomePanel onSelectArticle={onSelectArticle} />
            )}
            
            {activeTab === 'favorite' && (
              <FavoritePanel
                user={user}
                onSelectArticle={onSelectArticle}
                refreshTrigger={favoritesChangedTrigger}
              />
            )}
            
            {activeTab === 'notification' && (
              <NotificationPanel />
            )}
            
            {activeTab === 'profile' && (
              <ProfilePanel
                user={user}
                onLogout={onLogout}
                onUpdateSuccess={onUpdateUser}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation Bar (BottomNavigationBar) with 4 menu items */}
      <nav className="sticky bottom-0 z-30 bg-[#1E293B] border-t border-slate-800 px-4 py-2.5 flex justify-around items-center shadow-lg pb-safe">
        {/* TAB 1: Home Dashboard */}
        <button
          onClick={() => setActiveTab('home')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded transition-all duration-200 ${
            activeTab === 'home' ? 'text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <Home className="h-4 w-4 mb-0.5" />
          <span className="text-[9px] font-mono tracking-wide uppercase">Home</span>
          {activeTab === 'home' && (
            <motion.div
              layoutId="nav_dot"
              className="absolute -bottom-1 h-1 w-1 rounded-full bg-sky-400"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>

        {/* TAB 2: Favorites */}
        <button
          onClick={() => setActiveTab('favorite')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded transition-all duration-200 ${
            activeTab === 'favorite' ? 'text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <Heart className="h-4 w-4 mb-0.5" />
          <span className="text-[9px] font-mono tracking-wide uppercase">Favorite</span>
          {activeTab === 'favorite' && (
            <motion.div
              layoutId="nav_dot"
              className="absolute -bottom-1 h-1 w-1 rounded-full bg-sky-400"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>

        {/* TAB 3: Notifications */}
        <button
          onClick={() => setActiveTab('notification')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded transition-all duration-200 ${
            activeTab === 'notification' ? 'text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <div className="relative">
            <Bell className="h-4 w-4 mb-0.5" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5 rounded-full bg-emerald-400 ring-1 ring-[#1E293B] animate-pulse" />
            )}
          </div>
          <span className="text-[9px] font-mono tracking-wide uppercase">Notif</span>
          {activeTab === 'notification' && (
            <motion.div
              layoutId="nav_dot"
              className="absolute -bottom-1 h-1 w-1 rounded-full bg-sky-400"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>

        {/* TAB 4: Profile Settings */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded transition-all duration-200 ${
            activeTab === 'profile' ? 'text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          <User className="h-4 w-4 mb-0.5" />
          <span className="text-[9px] font-mono tracking-wide uppercase">Profile</span>
          {activeTab === 'profile' && (
            <motion.div
              layoutId="nav_dot"
              className="absolute -bottom-1 h-1 w-1 rounded-full bg-sky-400"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      </nav>
    </div>
  );
}
