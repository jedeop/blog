import Head from 'next/head'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Head>
        <title>제덮 블로그</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>
          블로그
        </h1>
      </header>
      <main>
        {children}
      </main>
      <footer>
      </footer>
    </div>
  )
}