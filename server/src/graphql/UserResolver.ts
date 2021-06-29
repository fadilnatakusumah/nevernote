import { compare, hash } from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/generateToken";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entity/User";
import { Response, Request } from "express";
import { CONST } from "../constants/strings";

export interface MyContext {
  res: Response;
  req: Request;
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

      res.cookie(CONST.JWT_COOKIE, refreshToken, {
        httpOnly: true,
      });

      return {
        access_token: accessToken,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
