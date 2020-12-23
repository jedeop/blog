import React from 'react'
import { PostForList } from '@/types/post'
import { parseISO, formatDistanceToNow } from 'date-fns'
import koLocale from 'date-fns/locale/ko'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'
import { Clock, Calendar } from 'react-feather'

const Main = styled.div`
  margin: 60px 0px;
  line-height: 1.2;
`
const Title = styled.div`
  font-weight: bold;
  font-size: 25px;
`
const Hr = styled.div`
  margin: 5px 0px;
  border-top: 1px solid hsl(0, 0%, 90%);
`
const Summary = styled.div`
  font-size: 18px;
  color: #707070;
`
const Meta = styled.div`
  font-size: 16px;
  font-weight: 300;
  margin-top: 5px;
  color: hsl(0, 0%, 60%);
  display: flex;
  flex-wrap: wrap;
`
const RightSide = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`
const Tag = styled.div`
  margin-right: 5px;
`
const styledIcon = css`
  margin: 0px 3px;
`
const StyledClock = styled(Clock)`
  ${styledIcon}
`
const StyledCalendar = styled(Calendar)`
  ${styledIcon}
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
        <Hr />
        <Summary>{summary}</Summary>
        <Meta>
            <Tag>#Rust</Tag>
            <Tag>#에러 처리</Tag>
            <Tag>#프로그래밍</Tag>
          <RightSide>
            <StyledCalendar size={16} />
            {formatDistanceToNow(parseISO(createdAt), { locale: koLocale })} 전 ⋮ 
            <StyledClock size={16} />{readTime}분
          </RightSide>
        </Meta>
      </Main>
    </Link>
  )
}