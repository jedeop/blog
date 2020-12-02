import React from 'react'
import { PostForList } from '@/types/post'
import formatDate from 'date-fns/format'
import parseDate from 'date-fns/parse'
import styled from 'styled-components'

const Main = styled.div`
  background-color: white;
  padding: 20px;
  margin: 15px 0px;
`
const Title = styled.div`
  font-weight: bold;
  font-size: 25px;
`
const SubTitle = styled.div`
`
const Intro = styled.div`
  font-size: 20px;
  color: #707070;
`
const Meta = styled.div`
  font-size: 16px;
  color: #9b9b9b;
  text-align: end;
`

interface PostItemProps {
  post: PostForList
}
export default function PostItem({ post }: PostItemProps) {
  const { title, intro, readTime, created } = post;

  return (
    <Main>
      <Title>{title}</Title>
      <SubTitle>
        <Intro>{intro}</Intro>
        <Meta>{readTime}분 | {formatDate(parseDate(created, 'yyyy-MM-dd HH:mm:SS', new Date()), 'yyyy.MM.dd')}</Meta>
      </SubTitle>
    </Main>
  )
}