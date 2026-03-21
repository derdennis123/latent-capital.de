// Ghost Content API type definitions

export interface GhostNavItem {
  label: string;
  url: string;
}

export interface GhostTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  feature_image: string | null;
  visibility: string;
  meta_title: string | null;
  meta_description: string | null;
  count?: {
    posts: number;
  };
}

export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

export interface GhostPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string | null;
  excerpt: string | null;
  custom_excerpt: string | null;
  feature_image: string | null;
  featured: boolean;
  published_at: string;
  updated_at: string;
  reading_time: number;
  tags: GhostTag[];
  primary_tag: GhostTag | null;
  authors: GhostAuthor[];
  primary_author: GhostAuthor | null;
  visibility: string;
  access: boolean;
}

export interface GhostPage {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string | null;
  excerpt: string | null;
  custom_excerpt: string | null;
  feature_image: string | null;
  featured: boolean;
  published_at: string;
  updated_at: string;
  reading_time: number;
  tags: GhostTag[];
  primary_tag: GhostTag | null;
  authors: GhostAuthor[];
  primary_author: GhostAuthor | null;
  visibility: string;
  access: boolean;
}

export interface GhostSettings {
  title: string;
  description: string;
  logo: string | null;
  cover_image: string | null;
  icon: string | null;
  lang: string;
  timezone: string;
  navigation: GhostNavItem[];
  meta_title: string | null;
  meta_description: string | null;
}

export interface GhostPagination {
  page: number;
  limit: number;
  pages: number;
  total: number;
  next: number | null;
  prev: number | null;
}

export interface GhostPostsResponse {
  posts: GhostPost[];
  meta: {
    pagination: GhostPagination;
  };
}

export interface GhostTagsResponse {
  tags: GhostTag[];
  meta: {
    pagination: GhostPagination;
  };
}

export interface GhostAuthorsResponse {
  authors: GhostAuthor[];
  meta: {
    pagination: GhostPagination;
  };
}

export interface GhostPagesResponse {
  pages: GhostPage[];
  meta: {
    pagination: GhostPagination;
  };
}

export interface GhostSettingsResponse {
  settings: GhostSettings;
}
