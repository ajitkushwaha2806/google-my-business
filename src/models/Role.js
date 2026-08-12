import { Schema, model, models, Types } from "mongoose";

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
    
    isSystemRole: { type: Boolean, default: false },

    permissions: [
      {
        type: Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Role = models.Role || model("Role", roleSchema);