import { Schema, model } from "mongoose";
import { User } from "../../types/model/schema/user";
import bcrypt from "bcrypt";

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
});

userSchema.methods.validatePassword = async function (password: string) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 8);
});

export default model<User>("user", userSchema);
