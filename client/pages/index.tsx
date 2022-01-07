import { NextRouter, useRouter } from "next/router";
import { ListNotesEditor } from "../components/ListNotesEditor";
import { Navigation } from "../components/Navigation";
import { Wrapper } from "../components/Wrapper";
import styled from "styled-components";
import { isAuthenticated } from "../helper/auth";
import { useEffect } from "react";

export default function Home() {
  const { replace } = useRouter();
  // if (!isAuthenticated() && !isServer) {
  //   return replace("/login");
  // }

  useEffect(() => {
    if (process.browser) {
      if (!isAuthenticated()) {
        replace("/login");
      }
    }
  }, []);

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
