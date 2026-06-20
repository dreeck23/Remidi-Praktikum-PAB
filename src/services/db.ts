import { UserProfile, FavoriteRecord, NotificationItem, Article } from '../types';

// Predefined default notification feed as required by 'Halaman Notifikasi'
const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'New Starship Test Flight Scheduled',
    body: 'SpaceX has received regulatory approval for the next orbital test flight of the massive Starship launch vehicle from Starbase, Texas.',
    category: 'launch',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    isRead: false
  },
  {
    id: 'notif_2',
    title: 'James Webb Detects Water Vapor in Inner Disk of Star System',
    body: 'The Telescope discovered water vapor in the inner planet-forming region of the young star PDS 70, giving insights into rocky planet habitability.',
    category: 'info',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    isRead: false
  },
  {
    id: 'notif_3',
    title: 'Geomagnetic Storm Watch Active',
    body: 'NOAA issues moderate storm watch following a powerful coronal mass ejection (CME) heading towards Earth, promising spectacular auroras.',
    category: 'alert',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    isRead: true
  },
  {
    id: 'notif_4',
    title: 'Artemis II Orion Spacecraft Undergoes Final Thermal Chamber Tests',
    body: 'NASA engineers have successfully completed deep space environment simulation testing for the crewed spacecraft at Kennedy Space Center.',
    category: 'info',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    isRead: true
  }
];

// LocalStorage Keys
const KEYS = {
  USERS: 'spacenews_users',
  CURRENT_USER: 'spacenews_current_user',
  FAVORITES: 'spacenews_favorites',
  NOTIFICATIONS: 'spacenews_notifications',
  WELCOME_SEEN: 'spacenews_welcome_seen'
};

// Simple Password helper mapping
interface UserCredential extends UserProfile {
  passwordHash: string;
}

export class DBService {
  // --- SESSION & USER AUTHENTICATION ---

  static registerUser(name: string, email: string, passwordHash: string, instagram: string): UserProfile {
    const users = this.getUsers();
    
    // Check if user already exists
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('Email ini sudah terdaftar. Silakan login!');
    }

    const uid = 'user_' + Math.random().toString(36).substring(2, 11);
    const lowercaseEmail = email.toLowerCase();
    
    // Default avatar from internet based on username
    const avatarName = encodeURIComponent(name);
    const photoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${avatarName}&backgroundColor=1e293b,0f172a,334155&textColor=f8fafc`;

    const newUser: UserCredential = {
      uid,
      email: lowercaseEmail,
      displayName: name,
      instagram: instagram || '@spacenews.user',
      photoUrl,
      passwordHash
    };

    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

    // Save as current active session (SharedPreferences/LocalStorage)
    this.setCurrentSession(newUser);
    return this.sanitizeUserProfile(newUser);
  }

  static loginUser(email: string, passwordHash: string): UserProfile {
    const users = this.getUsers();
    const target = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash);
    
    if (!target) {
      throw new Error('Email atau Password Anda salah. Silakan coba lagi!');
    }

    this.setCurrentSession(target);
    return this.sanitizeUserProfile(target);
  }

  static forgotPassword(email: string): boolean {
    const users = this.getUsers();
    const target = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!target) {
      throw new Error('Email tidak ditemukan dalam sistem kami.');
    }
    // Simulate sending password reset email
    return true;
  }

  static updateUserProfile(uid: string, updates: Partial<UserProfile>): UserProfile {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.uid === uid);
    
    if (userIndex === -1) {
      throw new Error('Profil pengguna tidak ditemukan.');
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

    const currentSession = this.getCurrentUser();
    if (currentSession && currentSession.uid === uid) {
      const updatedProfile = { ...currentSession, ...updates };
      this.setCurrentSession(updatedProfile as UserCredential);
      return updatedProfile;
    }

    return this.sanitizeUserProfile(users[userIndex]);
  }

  static getCurrentUser(): UserProfile | null {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    if (!data) return null;
    try {
      const parsed = JSON.parse(data);
      return this.sanitizeUserProfile(parsed);
    } catch {
      return null;
    }
  }

  static checkWelcomeSeen(): boolean {
    return localStorage.getItem(KEYS.WELCOME_SEEN) === 'true';
  }

  static setWelcomeSeen(seen: boolean): void {
    localStorage.setItem(KEYS.WELCOME_SEEN, seen ? 'true' : 'false');
  }

  static logout(): void {
    localStorage.removeItem(KEYS.CURRENT_USER);
    localStorage.removeItem(KEYS.WELCOME_SEEN);
  }

  // --- FAVORITE COLLECTIONS ---

  static getFavoritesForUser(userId: string): FavoriteRecord[] {
    const data = localStorage.getItem(KEYS.FAVORITES);
    if (!data) return [];
    try {
      const list: FavoriteRecord[] = JSON.parse(data);
      return list.filter(f => f.userId === userId);
    } catch {
      return [];
    }
  }

  static toggleFavorite(userId: string, article: Article): boolean {
    const data = localStorage.getItem(KEYS.FAVORITES);
    let list: FavoriteRecord[] = [];
    if (data) {
      try {
        list = JSON.parse(data);
      } catch {
        list = [];
      }
    }

    const docId = `${userId}_${article.id}`;
    const index = list.findIndex(f => f.id === docId);

    if (index > -1) {
      // It exists: remove it (unfavorite)
      list.splice(index, 1);
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(list));
      return false; // Result is unfavorited
    } else {
      // It does not exist: add it (favorite)
      const newFav: FavoriteRecord = {
        id: docId,
        articleId: article.id,
        userId: userId,
        title: article.title,
        imageUrl: article.image_url,
        newsSite: article.news_site,
        summary: article.summary,
        publishedAt: article.published_at,
        favoritedAt: new Date().toISOString()
      };
      list.push(newFav);
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(list));
      return true; // Result is favorited
    }
  }

  static isArticleFavorited(userId: string, articleId: number): boolean {
    const favs = this.getFavoritesForUser(userId);
    return favs.some(f => f.articleId === articleId);
  }

  // --- NOTIFICATION COLLECTIONS ---

  static getNotifications(): NotificationItem[] {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!data) {
      // Seed default notifications on first launch
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  }

  static markNotificationAsRead(id: string): NotificationItem[] {
    const items = this.getNotifications();
    const updated = items.map(item => 
      item.id === id ? { ...item, isRead: true } : item
    );
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  }

  static addCustomNewsNotification(title: string, body: string, category: 'info' | 'alert' | 'launch'): void {
    const items = this.getNotifications();
    const newItem: NotificationItem = {
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      title,
      body,
      category,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    items.unshift(newItem); // put it at start
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(items));
  }

  // --- PRIVATE UTILS ---

  private static getUsers(): UserCredential[] {
    const data = localStorage.getItem(KEYS.USERS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private static setCurrentSession(user: UserCredential): void {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  }

  private static sanitizeUserProfile(user: UserCredential): UserProfile {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      instagram: user.instagram,
      photoUrl: user.photoUrl
    };
  }
}
