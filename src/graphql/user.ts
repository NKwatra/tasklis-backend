import { ApolloError, AuthenticationError, gql } from "apollo-server-express";
import { Auth } from "../lib/service/auth";
import { transformDoc } from "../lib/utils/doc";
import { setRefreshTokenCookie } from "../lib/utils/refresh";
import UserModel from "../model/user";
import type { SignupInput, UserPayload } from "../types/graphql/user";
import type { Context } from "../types/lib/utils/context";

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
    """
    Used to refresh JWT tokens on the client
    """
    refreshToken: RefreshTokenResult!
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
    """
    To update user's first and last name
    """
    updateUser(updates: UpdateUserInput): UpdateUserResult!
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

  type RefreshTokenResult {
    code: Int!
    message: String!
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

  type UpdateUserResult implements MutResult {
    code: Int!
    message: String!
    """
    Updated user object
    """
    user: User
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

  input UpdateUserInput {
    firstName: String
    lastName: String
  }
`;

const UserQueryResolvers = {
  refreshToken: async (_: any, _null: any, { refresh_token, res }: Context) => {
    if (!refresh_token) {
      throw new ApolloError("Refresh token not supplied", "400");
    }
    try {
      const auth = new Auth<UserPayload>();
      const {
        valid,
        token: refresh,
        payload,
      } = await auth.verifyRefreshTokenAndCreateNew(refresh_token);

      if (!valid) {
        throw new AuthenticationError("Session expired");
      } else {
        const token = await auth.createToken(payload as UserPayload);
        await UserModel.updateUser(payload!.id, {
          refresh_token: refresh as string,
        });
        setRefreshTokenCookie(res, refresh as string);
        return {
          code: 200,
          token,
          message: "Token refreshed successfully",
        };
      }
    } catch (err) {
      throw err;
    }
  },
};

const UserMutationResolvers = {
  signUp: async (
    _: any,
    { userDetails }: { userDetails: SignupInput },
    { res }: Context
  ) => {
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
      const refresh_token = await auth.createRefreshToken({
        email: newUser.email,
        id: newUser._id,
      });
      const updatedUser = await UserModel.updateUser(newUser._id, {
        refresh_token,
      });
      setRefreshTokenCookie(res, refresh_token);
      return {
        code: 201,
        message: "User successfully created",
        user: transformDoc(updatedUser),
        token,
      };
    } catch (err) {
      throw err;
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
