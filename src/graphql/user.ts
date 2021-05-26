import { gql } from "apollo-server";

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
