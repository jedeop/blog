import styles from '../styles/postItem.module.scss'
import { PostForList } from '../types/post'
import formatDate from 'date-fns/format'
import parseDate from 'date-fns/parse'

interface PostItemProps {
  post: PostForList
}
export default function PostItem({ post }: PostItemProps) {
  const { title, intro, readTime, created } = post;
  
  return (
    <div className={styles.main}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subTitle}>
        <div className={styles.intro}>{intro}</div>
        <div className={styles.meta}>{readTime}분 | {formatDate(parseDate(created, 'yyyy-MM-dd HH:mm:SS', new Date()), 'yyyy.MM.dd')}</div>
      </div>
    </div>
  )
}