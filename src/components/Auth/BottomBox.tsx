import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { BaseBox } from "../shared";

const BasicBottomBox = styled(BaseBox)`
  padding: 20px 0px;
  text-align: center;
  a {
    font-weight: 600;
    margin-left: 5px;
    color: ${(props) => props.theme.accent};
  }
`;
interface PropsBottomBox {
  cta: string;
  link: string;
  linkText: string;
}
const BottomBox: React.FunctionComponent<PropsBottomBox> = ({
  cta,
  link,
  linkText,
}) => {
  return (
    <BasicBottomBox>
      <span>{cta}</span>
      <Link to={link}>{linkText}</Link>
    </BasicBottomBox>
  );
};

export default BottomBox;
