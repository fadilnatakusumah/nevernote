import { ListNotesEditor } from "../components/ListNotesEditor";
import { Navigation } from "../components/Navigation";
import { Wrapper } from "../components/Wrapper";
import styled from "@emotion/styled";
import { isAuthenticated } from "../helper/auth";
import { Redirect } from "react-router-dom";

export function Home() {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }

  return (
    <HomeStyled>
      <Navigation />
      <ListNotesEditor />
    </HomeStyled>
  );
}

const HomeStyled = styled(Wrapper)`
  display: flex;
`;
