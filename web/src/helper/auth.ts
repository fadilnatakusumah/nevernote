import storage from "local-storage-fallback";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { useEffect, useState } from "react";
import { EXPRESS_URL } from "..";
import { useApolloClient } from "@apollo/client";

const TOKEN = process.env.REACT_APP_TOKEN!;
export const saveToken = (token: string) => storage.setItem(TOKEN, token);
export const getToken = (): string | null => storage.getItem(TOKEN);
export const clearToken = () => storage.removeItem(TOKEN);

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const { exp }: JwtPayload = jwtDecode(token);
    if (Date.now() >= exp! * 1000) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const usePrepareApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { resetStore } = useApolloClient();

  useEffect(() => {
    fetch(`${EXPRESS_URL}/refresh-token`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.access_token) {
          saveToken(data?.access_token);
          setIsLoading(false);
        } else {
          clearToken();
          resetStore();
          setIsLoading(false);
        }
      });
  }, [resetStore]);

  return { isLoading };
};
