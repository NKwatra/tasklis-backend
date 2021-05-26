import { gql, makeExecutableSchema } from "apollo-server";
import { typeDefs as UserSchema } from "./user";

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

export default makeExecutableSchema({
  typeDefs: [Root, UserSchema],
  resolvers: {},
});
