import React from 'react'

interface TitleProp {
  title: string,
}

const PostTitle = ({ title }: TitleProp) => {
  return (
    <div>
      {title}
    </div>
  )
}

export default PostTitle