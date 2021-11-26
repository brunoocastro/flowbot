import mongoose, { Document, Schema } from "mongoose";

interface Badge {
  name: string;
  expired: boolean;
  expirationDate: Date;
}

const BadgeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Badge>("Badge", BadgeSchema);
