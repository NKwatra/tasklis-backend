export interface SignupInput {
  email: string;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
}

export interface ResetPasswordInput {
  email: string;
  password: string;
}

export interface UserPayload {
  email: string;
  id: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
}
