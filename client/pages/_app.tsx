import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GlobalStyles } from "../components/GlobalStyle";
import { ApolloProvider } from "@apollo/client";
import { client } from "../apollo/ApolloClient";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <GlobalStyles />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
