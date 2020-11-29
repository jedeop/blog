import { PostForList } from '../types/post'
import PostItem from './postItem'
import { useQuery, gql } from '@apollo/client'

import styles from '../styles/postList.module.scss'

const GET_POSTS = gql`
query GetPosts {
  posts {
    edges {
      node {
        id
        title
        intro
        created
        readTime
      }
      cursor
    }
  }
}
`

export default function PostList() {
  const { loading, error, data } = useQuery(GET_POSTS)
  
  if (loading) return <div>로딩 중</div>
  if (error) return <div>에러 발생: {error}</div>

  const list = data.posts.edges.map(({ node }: { node: PostForList }) => <PostItem key={node.id} post={node}/>)
  return (
    <div className={styles.container}>
      {list}
    </div>
  )
}