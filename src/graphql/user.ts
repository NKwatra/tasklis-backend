import { ApolloError, gql } from "apollo-server";
import { Auth } from "../lib/service/auth";
import { transformDoc } from "../lib/utils/doc";
import UserModel from "../model/user";
import type { SignupInput, UserPayload } from "../types/graphql/user";

export const typeDefs = gql`
  extend type Query {
    """
    Used to login user
    """
    login(credentials: LoginInput!): AuthResult!
    """
    Used to verify the OTP send to user email
    """
    verifyOTP(email: String!): VerifyOTPResult!
  }

  extend type Mutation {
    """
    To create a new user of app
    """
    signUp(userDetails: SignupInput!): AuthResult!
    """
    To generate an OTP and send it on user's email
    """
    generateOTP(email: String!): GenerateOTPResult!
    """
    To reset user's password
    """
    resetPassword(credentials: LoginInput!): AuthResult!
  }

  type FullName {
    firstName: String!
    lastName: String!
  }

  type User {
    email: String!
    name: FullName!
    """
    a reference id for the user
    """
    id: ID!
  }

  type AuthResult implements MutResult {
    code: Int!
    message: String!
    user: User
    """
    JWT token for authentication
    """
    token: String
  }

  type GenerateOTPResult implements MutResult {
    code: Int!
    message: String!
    """
    Validity of OTP in terms of number of hours
    """
    validity: Int!
  }

  type VerifyOTPResult {
    valid: Boolean!
  }

  input FullNameInput {
    firstName: String!
    lastName: String!
  }

  input SignupInput {
    email: String!
    password: String!
    name: FullNameInput!
  }

  input LoginInput {
    email: String!
    password: String!
  }
`;

const UserQueryResolvers = {};

const UserMutationResolvers = {
  signUp: async (_: any, { userDetails }: { userDetails: SignupInput }) => {
    try {
      const existingUser = await UserModel.findByEmail(userDetails.email);
      if (existingUser) {
        throw new ApolloError("User already exists", "409");
      }
      const newUser = await UserModel.createUser(userDetails);
      const auth = new Auth<UserPayload>();
      const token = await auth.createToken({
        email: newUser.email,
        id: newUser._id,
      });
      return {
        code: 201,
        message: "User successfully created",
        user: transformDoc(newUser),
        token,
      };
    } catch (err) {
      return {
        code: err instanceof ApolloError ? 409 : 500,
        message: err.message,
        user: null,
        token: null,
      };
    }
  },
};

export const resolvers = {
  Query: {
    ...UserQueryResolvers,
  },
  Mutation: {
    ...UserMutationResolvers,
  },
};
