import { Post } from '../types/post'
import PostItem from './postItem'

import styles from '../styles/postList.module.scss'

interface PostListProps {
  posts: Post[],
}

export default function PostList({posts}: PostListProps) {
  const list = posts.map(post => <PostItem key={post.id} post={post}/>)
  return (
    <div className={styles.container}>
      {list}
    </div>
  )
}