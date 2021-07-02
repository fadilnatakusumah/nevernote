import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { CONST } from "../constants/strings";
import { MyContext } from "../graphql/UserResolver";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  try {
    const bearer = context.req.headers["authorization"];
    const token = bearer!.split(" ")[1];
    if (!token) throw new Error("Not authenticated");

    const tokenPayload = verify(token, CONST.ACCESS_TOKEN_SECRET);
    if (!tokenPayload) throw new Error("Not authenticated");

    context.tokenPayload = tokenPayload as any;
  } catch (error) {
    throw new Error("Not authenticated");
  }
  return next();
};
