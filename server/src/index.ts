import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { verify } from "jsonwebtoken";
import morgan from "morgan";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { CONST } from "./constants/strings";
import { User } from "./entity/User";
import { MyContext, UserResolver } from "./graphql/UserResolver";
import {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
} from "./helpers/generateToken";
import cookieParser from "cookie-parser";
import { NoteResolver } from "./graphql/NoteResolver";

createConnection()
  .then(async (connection) => {
    const app = express();
    // Express middlewares
    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );
    app.use(cookieParser());
    app.use(morgan("dev"));

    app.get("/", (req, res) => {
      res.send("HELLO WORLD");
    });

    app.post("/refresh-token", async (req, res) => {
      const token = req.cookies[CONST.JWT_COOKIE];
      if (!token) return res.send({ success: false, access_token: "" });

      let data: any = null;
      try {
        data = verify(token, CONST.REFRESH_TOKEN_SECRET);
      } catch (error) {
        console.error(error);
        return res.send({ success: false, access_token: "" });
      }

      const user = await User.findOne(data.userId);
      if (!user) {
        return res.send({ success: false, access_token: "" });
      }

      if (user.token_version !== data.tokenVersion) {
        return res.send({ success: false, access_token: "" });
      }

      const access_token = generateAccessToken(user);
      sendRefreshToken(res, generateRefreshToken(user));

      return res.send({ success: false, access_token });
    });

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [UserResolver, NoteResolver],
      }),
      context: ({ req, res }): MyContext => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(CONST.PORT, () =>
      console.log(`Server running on http://localhost:${CONST.PORT}/graphql`)
    );
  })
  .catch((error) => console.log(error));
