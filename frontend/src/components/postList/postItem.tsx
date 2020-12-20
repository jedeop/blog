import React from 'react'
import { PostForList } from '@/types/post'
import formatDate from 'date-fns/format'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Clock } from 'react-feather'
import parseISO from 'date-fns/parseISO'

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
  color: hsl(0, 0%, 60%);
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
  const { title, summary, readTime, createdAt, postId } = post;

  return (
    <Link to={`/post/${postId}`} >
      <Main>
        <Title>{title}</Title>
        <Intro>{summary}</Intro>
        <Hr />
        <Meta><StyledClock size={16} />{readTime}분 | {formatDate(parseISO(createdAt), 'yyyy.MM.dd')}</Meta>
      </Main>
    </Link>
  )
}