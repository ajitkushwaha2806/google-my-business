import crypto from "crypto";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3Client, S3_BUCKET } from "@/lib/aws/s3";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { filename, contentType } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        {
          error: "filename and contentType are required",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        {
          error: "Unsupported image type",
        },
        { status: 400 }
      );
    }

    const imageId = crypto.randomUUID();
    const extension = EXTENSIONS[contentType];

    const key = `restaurant/${restaurantId}/originals/${imageId}/source.${extension}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60,
    });

    return NextResponse.json({
      imageId,
      key,
      uploadUrl,
    });
  } catch (error) {
    console.error("Presign error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate upload URL",
      },
      { status: 500 }
    );
  }
}