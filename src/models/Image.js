import mongoose from "mongoose";

const ImageVariantSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },

    width: {
      type: Number,
      required: true,
    },

    height: {
      type: Number,
      required: true,
    },

    format: {
      type: String,
      enum: ["avif", "webp", "jpg", "png"],
      required: true,
    },

    sizeBytes: {
      type: Number,
    },
  },
  { _id: false }
);

const ImageAssetSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    original: {
      key: {
        type: String,
        required: true,
      },

      width: {
        type: Number,
      },

      height: {
        type: Number,
      },

      mimeType: {
        type: String,
      },

      sizeBytes: {
        type: Number,
      },
    },

    variants: {
      thumbnail: {
        type: [ImageVariantSchema],
        default: [],
      },

      card: {
        type: [ImageVariantSchema],
        default: [],
      },

      detail: {
        type: [ImageVariantSchema],
        default: [],
      },
    },

    blurHash: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "READY",
        "FAILED",
        "DELETED",
      ],
      default: "PENDING",
      index: true,
    },

    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

ImageAssetSchema.index({
  restaurant: 1,
  status: 1,
});

ImageAssetSchema.index({
  restaurant: 1,
  createdAt: -1,
});

const ImageAsset =
  mongoose.models.ImageAsset ||
  mongoose.model("ImageAsset", ImageAssetSchema);

export default ImageAsset;