import React from 'react'
import { PostForList } from '@/types/post'
import formatDate from 'date-fns/format'
import parseDate from 'date-fns/parse'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Clock } from 'react-feather'

const Main = styled.div`
  background-color: white;
  padding: 15px;
  margin: 30px 0px;
  line-height: 1.2;
`
const Title = styled.div`
  font-weight: bold;
  font-size: 25px;
`
const Intro = styled.div`
  font-size: 20px;
  color: #707070;
`
const Meta = styled.div`
  font-size: 16px;
  color: #9b9b9b;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
const Hr = styled.div`
  margin: 5px 0px;
  border-top: 1px solid hsl(0, 0%, 90%);
`
const StyledClock = styled(Clock)`
margin-right: 3px;
`

interface PostItemProps {
  post: PostForList
}
export default function PostItem({ post }: PostItemProps) {
  const { title, intro, readTime, created, id } = post;

  return (
    <Link to={`/post/${id}`} >
      <Main>
        <Title>{title}</Title>
        <Intro>{intro}</Intro>
        <Hr />
        <Meta><StyledClock size={16} />{readTime}분 | {formatDate(parseDate(created, 'yyyy-MM-dd HH:mm:SS', new Date()), 'yyyy.MM.dd')}</Meta>
      </Main>
    </Link>
  )
}