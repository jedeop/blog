export interface Post {
  id: number,
  title: string,
  intro?: string,
  contents: string,
  created: Date,
  edited?: Date,
  readTime: number,
}