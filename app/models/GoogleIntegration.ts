import mongoose, { Schema, Document } from "mongoose";

export interface IGoogleIntegration extends Document {
    userId: string;
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
    createdAt: Date;
    updatedAt: Date;
}

const GoogleIntegrationSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        googleId: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        name: { type: String, required: true },
        avatar: { type: String },
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
        expiryDate: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.GoogleIntegration ||
    mongoose.model<IGoogleIntegration>("GoogleIntegration", GoogleIntegrationSchema);
