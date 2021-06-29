import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { CONST } from "./constants/strings";
import { MyContext, UserResolver } from "./graphql/UserResolver";

createConnection()
  .then(async (connection) => {
    const app = express();
    // Express middlewares
    app.use(cors());
    app.use(morgan("dev"));

    app.get("/", (req, res) => {
      res.send("HELLO WORLD");
    });

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [UserResolver],
      }),
      context: ({ req, res }): MyContext => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app });

    app.listen(CONST.PORT, () =>
      console.log(`Server running on http://localhost:${CONST.PORT}/graphql`)
    );
  })
  .catch((error) => console.log(error));
