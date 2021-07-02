import styled from "@emotion/styled";
import { MIXINS } from "./GlobalStyle";

export const Wrapper = ({ children, ...props }: any) => (
  <WrapperStyled {...props}>{children}</WrapperStyled>
);

const WrapperStyled = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: hidden;

  ${(props: any) => (props.center ? MIXINS.va() : "")}

  background-color: ${(props: any) =>
    props.backgroundColor ? props.backgroundColor : `unset`}
`;
