import type { Document } from "mongoose";

export interface User extends Document {
  email: string;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  // JWT refresh token
  refresh_token: string;
  /**
   * @param password: Plain text password
   *
   * Takes a plain text password and verifies it against the
   * hash stored in the database
   */
  validatePassword: (password: String) => boolean;
}
