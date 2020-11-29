import { useState } from 'react'
import PostList from '../components/postList'
import { Post } from '../types/post'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "제목",
      intro: "소개",
      readTime: 5,
      contents: "본문",
      created: new Date()
    },
    {
      id: 2,
      title: "제2",
      intro: "소개2",
      readTime: 10,
      contents: "본문",
      created: new Date("2020/10/11")
    },
    {
      id: 3,
      title: "제목3",
      intro: "소개3",
      readTime: 5,
      contents: "본문",
      created: new Date("2020/11/12")
    }
  ])

  return (
    <div>
      안녕하세요
      <PostList posts={posts} />
    </div>
  )
}
