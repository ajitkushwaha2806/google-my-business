import { Schema, model, models, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
      
    phone: {
      type: String,
      required: true,
    },

    passwordHash: {
      type: String,
      default: null,
      select: false,
    },

    image: {
      type: Types.ObjectId,
      ref: "ImageAsset",
      default: null,
    },

    restaurant: {
      type: Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "BLOCKED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model("User", userSchema);