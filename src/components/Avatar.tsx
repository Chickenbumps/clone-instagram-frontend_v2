import styled from "styled-components";

type divCustom = {
  lg?: boolean | null;
};

const SAvatar = styled.div<divCustom>`
  width: ${(props) => (props.lg ? "30px" : "25px")};
  height: ${(props) => (props.lg ? "30px" : "25px")};
  border-radius: 50%;
  background-color: #2c2c2c;
  overflow: hidden;
`;

const Img = styled.img`
  max-width: 100%;
`;

function Avatar({ url = "", lg = false }) {
  return (
    <SAvatar lg={lg}>
      <Img src={url} />
    </SAvatar>
  );
}

export default Avatar;
