import type {
  ResetPasswordInput,
  SignupInput,
  UpdateUserInput,
} from "../graphql/user";
import type { User } from "./schema/user";

export interface UserOpertations {
  createUser: (details: SignupInput) => Promise<User>;
  findByEmail: (email: string) => Promise<User | null>;
  resetPassword: (credentials: ResetPasswordInput) => Promise<User>;
  updateUser: (
    id: string,
    updates: UpdateUserInput & { refresh_token?: string }
  ) => Promise<User>;
  findById: (id: string) => Promise<User | null>;
}
