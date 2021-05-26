import { ApolloServer } from "apollo-server";
import schema from "./graphql";
import { config } from "dotenv";

// load configurations to process object
const result = config();

if (result.error) {
  throw new Error("cannot load env variables");
}

const server = new ApolloServer({ schema });

server.listen(process.env.PORT).then(({ url }) =>
  console.log(`Server has started at ${url}.
Playground is available at ${url}graphql`)
);
