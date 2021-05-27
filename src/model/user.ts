import { ApolloError } from "apollo-server-errors";
import type { ResetPasswordInput, SignupInput } from "../types/graphql/user";
import type { UserOpertations } from "../types/model/user";
import User from "./schema/user";

class UserModel implements UserOpertations {
  async createUser(details: SignupInput) {
    let newUser = new User(details);
    newUser = await newUser.save();
    return newUser;
  }

  async findByEmail(email: string) {
    const foundUser = await User.findOne({ email });
    return foundUser;
  }

  async resetPassword(credentials: ResetPasswordInput) {
    let user = await this.findByEmail(credentials.email);
    if (!user) {
      throw new ApolloError("User does not exists", "404");
    }
    user.password = credentials.password;
    user = await user.save();
    return user;
  }
}

export default new UserModel();
