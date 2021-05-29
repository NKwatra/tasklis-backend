import { ApolloServer } from "apollo-server-express";
import express from "express";
import schema from "./graphql";
import { config } from "dotenv";
import mongoose from "mongoose";
import { contextMiddleware } from "./lib/utils/context";
import cookieParser from "cookie-parser";

// load configurations to process object
const result = config();

if (result.error) {
  throw new Error("cannot load env variables");
}

async function startServer() {
  const app = express();

  // set up middlewares for express
  app.use(cookieParser());

  // create an apollo server instance
  const server = new ApolloServer({
    schema,
    context: contextMiddleware,
  });
  await server.start();

  // apply express as middleware to apollo server
  server.applyMiddleware({ app });

  // listen to server
  await new Promise((resolve) =>
    app.listen(process.env.PORT, () => resolve(true))
  );
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
  );
}

mongoose
  .connect(process.env.DB as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    startServer();
  })
  .catch((err) => console.error(err));
