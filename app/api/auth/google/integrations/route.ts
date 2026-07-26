import dbConnect from "@/lib/db";
import { withApiHandler } from "@/lib/api/handler";
import { NextRequest, NextResponse } from "next/server";
import GoogleIntegration from "@/models/GoogleIntegration";

export const GET = withApiHandler(async (req: NextRequest, ctx, userId?: string) => {
    await dbConnect();
    const integrations = await GoogleIntegration.find({ userId })
        .select("googleId email name avatar createdAt")
        .sort({ createdAt: -1 });

    return NextResponse.json({ integrations });
});
