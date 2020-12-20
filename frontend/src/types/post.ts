export interface PostForList {
  postId: string,
  title: string,
  summary?: string,
  createdAt: string,
  readTime: number,
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