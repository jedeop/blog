import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import BaseButton from "./form/BaseButton";

const NavContainer = styled.div`
  display: flex;
  overflow: hidden;
`;
const Item = styled.div`
  min-height: 50px;
  overflow: hidden;
`;

interface item {
  name: string,
  children: JSX.Element,
}
interface SwitchProps {
  items: item[],
}
export default function Switch({ items }: SwitchProps): ReactElement {
  const [selected, setSelected] = useState(0);

  const nav = items.map((item, i) => <BaseButton key={item.name} onClick={() => setSelected(i)} value={item.name} active={selected == i} />);

  return (
    <div>
      <NavContainer>
        {nav}
      </NavContainer>
      <Item>
        {items[selected]?.children}
      </Item>
    </div>
  );
}