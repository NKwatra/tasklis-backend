import { gql, makeExecutableSchema } from "apollo-server";
import { typeDefs as UserSchema, resolvers as UserResolvers } from "./user";
import { merge } from "lodash";

const Root = gql`
  type Query {
    """
    Placeholder entry, it should not be used
    """
    _empty: String
  }
  type Mutation {
    """
    Placeholder entry, it should not be used
    """
    _empty: String
  }

  interface MutResult {
    "Http Response Code for action"
    code: Int!
    "User readable response message"
    message: String!
  }
`;

const resolvers = {};

export default makeExecutableSchema({
  typeDefs: [Root, UserSchema],
  resolvers: merge(resolvers, UserResolvers),
});
