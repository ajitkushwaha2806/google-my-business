import { JsonResponse } from "@/lib/api/responseHandler";

export const POST = async (request) => {
  try {
    const { name } = await request.json();
    return JsonResponse.success({ name }, "Category created successfully", 201);
  } catch (err) {
    return JsonResponse.error(err.message || "Failed to create category", 500);
  }
};
