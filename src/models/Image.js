const mongoose = require("mongoose");

const ImageVariantSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    url: String,
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    sizeBytes: Number,
    mimeType: String,
  },
  { _id: false }
);

const ImageAssetSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    original: {
      key: {
        type: String,
        required: true,
      },
      url: String,
      filename: String,
      mimeType: String,
      sizeBytes: Number,
    },

    variants: {
      type: Map,
      of: ImageVariantSchema,
      default: {},
    },

    dimensions: {
      width: {
        type: Number,
        required: true,
        min: 1,
      },
      height: {
        type: Number,
        required: true,
        min: 1,
      },
      aspectRatio: Number,
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

    blurHash: {
      type: String,
      default: null,
    },

    metadata: {
      alt: String,
      title: String,
      description: String,

      format: String,
      colorSpace: String,
      hasAlpha: Boolean,

      exif: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ImageAsset", ImageAssetSchema);