import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Globe, RefreshCcw, Star, Calendar, ArrowUpRight } from 'lucide-react';
import { Article } from '../types';
import { APIService } from '../services/api';

interface HomePanelProps {
  onSelectArticle: (article: Article) => void;
}

export default function HomePanel({ onSelectArticle }: HomePanelProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = ['Semua', 'NASA', 'SpaceX', 'ESA', 'Misi'];

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await APIService.fetchArticles();
      setArticles(data);
    } catch {
      // Robust error fallback already handled by APIService
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic: matching search input AND publisher categories
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.news_site.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'Semua') return matchesSearch;
    if (activeCategory === 'NASA') return matchesSearch && article.news_site.toLowerCase().includes('nasa');
    if (activeCategory === 'SpaceX') return matchesSearch && article.news_site.toLowerCase().includes('spacex');
    if (activeCategory === 'ESA') return matchesSearch && (article.news_site.toLowerCase().includes('esa') || article.news_site.toLowerCase().includes('europe'));
    if (activeCategory === 'Misi') return matchesSearch && (article.summary.toLowerCase().includes('misi') || article.title.toLowerCase().includes('mission') || article.summary.toLowerCase().includes('lunar') || article.summary.toLowerCase().includes('moon'));
    
    return matchesSearch;
  });

  // Extract primary headline: First featured or fallback first article
  const headlineNews = articles.find(a => a.featured) || articles[0];
  const listArticles = headlineNews 
    ? filteredArticles.filter(a => a.id !== headlineNews.id) 
    : filteredArticles;

  return (
    <div className="space-y-4 pb-20">
      {/* Header Widget */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="font-mono text-[9px] uppercase tracking-widest text-sky-400 flex items-center space-x-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
            Advanced Live Deck
          </h2>
          <h1 className="font-display text-lg font-bold tracking-tight text-white mt-0.5">
            SpaceNews <span className="text-sky-400">Core</span>
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 border border-slate-700 font-mono">
            v3.19.4
          </span>
          <button
            onClick={loadNews}
            className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-650 active:scale-95 transition-all"
            title="Refresh Berita"
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Modern Search Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
          <Search className="h-3.5 w-3.5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berita luar angkasa..."
          className="w-full bg-[#0F172A] border border-slate-800 rounded py-2 pl-9 pr-4 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-sky-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-[9px] font-mono text-slate-400 hover:text-white"
          >
            HAPUS
          </button>
        )}
      </div>

      {/* Horizontal Category Slider Container */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded px-3 py-1 text-xs font-mono transition-all ${
              activeCategory === cat
                ? 'bg-sky-600 text-white border border-sky-500'
                : 'bg-[#0F172A] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-sky-400" />
          <span className="font-mono text-[9px] tracking-wider text-slate-500 uppercase">
            Fetching celestial feeds...
          </span>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filteredArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded border border-dashed border-slate-800 p-12 text-center bg-[#0F172A]/40"
            >
              <p className="text-xs font-mono text-slate-400">TIDAK ADA BERITA DITEMUKAN</p>
              <p className="text-[11px] text-slate-550 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* HEADLINE NEWS BANNER (Section 6. Bagian atas menampilkan banner Headline News) */}
              {headlineNews && !searchQuery && activeCategory === 'Semua' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => onSelectArticle(headlineNews)}
                  className="group relative overflow-hidden rounded border border-slate-800 bg-[#0F172A] shadow-lg cursor-pointer"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={headlineNews.image_url}
                      alt={headlineNews.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/45 to-transparent" />
                    
                    {/* Floating Headline Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center space-x-1 rounded bg-sky-550 px-2 py-0.5 text-[8px] font-mono font-bold text-white uppercase tracking-wider shadow">
                      <Star className="h-2 w-2 fill-white" />
                      <span>HEADLINE</span>
                    </div>

                    {/* Media site label */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1 text-[10px] text-sky-400 font-mono font-bold bg-[#020617]/70 px-2 py-0.5 rounded border border-sky-500/20 backdrop-blur-sm">
                      <Globe className="h-3 w-3" />
                      <span>{headlineNews.news_site.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Headline Title & Description */}
                  <div className="p-3.5 space-y-1.5 border-t border-slate-800/60">
                    <h3 className="font-display text-sm font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                      {headlineNews.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                      {headlineNews.summary}
                    </p>
                    <div className="flex items-center justify-between pt-1.5 text-[9px] text-slate-500 font-mono">
                      <span>{new Date(headlineNews.published_at).toLocaleDateString()}</span>
                      <span className="group-hover:text-sky-400 transition-colors flex items-center space-x-0.5">
                        <span>BACA SELENGKAPNYA</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* DYNAMIC ARTICLE LIST (Section 6. Kumpulan berita secara dinamis) */}
              <div className="grid grid-cols-1 gap-2.5">
                {listArticles.map((article, idx) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.2 }}
                    onClick={() => onSelectArticle(article)}
                    className="group flex p-2.5 bg-[#0F172A]/70 border border-slate-800/80 rounded hover:border-slate-750 hover:bg-[#0F172A] transition-all duration-200 cursor-pointer items-start space-x-3.5"
                  >
                    {/* Small article photo aspect-square */}
                    <div className="relative aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-[#020617] border border-slate-800">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Text block */}
                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Source Media */}
                      <span className="text-[9px] font-mono font-bold text-sky-450 uppercase tracking-wider block">
                        {article.news_site}
                      </span>

                      {/* Title */}
                      <h4 className="font-display text-[11px] sm:text-xs font-bold text-white tracking-tight line-clamp-2 group-hover:text-sky-350 transition-colors">
                        {article.title}
                      </h4>

                      {/* Footer Info */}
                      <div className="flex items-center space-x-1 text-[9px] text-slate-500 font-mono pt-1">
                        <Calendar className="h-2.5 w-2.5" />
                        <span>{new Date(article.published_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
