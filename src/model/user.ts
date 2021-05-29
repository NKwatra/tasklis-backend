import { ApolloError } from "apollo-server-errors";
import type {
  ResetPasswordInput,
  SignupInput,
  UpdateUserInput,
} from "../types/graphql/user";
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
      throw new Error("User does not exists");
    }
    user.password = credentials.password;
    user = await user.save();
    return user;
  }

  async updateUser(
    id: string,
    updates: UpdateUserInput & { refresh_token?: string }
  ) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User does not exist");
    }

    if (updates.firstName) {
      user.name.firstName = updates.firstName;
    }

    if (updates.lastName) {
      user.name.lastName = updates.lastName;
    }

    if (updates.refresh_token) {
      user.refresh_token = updates.refresh_token;
    }

    const updatedUser = await user.save();
    return updatedUser;
  }

  async findById(id: string) {
    const user = await User.findById(id);
    return user;
  }
}

export default new UserModel();
