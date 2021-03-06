import React, { ReactElement } from "react";
import formatDate from "date-fns/format";
import parseISO from "date-fns/parseISO";
import styled from "styled-components";
import { Clock } from "react-feather";
import { Tag } from "@/types/tag";
import Tags from "../postList/tags";

const Title = styled.div`
  font-size: 40px;
  font-weight: bold;
  line-height: 1.2;
  margin: 10px 0px;
`;
const Summary = styled.div`
  font-size: 22px;
  color: var(--fg1-color);
  font-weight: 300;
  line-height: 1;
`;
const Meta = styled.div`
  display: flex;
  font-size: 16px;
  color: var(--fg2-color);
  justify-content: space-between;
  margin-top: 5px;
`;
const ReadTime = styled.div`
  display: flex;
  align-items: center;
`;
const StyledClock = styled(Clock)`
  margin-right: 5px;
`;
const Hr = styled.div`
  border-top: 1px solid var(--bg2-color);
  margin: 10px 0px;
`;
const TagsContainer = styled.div`
  display: flex;
  font-weight: 300;
  color: var(--fg2-color);
  > div {
    margin-right: 5px;
  }
`;

interface TitleProp {
  title: string,
  summary?: string,
  createdAt: string,
  readTime: number,
  tags?: Tag[],
}

const PostTitle = ({ title, summary, createdAt, readTime, tags }: TitleProp): ReactElement => {
  return (
    <header>
      <Title>{title}</Title>
      <Summary>{summary}</Summary>
      <Meta>
        <div>{formatDate(parseISO(createdAt), "yyyy.MM.dd HH:mm")}</div>
        <ReadTime><StyledClock size={16} />{readTime}분</ReadTime>
      </Meta>
      <Hr />
      <TagsContainer>
        <Tags tags={tags || []} />
      </TagsContainer>
    </header>
  );
};

export default PostTitle;