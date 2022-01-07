import styled from "styled-components";

export function Layout({ children }: any) {
  return <LayoutStyled>{children}</LayoutStyled>;
}

const LayoutStyled = styled.div`
  width: 100%;
  height: 100vh;
`;
export default Layout;
