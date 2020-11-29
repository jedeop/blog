import Head from 'next/head'
import Logo from '../components/logo'
import styles from '../styles/layout.module.scss'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>제덮 블로그</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
          <Logo width={100} />
          <span>블로그</span>
      </header>
      <main>
        {children}
      </main>
      <footer>
      </footer>
    </div>
  )
}