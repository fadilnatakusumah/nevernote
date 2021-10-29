import styled from "@emotion/styled";
import { GENERICS, MIXINS } from "./GlobalStyle";
import { FaBook, FaPlus, FaSearch, FaSignOutAlt } from "react-icons/fa";
import {
  ListNotesDocument,
  useAddNoteMutation,
  useListNotesQuery,
  useLogoutMutation,
  useMeQuery,
} from "../generated/graphql";
import { useHistory } from "react-router-dom";
import { clearToken } from "../helper/auth";
import { useState } from "react";
import { debounceFn } from "../helper/debounce";
import { useEffect } from "react";

export function Navigation() {
  const { replace } = useHistory();
  const [submitLogout, { client }] = useLogoutMutation();
  const { refetch } = useListNotesQuery();
  const { data } = useMeQuery();
  const [submitAddNote] = useAddNoteMutation();
  const [searchText, setSearchText] = useState<string>("");

  const onLogoutHandler = async () => {
    try {
      await submitLogout();
      await client.resetStore();
      clearToken();
      replace("/login");
    } catch (error) {
      console.error(error);
    }
  };
  const onAddNoteHandler = async () => {
    try {
      const note = await submitAddNote({
        variables: {
          title: "Title",
          content: "Content",
        },
      });
      const { listNotes } = client.readQuery({ query: ListNotesDocument });
      client.writeQuery({
        query: ListNotesDocument,
        data: {
          listNotes: [note.data?.addNote, ...listNotes],
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onSearchHandler = debounceFn(async () => {
    await refetch({ search: searchText }).then(({ data: { listNotes } }) => {
      client.writeQuery({
        query: ListNotesDocument,
        data: {
          listNotes,
        },
      });
    });
  }, 1000);

  useEffect(() => {
    onSearchHandler();
  }, [searchText, onSearchHandler]);

  return (
    <NavigationStyled>
      <div className="user-profile">
        <div>{data?.me?.username.substr(0, 1).toUpperCase()}</div>
        <span>{data?.me?.username}</span>
        <span onClick={onLogoutHandler}>
          <FaSignOutAlt />
        </span>
      </div>
      <div className="search-container">
        <FaSearch />
        <input
          placeholder="Search"
          value={searchText}
          onChange={({ target }) => setSearchText(target.value)}
        />
      </div>

      <div className="newnote-button" onClick={onAddNoteHandler}>
        <FaPlus />
        <span>New Note</span>
      </div>
      <ul className="navs-menu">
        <li>
          <FaBook />
          <span>All Notes</span>
        </li>
      </ul>
    </NavigationStyled>
  );
}

const NavigationStyled = styled.div`
  width: 100%;
  height: 100%;
  max-width: 300px;
  background-color: ${GENERICS.colorBlack};
  color: #ccc;

  .user-profile {
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    align-items: center;
    padding: 20px;
    gap: 10px;
    > div:first-of-type {
      background-color: ${GENERICS.primaryColor};
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      ${MIXINS.va()}
    }

    > span:nth-of-type(1) {
      white-space: nowrap;
    }

    > span:last-child {
      justify-self: flex-end;
      cursor: pointer;
      transition: 0.3s;
      padding: 5px;

      &:hover {
        color: red;
      }
    }
  }

  .search-container {
    ${MIXINS.va()}
    padding: 10px 20px;
    border-radius: 30px;
    background-color: ${GENERICS.colorBlackCalm};
    margin: 0 20px;
    margin-bottom: 14px;

    > input {
      background-color: transparent;
      color: #ccc;
      border: none;
      margin-left: 10px;
      font-size: 16px;
      outline: none;
    }
  }

  .newnote-button {
    ${MIXINS.va("left")}
    cursor: pointer;
    gap: 10px;
    color: white;
    border-radius: 30px;
    padding: 10px 20px;
    margin: 0 20px;
    background-color: ${GENERICS.primaryColor};
    &:hover {
      background-color: ${GENERICS.primaryColorDark};
    }
  }

  .active {
    background-color: #444;
    color: white;
  }
  .navs-menu {
    margin-top: 20px;
    > li {
      ${MIXINS.va("left")}
      gap: 10px;
      padding: 10px 40px;
      cursor: pointer;
      &:hover {
        background-color: #333;
      }
    }
  }
`;
