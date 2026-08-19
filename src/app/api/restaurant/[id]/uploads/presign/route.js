import dbConnect from "@/lib/db";
import ImageAsset from "@/models/Image";
import Restaurant from "@/models/Restaurant";
import { getUser } from "@/lib/api/hooks/getUser";
import { JsonResponse } from "@/lib/api/responseHandler";
import { getPresignedUploadUrl } from "@/services/backend/s3";
import { ALLOWED_TYPES, ALLOWED_FOLDERS } from "@/services/backend/s3/helpers/constants";

export async function POST(request, { params }) {
  try {
    const { id: restaurantId } = await params;

    if (!restaurantId) {
      return JsonResponse.error("Restaurant ID is required", 400);
    }

    const user = await getUser();

    if (!user?.id) {
      return JsonResponse.error("Please login first to continue!", 401);
    }

    await dbConnect();

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      createdBy: user.id,
    });

    if (!restaurant) {
      return JsonResponse.error("Restaurant not found or unauthorized", 404);
    }

    const body = await request.json();

    const { filename, contentType, path = "general", sizeBytes = 0, width = 800, height = 600 } = body;

    if (!filename || !contentType) {
      return JsonResponse.error("filename and contentType are required", 400);
    }

    const extension = ALLOWED_TYPES[contentType];

    if (!extension) {
      return JsonResponse.error("Unsupported image type", 400, {
        allowedTypes: Object.keys(ALLOWED_TYPES)
      });
    }

    const targetFolder = String(path).trim();

    if (!ALLOWED_FOLDERS.includes(targetFolder)) {
      return JsonResponse.error("Invalid upload folder", 400, {
        allowedFolders: ALLOWED_FOLDERS
      });
    }

    const { uploadUrl, key, imageId, cleanFilename } = await getPresignedUploadUrl({
      restaurantId,
      targetFolder,
      filename,
      contentType,
    });

    const imageAsset = await ImageAsset.create({
      restaurant: restaurantId,
      original: {
        key,
        filename: cleanFilename,
        mimeType: contentType,
        width,
        height,
        sizeBytes,
      },
      status: "PENDING",
    });



    return JsonResponse.success({
      imageId: imageAsset._id,
      key,
      uploadUrl,
      contentType,
    }, "Presigned URL generated successfully", 200);
  } catch (error) {
    console.error("Presign error:", error);

    return JsonResponse.error(
      error instanceof Error ? error.message : "Failed to generate upload URL",
      500
    );
  }
}