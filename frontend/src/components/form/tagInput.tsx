import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import BaseButton from "./BaseButton";
import BaseInput from "./BaseInput";

const AddTag = styled.div`
  display: flex;
`;
const Tags = styled.div`
  background-color: hsl(0, 0%, 97%);
`;
const Tag = styled.span`
  padding: 0px 10px;
  cursor: pointer;
  :hover {
    background-color: hsl(0, 0%, 87%);
  }
`;
const NoTag = styled.span`
  font-style: italic;
  color: hsl(0, 0%, 30%);
`;

interface TagInputProps {
  tags: string[],
  setTags: (value: string[]) => void,
}
export default function TagInput({tags, setTags}: TagInputProps): ReactElement {
  const [tagInput, setTagInput] = useState("");
  function addTagHandler() {
    if (tagInput == "") return;
    setTags([...tags, tagInput]);
    setTagInput("");
  }
  function removeTagHandler(target: string) {
    setTags(tags.filter(tag => tag !== target));
  }
  return (
    <div>
      <AddTag>
        <BaseInput type="text" value={tagInput} onChange={setTagInput} placeholder="새로운 태그를 입력하세요" />
        <BaseButton value="추가하기" onClick={addTagHandler} />
      </AddTag>
      <Tags>
        {
          tags.length > 0
            ? tags.map(tag => (
              <Tag key={tag} onClick={() => removeTagHandler(tag)}>
                #{tag}
              </Tag>
            ))
            : <NoTag>태그가 없습니다.</NoTag>
        }
      </Tags>
    </div>
  );
}