import axios from "axios";
import { NextResponse } from "next/server";
import { getCache, setCache } from "@/services/backend/redis/cache.service";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "20";

        if (!query) {
            return NextResponse.json({ success: false, error: "Search query is required" }, { status: 400 });
        }

        const cacheKey = `image-search:${query.toLowerCase()}:${page}:${limit}`;
        const cachedData = await getCache(cacheKey);

        if (cachedData) {
            return NextResponse.json(cachedData);
        }

        const foodsnapApiUrl = process.env.NEXT_PUBLIC_FOODSNAP_API_URL;

        const response = await axios.get(foodsnapApiUrl, {
            params: {
                q: query,
                page,
                limit
            },
            headers: {
                "Accept": "application/json"
            }
        });

        await setCache(cacheKey, response.data, 86400);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Failed to proxy image search:", error?.message);
        return NextResponse.json(
            { success: false, error: "Failed to fetch images from external service" },
            { status: 500 }
        );
    }
}
