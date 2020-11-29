import PostItem from '../components/postItem'

export default function Home() {
  return (
    <div>
      안녕하세요
      <PostItem title="Rust 프로그래밍 언어 소개" intro="도대체 어떻게 C++를 대체하겠다는 걸까?" readTime={5} created={new Date()} />
    </div>
  )
}
