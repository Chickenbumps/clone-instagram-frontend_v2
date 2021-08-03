import { useReactiveVar } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";

import React from "react";
import styled from "styled-components";
import { darkModeVar, disabledDarkMode, enableDarkMode } from "../../apollo";
import { MyComponentProps } from "../../type";

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Wrapper = styled.div`
  max-width: 350px;
  width: 100%;
`;
const Footer = styled.footer`
  margin-top: 20px;
`;
const DarkModeBtn = styled.span`
  cursor: pointer;
`;

function AuthLayout({ children }: MyComponentProps) {
  const darkmode = useReactiveVar(darkModeVar);
  return (
    <Container>
      <Wrapper>{children}</Wrapper>
      <Footer>
        <DarkModeBtn onClick={darkmode ? disabledDarkMode : enableDarkMode}>
          <FontAwesomeIcon icon={darkmode ? faSun : faMoon} />
        </DarkModeBtn>
      </Footer>
    </Container>
  );
}

export default AuthLayout;
