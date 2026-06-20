import { Article } from '../types';

// High-Fidelity fallback backup dataset in case of SpaceflightNewsAPI limits or offline outage
const OFFLINE_NEWS_BACKUP: Article[] = [
  {
    id: 101,
    title: "NASA's Voyager 1 Sends Readable Data After Thruster Recovery",
    url: "https://www.nasa.gov",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=700&h=450&fit=crop",
    news_site: "NASA Science",
    summary: "NASA's Voyager 1 spacecraft is communicating normally again with Earth following a clever command sequence that fired backup thrusters that hadn't been utilized for decades. Ground teams resolved a critical telemetry data distortion.",
    published_at: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
    featured: true
  },
  {
    id: 102,
    title: "SpaceX Super Heavy Booster Catches at launch pad Mechazilla",
    url: "https://www.spacex.com",
    image_url: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=700&h=450&fit=crop",
    news_site: "Spaceflight Now",
    summary: "SpaceX successfully caught its Super Heavy booster of Starship test flight back on the launching tower arms on the very first try. The engineering feat marks a milestone in rapid orbital rocket reuse capability.",
    published_at: new Date(Date.now() - 3600000 * 6).toISOString(), // 6 hours ago
    featured: false
  },
  {
    id: 103,
    title: "James Webb Captures Haunting New Views of the Pillars of Creation",
    url: "https://www.nasa.gov",
    image_url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=700&h=450&fit=crop",
    news_site: "Space.com",
    summary: "A spectacular near-infrared look from the JWST space observatory has penetrated dust structures to present thousands of newborn stars in the iconic Pillars of Creation star-forming region located inside the Eagle Nebula.",
    published_at: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
    featured: false
  },
  {
    id: 104,
    title: "China's Chang'e 6 Lunar Lander Touches Down on Far Side of Moon",
    url: "https://www.spacenews.com",
    image_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=700&h=450&fit=crop",
    news_site: "SpaceNews",
    summary: "China's uncrewed lunar explorer successfully touched down inside the immense South Pole-Aitken crater on the far side of the moon to collect historic soil samples from this unexplored terrain.",
    published_at: new Date(Date.now() - 3600000 * 30).toISOString(), // 1.2 days ago
    featured: false
  },
  {
    id: 105,
    title: "Hubble Telescope Identifies Massive Water Vapor Plumes on Europa",
    url: "https://www.nasa.gov",
    image_url: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=700&h=450&fit=crop",
    news_site: "Science Daily",
    summary: "Water vapor vents have been photographed breaching the icy shell of Jupiter's moon Europa, signaling potential oceanic hydrothermal vents and heightening prospects of microbiological habitats.",
    published_at: new Date(Date.now() - 3600000 * 42).toISOString(), // 1.7 days ago
    featured: false
  },
  {
    id: 106,
    title: "Starliner Spacecraft Completes Docking to Space Station Under Backup Controls",
    url: "https://www.boeing.com",
    image_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=700&h=450&fit=crop",
    news_site: "NASA Science",
    summary: "Astronauts Sunita Williams and Butch Wilmore successfully navigated Boeing's CST-100 Starliner capsule to dock onto the ISS using manual backup thruster operations and manual override switches.",
    published_at: new Date(Date.now() - 3600000 * 60).toISOString(), // 2.5 days ago
    featured: false
  }
];

export class APIService {
  private static readonly API_URL = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=20';

  static async fetchArticles(): Promise<Article[]> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`API response error: ${response.status}`);
      }
      
      const payload = await response.json();
      
      if (payload && Array.isArray(payload.results) && payload.results.length > 0) {
        // Map the API results to our format
        return payload.results.map((item: any, idx: number) => ({
          id: item.id || (200 + idx),
          title: item.title,
          url: item.url,
          image_url: item.image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=700&h=450&fit=crop',
          news_site: item.news_site || 'Space News',
          summary: item.summary || 'Tidak ada ringkasan teks untuk berita ini.',
          published_at: item.published_at || new Date().toISOString(),
          // Make first article the featured headline news
          featured: idx === 0
        }));
      }

      throw new Error('Emply results from API');
    } catch (error) {
      console.warn('Gagal memuat Spaceflight API. Menggunakan backup offline data:', error);
      // Return beautiful offline mock cards so the application is completely functional
      return OFFLINE_NEWS_BACKUP;
    }
  }
}
