import { Tag, TagSimple } from "./tag";

export interface PostForList {
  postId: string,
  title: string,
  summary?: string,
  createdAt: string,
  readTime: number,
  tags?: Tag[],
  isPublished: boolean,
}

export interface Post {
  postId: string,
  title: string,
  summary?: string,
  contents: string,
  createdAt: string,
  lastUpdate?: string,
  readTime: number,
  tags?: Tag[],
}

export interface PostInput {
  title: string,
  summary?: string,
  contents: string,
  tags?: string[],
  isPublished: boolean,
  seriesId?: string,
}

export interface PostForUpdate {
  title: string,
  summary?: string,
  contents: string,
  tags?: TagSimple[],
  isPublished: boolean,
  seriesId?: string,
}