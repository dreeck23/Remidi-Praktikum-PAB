export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  instagram: string;
  photoUrl?: string;
}

export interface Article {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  featured?: boolean;
}

export interface FavoriteRecord {
  id: string; // Document ID (usually userId_articleId)
  articleId: number;
  userId: string;
  title: string;
  imageUrl: string;
  newsSite: string;
  summary: string;
  publishedAt: string;
  favoritedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: 'info' | 'alert' | 'launch';
  timestamp: string;
  isRead: boolean;
}
