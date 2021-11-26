import mongoose, { Document, Schema } from "mongoose";

type Account = {
  username: string;
  email: string;
  refreshToken: string;
  badges: string[];
};

const AccountSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    refreshToken: { type: String, required: true },
    badges: [{ type: Schema.Types.String, ref: "Bagde" }],
  },
  { timestamps: true }
);

export default mongoose.model<Account>("AccountData", AccountSchema);
