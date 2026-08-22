import mongoose, { Schema, Types } from "mongoose";

const AddonGroupSchema = new Schema(
    {
        restaurant: {
            type: Types.ObjectId,
            ref: "Restaurant",
            required: [true, "Restaurant reference is required"],
            index: true,
        },
        name: {
            type: String,
            required: [true, "Addon group name is required (e.g., Toppings, Sauces)"],
            trim: true,
        },
        selectionType: {
            type: String,
            enum: ['single', 'multiple'],
            default: 'multiple',
            required: true
        },
        minSelection: {
            type: Number,
            default: 0,
            min: 0
        },
        maxSelection: {
            type: Number,
            default: null,
        },
        items: [{
            item: { type: Types.ObjectId, ref: 'MenuItem', required: true },
            priceOverride: { type: Number, default: null } 
        }]
    },
    {
        timestamps: true,
    }
);

AddonGroupSchema.index({ restaurant: 1 });

export default mongoose.models.AddonGroup || mongoose.model("AddonGroup", AddonGroupSchema);
