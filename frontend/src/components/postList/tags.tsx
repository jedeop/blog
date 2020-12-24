import React from 'react'
import styled from 'styled-components'

const Tag = styled.div`
  margin-right: 5px;
`
interface TagsProps {
  tags: string[]
}
export default function Tags({ tags }: TagsProps) {
  const tagsList = tags.map(tag => <Tag>#{tag}</Tag>)
  return (
    <>
      {tagsList}
    </>
  )
}