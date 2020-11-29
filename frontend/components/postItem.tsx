import styles from '../styles/postItem.module.scss'

interface PostItemProps {
  title: string,
  intro?: string,
  readTime: number,
  created: Date,
}
export default function PostItem({ title, intro, readTime, created }: PostItemProps) {
  return (
    <div className={styles.main}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subTitle}>
        <div className={styles.intro}>{intro}</div>
        <div className={styles.meta}>{readTime}분 | {created.toDateString()}</div>
      </div>
    </div>
  )
}