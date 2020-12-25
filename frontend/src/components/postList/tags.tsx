import { Tag } from '@/types/tag'
import React from 'react'
import styled from 'styled-components'

const Tag = styled.div`
  margin-right: 5px;
`
interface TagsProps {
  tags: Tag[]
}
export default function Tags({ tags }: TagsProps) {
  const tagsList = tags.map(tag => <Tag key={tag.tag_id}>#{tag.name}</Tag>)
  return (
    <>
      {tagsList}
    </>
  )
}