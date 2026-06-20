import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Share2, Globe, Calendar, Clock } from 'lucide-react';
import { Article, UserProfile } from '../types';
import { DBService } from '../services/db';

interface DetailViewProps {
  article: Article;
  user: UserProfile;
  onBack: () => void;
  onFavoritesChanged?: () => void;
}

export default function DetailView({ article, user, onBack, onFavoritesChanged }: DetailViewProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check initial favorite state for the user/article
    setIsFavorite(DBService.isArticleFavorited(user.uid, article.id));
    // Window scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [article.id, user.uid]);

  const handleFavoriteToggle = () => {
    const nextState = DBService.toggleFavorite(user.uid, article);
    setIsFavorite(nextState);
    if (onFavoritesChanged) onFavoritesChanged();
    
    // Add custom notification for engagement!
    if (nextState) {
      DBService.addCustomNewsNotification(
        'Artikel Ditambahkan ke Favorit',
        `"${article.title}" kini tersimpan rapi di tab Favorite Anda.`,
        'info'
      );
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(article.url || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Human-readable date string format
  const formattedDate = new Date(article.published_at).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col pb-16">
      {/* Floating Sticky Navigation Bar - AppBar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[#1E293B] px-4 py-2.5 border-b border-slate-800 shadow">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white active:scale-95 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <span className="font-mono text-[10px] font-bold tracking-wider text-slate-350 max-w-[150px] truncate uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
          {article.news_site}
        </span>

        <div className="flex items-center space-x-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="relative flex h-8 w-8 items-center justify-center rounded bg-slate-900 border border-slate-705 text-slate-300 hover:text-white active:scale-95 transition-all"
          >
            {copied ? (
              <span className="absolute -bottom-8 right-0 rounded bg-sky-600 border border-sky-500 px-1.5 py-0.5 text-[8px] font-mono text-white whitespace-nowrap z-50">
                TERSALIN!
              </span>
            ) : null}
            <Share2 className="h-3.5 w-3.5" />
          </button>

          {/* Heart shaped icon (Favorite Button) at top/AppBar */}
          <button
            onClick={handleFavoriteToggle}
            className={`flex h-8 w-8 items-center justify-center rounded border active:scale-90 transition-all ${
              isFavorite
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Vertically Scrollable Content */}
      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* News Image: Giant photo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-video w-full overflow-hidden rounded bg-[#0F172A] border border-slate-800 shadow"
        >
          <img
            src={article.image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=700&h=450&fit=crop'}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/95 via-transparent to-transparent" />
          
          {/* Publisher credit badge */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 rounded bg-sky-600 px-2 py-0.5 text-[9px] font-mono font-bold text-white shadow">
            <Globe className="h-3 w-3" />
            <span>{article.news_site.toUpperCase()}</span>
          </div>
        </motion.div>

        {/* Categories, Source and Timeline Metadata */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-[10px] text-slate-500 font-mono">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>3 mnt baca</span>
          </div>
          <span className="px-1.5 py-0.2 bg-sky-950/20 text-sky-400 border border-sky-500/20 rounded font-bold">INFO DECK</span>
        </div>

        {/* Title: Judul Lengkap */}
        <h1 className="font-display text-base sm:text-lg font-bold tracking-tight leading-snug text-white">
          {article.title}
        </h1>

        {/* Divider line */}
        <div className="h-px bg-slate-800" />

        {/* Summary Block: Teks Ringkasan ("summary") */}
        <div className="space-y-3 font-sans text-xs leading-relaxed text-slate-300">
          <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-sky-400 first-letter:float-left first-letter:mr-2">
            {article.summary || "Tidak ada ringkasan yang tersedia untuk artikel ini."}
          </p>
          
          <p className="text-slate-400 italic font-sans text-[11px] leading-relaxed pt-2">
            Artikel ini diterbitkan secara internasional oleh portal berita <span className="font-semibold text-sky-400">{article.news_site}</span>. SpaceNews Core menyajikan ikhtisar akurat dan komprehensif mengenai eksplorasi antariksa internasional secara real-time.
          </p>
        </div>

        {/* Expand Outbound link */}
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center space-x-2 rounded bg-slate-900 border border-slate-700 py-2.5 px-4 text-[11px] font-mono font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-all text-center"
          >
            <Globe className="h-3.5 w-3.5 text-sky-400" />
            <span>BUKA SUMBER ASLI ({article.news_site.toUpperCase()})</span>
          </a>
        )}
      </div>
    </div>
  );
}
