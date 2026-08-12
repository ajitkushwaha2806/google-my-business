import { getUser } from "@/lib/api/hooks/getUser";
import { uploadToS3 } from "@/services/backend/s3";
import { JsonResponse } from "@/lib/api/responseHandler";

export const POST = async (req) => {
    try {
        const user = await getUser();
        
        if (!user) {
            return JsonResponse.error("Please login first to continue!", 401);
        }

        const formData = await req.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'general';

        if (!file) {
            return JsonResponse.error("No file provided", 400);
        }

        const result = await uploadToS3({
            file,
            folder: `uploads/${user.id}/${folder}`,
            allowedExtensions: ['.png', '.jpg', '.jpeg', '.svg', '.webp']
        });

        return JsonResponse.success(
            { url: result.url },
            "File uploaded successfully",
            200
        );
    } catch (error) {
        console.error("Upload error:", error);
        return JsonResponse.error(error.message || "Failed to upload file", 500);
    }
};
