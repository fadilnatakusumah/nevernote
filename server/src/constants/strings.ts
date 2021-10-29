import "dotenv/config";

export const CONST = {
  MYSQL_HOST_IP: process.env.MYSQL_HOST_IP || "localhost",
  REACT_WEB: process.env.REACT_WEB,
  PORT: process.env.PORT!,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  JWT_COOKIE: "nevernote-jwt",
};
