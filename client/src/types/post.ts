export interface PostForList {
  id: number,
  title: string,
  intro?: string,
  created: string,
  readTime: number,
}

export interface Post {
  id: number,
  title: string,
  intro?: string,
  contents: string,
  created: string,
  edited?: string,
  readTime: number,
}