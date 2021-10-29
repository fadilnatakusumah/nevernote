import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { getToken, isAuthenticated, saveToken } from "./helper/auth";
import reportWebVitals from "./reportWebVitals";

export const EXPRESS_URL = process.env.REACT_APP_EXPRESS_URL;
export const GRAPHQL_URL = `${EXPRESS_URL}/graphql`;

const refreshLink = new TokenRefreshLink({
  accessTokenField: "access_token",
  isTokenValidOrUndefined: () => isAuthenticated(),
  fetchAccessToken: () => {
    return fetch(`${EXPRESS_URL}/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
  },
  handleFetch: (accessToken) => saveToken(accessToken),
  handleError: (err) => {
    console.warn("Your refresh token is invalid. Try to relogin");
    console.error(err);
  },
});

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([refreshLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
