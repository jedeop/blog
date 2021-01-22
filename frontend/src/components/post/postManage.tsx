import React, { ReactElement } from "react";
import { Edit3, Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  > a {
    margin-left: 10px;
    color: var(--fg2-color);
    transition: color .3s;
    :hover {
      color: var(--fg-color);
    }
  }
  justify-content: flex-end;
`;

interface PostManageProps {
  postId: string,
}
export default function PostManage({ postId }: PostManageProps): ReactElement {
  return (
    <Container>
      <Link to={`/write/${postId}`}>
        <Edit3 size={20} />
      </Link>
      <Link to={`/delete/${postId}`}>
        <Trash2 size={20} />
      </Link>
    </Container>
  );
}
