import { useEffect, useState, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Globe, Calendar, Trash2 } from 'lucide-react';
import { Article, FavoriteRecord, UserProfile } from '../types';
import { DBService } from '../services/db';

interface FavoritePanelProps {
  user: UserProfile;
  onSelectArticle: (article: Article) => void;
  refreshTrigger?: number; // to sync with changes elsewhere
}

export default function FavoritePanel({ user, onSelectArticle, refreshTrigger }: FavoritePanelProps) {
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);

  useEffect(() => {
    loadFavorites();
  }, [user.uid, refreshTrigger]);

  const loadFavorites = () => {
    const list = DBService.getFavoritesForUser(user.uid);
    // Sort by favorited timestamp descending
    list.sort((a, b) => new Date(b.favoritedAt).getTime() - new Date(a.favoritedAt).getTime());
    setFavorites(list);
  };

  const handleRemoveFavorite = (e: MouseEvent, record: FavoriteRecord) => {
    e.stopPropagation(); // don't open article
    // Create a mock article wrapper to pass to helper
    const dummyArticle: Article = {
      id: record.articleId,
      title: record.title,
      url: '',
      image_url: record.imageUrl,
      news_site: record.newsSite,
      summary: record.summary,
      published_at: record.publishedAt
    };
    DBService.toggleFavorite(user.uid, dummyArticle);
    loadFavorites();
  };

  const handleOpenArticle = (record: FavoriteRecord) => {
    const originalArticle: Article = {
      id: record.articleId,
      title: record.title,
      url: '',
      image_url: record.imageUrl,
      news_site: record.newsSite,
      summary: record.summary,
      published_at: record.publishedAt
    };
    onSelectArticle(originalArticle);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Panel title */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="font-mono text-[9px] uppercase tracking-widest text-sky-450">
          Koleksi Tersimpan
        </h2>
        <h1 className="font-display text-lg font-bold tracking-tight text-white mt-0.5">
          Halaman <span className="text-sky-400">Favorite</span>
        </h1>
        <p className="font-mono text-[10px] text-slate-500 mt-1">
          Sinkronisasi dengan Firestore collection <span className="font-mono text-[9px] text-sky-450 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">favorites</span>
        </p>
      </div>

      {/* Favorites list with framer motion animations */}
      <AnimatePresence mode="popLayout">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center rounded border border-dashed border-slate-800 p-8 bg-[#0F172A]/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-900 border border-slate-800 text-slate-500 mb-4 animate-pulse">
              <Heart className="h-4 w-4" />
            </div>
            <p className="text-xs font-mono text-slate-400">BELUM ADA ARTIKEL FAVORIT</p>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mt-1.5 font-sans">
              Silakan baca artikel berita luar angkasa di halaman depan dan tekan ikon hati untuk menyimpannya ke sini.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            {favorites.map((fav, index) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                onClick={() => handleOpenArticle(fav)}
                className="group relative flex p-2.5 bg-[#0F172A]/70 border border-slate-805 rounded hover:border-slate-750 hover:bg-[#0F172A] transition-all cursor-pointer items-start space-x-3.5"
              >
                {/* Image */}
                <div className="relative aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-[#020617] border border-slate-800">
                  <img
                    src={fav.imageUrl}
                    alt={fav.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Text section */}
                <div className="flex-1 min-w-0 space-y-1 pr-8">
                  <span className="text-[9px] font-mono text-sky-450 font-bold uppercase tracking-wider block">
                    {fav.newsSite}
                  </span>

                  <h3 className="font-display text-[11px] sm:text-xs font-bold text-white leading-snug tracking-tight line-clamp-2 group-hover:text-sky-350 transition-colors">
                    {fav.title}
                  </h3>

                  {/* Metadata and calendar */}
                  <div className="flex items-center space-x-1.5 pt-1.5 text-[9px] text-slate-500 font-mono">
                    <Calendar className="h-2.5 w-2.5" />
                    <span>Disimpan {new Date(fav.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Inline Instant Unfavorite / Delete Action button */}
                <button
                  onClick={(e) => handleRemoveFavorite(e, fav)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded bg-slate-950/80 border border-slate-800 text-slate-500 hover:text-rose-500 hover:border-rose-500/20 active:scale-95 transition-all"
                  title="Hapus dari Favorit"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
