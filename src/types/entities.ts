// login
export interface Login {
    id: string;
    email?: string;
    passwordHash?: string;
    role: "Admin" | "Editor" | "User";
    createdAt: string;
    updatedAt: string;
  }
  
  // user
  export interface User {
    id: string;
    name: string;
    phone: string;
    address: string;
    verifiedAt?: string;
    createdAt: string;
    updatedAt: string;
    loginId: string;
    login?: Login;
  }
  
  // oauthaccount
  export interface OAuthAccount {
    id: string;
    provider: string;
    providerUserId: string;
    accessToken: string;
    refreshToken: string;
    expireAt: string;
    loginId: string;
    login?: Login;
  }
  
  // era
  export interface Era {
    id: string;
    name: string;
    yearStart: number;
    yearEnd: number;
    description: string;
  }
  
  // article
  export interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    coverUrl: string;
    yearStart: number;
    yearEnd: number;
    eraId: string;
    era?: Era;
    sources: ArticleSource[]; // JSON
    publishedAt?: string;
    createdAt: string;
  }

  export interface ArticleSource {
    title: string;
    url: string;
  }
  
  // articleaudio
  export interface ArticleAudio {
    id: string;
    articleId: string;
    voiceId: string;
    url: string;
    duration: number;
    createdBy: string;
    creator?: User;
  }
  
  // podcast
  export interface Podcast {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    createdAt: string;
    episodes?: PodcastEpisode[];
  }
  
  // podcastepisode
  export interface PodcastEpisode {
    id: string;
    podcastId: string;
    title: string;
    audioUrl: string;
    duration: number;
    articleId?: string | null;
    episodeNumber: number;
    isDeleted?: boolean; // thêm optional nếu API trả
  }
  
  // category
  export interface Category {
    id: string;
    name: string;
  }
  
  // product
  export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: string[]; // JSON
    categoryId: string;
    category?: Category;
  }
  
  // order
  export interface Order {
    id: string;
    userId: string;
    total: number;
    payment: string;
    createdAt: string;
    status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
    user?: User;
    items?: OrderItem[];
  }
  
  // orderitem
  export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    qty: number;
    price: number;
    product?: Product;
  }
  
  // liketable
  export interface LikeTable {
    id: string;
    userId: string;
    targetId: string;
    targetType: "article" | "audio" | "podcast" | "product";
    createdAt: string;
    user?: User;
  }
  
  // historylog
  export interface HistoryLog {
    id: string;
    userId: string;
    targetId: string;
    targetType: "article" | "audio" | "podcast";
    progress: number;
    createdAt: string;
    user?: User;
  }
  
  // comment
  export interface Comment {
    id: string;
    userId: string;
    targetId: string;
    targetType: "article" | "audio" | "podcast" | "product";
    content: string;
    imageUrl?: string;
    createdAt: string;
    parentId?: string;
    parent?: Comment;
    user?: User;
  }
  
  // bookmark
  export interface Bookmark {
    id: string;
    userId: string;
    targetId: string;
    targetType: "article" | "audio" | "podcast" | "product";
    createdAt: string;
    user?: User;
  }
  
  // tag
  export interface Tag {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
  }
  
  // articletag
  export interface ArticleTag {
    id: string;
    articleId: string;
    tagId: string;
    article?: Article;
    tag?: Tag;
  }
  
  // notification
  export interface Notification {
    id: string;
    userId: string;
    type: string;
    content: string;
    targetId?: string;
    targetType?: "article" | "audio" | "podcast" | "product" | "order";
    isRead: boolean;
    createdAt: string;
    user?: User;
  }
  