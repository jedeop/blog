import { Tag } from "./tag";

export interface PostForList {
  postId: string,
  title: string,
  summary?: string,
  createdAt: string,
  readTime: number,
  tags?: Tag[],
}

export interface Post {
  postId: string,
  title: string,
  summary?: string,
  contents: string,
  createdAt: string,
  lastUpdate?: string,
  readTime: number,
}

export interface PostInput {
  title: string,
  summary?: string,
  contents: string,
  tags?: string[],
  seriesId?: string,
}