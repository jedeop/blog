import styles from '../styles/postItem.module.scss'
import { Post } from '../types/post'
import format from 'date-fns/format'

interface PostItemProps {
  post: Post
}
export default function PostItem({ post }: PostItemProps) {
  const { title, intro, readTime, created } = post;

  return (
    <div className={styles.main}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subTitle}>
        <div className={styles.intro}>{intro}</div>
        <div className={styles.meta}>{readTime}분 | {format(created, 'yyyy.MM.dd')}</div>
      </div>
    </div>
  )
}