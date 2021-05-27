import type { ResetPasswordInput, SignupInput } from "../graphql/user";
import type { User } from "./schema/user";

export interface UserOpertations {
  createUser: (details: SignupInput) => Promise<User>;
  findByEmail: (email: string) => Promise<User | null>;
  resetPassword: (credentials: ResetPasswordInput) => Promise<User>;
}
