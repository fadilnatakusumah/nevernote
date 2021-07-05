import { compare, hash } from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
} from "../helpers/generateToken";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entity/User";
import { Response, Request } from "express";
import { getConnection } from "typeorm";
import { verify } from "jsonwebtoken";
import { CONST } from "../constants/strings";
import { isAuth } from "../helpers/isAuth";

export interface MyContext {
  res: Response;
  req: Request;
  tokenPayload?: {
    userId: string;
    tokenVersion?: number;
  };
}

@ObjectType()
class LoginResponse {
  @Field(() => String)
  access_token: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hello WORLD";
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() ctx: MyContext) {
    const payload = ctx.tokenPayload;
    if (!payload) return null;
    try {
      const user = await User.findOne(payload.userId);
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async signup(@Arg("email") email: string, @Arg("password") password: string) {
    try {
      const findUser = await User.findOne({ where: { email } });
      if (findUser) throw new Error("User with that email is already exist");

      await User.insert({
        email,
        password: await hash(password, 12),
        username: email.split("@")[0],
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("User with that email is doesn't exist");

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) throw new Error("Password is invalid");

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      sendRefreshToken(res, refreshToken);

      return {
        access_token: accessToken,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => Boolean)
  async revokeUserSession(@Arg("userId") userId: string) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId! }, "token_version", 1);
    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext) {
    ctx.res.clearCookie(CONST.JWT_COOKIE);
    return true;
  }
}
