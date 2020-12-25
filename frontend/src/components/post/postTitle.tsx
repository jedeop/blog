import React from 'react'
import formatDate from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import styled from 'styled-components'
import { Clock } from 'react-feather'

const Title = styled.div`
  font-size: 35px;
  font-weight: bold;
  line-height: 1.2;
  margin: 5px 0px;
`
const Meta = styled.div`
  display: flex;
  font-size: 16px;
  color: hsl(0, 0%, 60%);
  justify-content: space-between;
`
const ReadTime = styled.div`
  display: flex;
  align-items: center;
`
const StyledClock = styled(Clock)`
  margin-right: 5px;
`
const Hr = styled.div`
  border-top: 2px solid hsl(0, 0%, 80%);
  margin: 10px 0px;
`

interface TitleProp {
  title: string,
  createdAt: string,
  readTime: number,
}

const PostTitle = ({ title, createdAt, readTime }: TitleProp) => {
  return (
    <header>
      <Title>{title}</Title>
      <Meta>
        <div>{formatDate(parseISO(createdAt), 'yyyy.MM.dd HH:mm')}</div>
        <ReadTime><StyledClock size={16} />{readTime}분</ReadTime>
      </Meta>
      <Hr />
    </header>
  )
}

export default PostTitle