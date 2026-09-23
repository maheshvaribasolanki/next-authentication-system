import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;

  isEmailVerified: boolean;

  otp?: string;
  otpExpiresAt?: Date;

  resetToken?: string;
  resetTokenExpiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
     
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },

    otpExpiresAt: {
      type: Date,
    },

    resetToken: {
      type: String,
    },

    resetTokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

export default User;