import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { AppException, RedirectException } from "./exceptions";

type HandlerOptions = {
    requireAuth?: boolean;
};

type ApiHandler = (
    req: NextRequest, 
    ctx: any, 
    userId?: string
) => Promise<NextResponse | void> | NextResponse | void;

export function withApiHandler(handler: ApiHandler, options: HandlerOptions = { requireAuth: true }) {
    return async (req: NextRequest, ctx: any) => {
        try {
            let userId: string | undefined = undefined;

            if (options.requireAuth) {
                const session = await auth();
                userId = session.userId || undefined;

                if (!userId) {
                    throw new AppException("Unauthorized", 401);
                }
            }

            const response = await handler(req, ctx, userId);
            return response || NextResponse.json({ success: true });
        } catch (error: any) {
            console.error("API Error caught in withApiHandler:", error);

            if (error instanceof RedirectException) {
                return NextResponse.redirect(new URL(error.url, req.url));
            }

            if (error instanceof AppException) {
                return NextResponse.json(
                    {
                        success: false,
                        message: error.message,
                        errors: error.errors,
                    },
                    { status: error.statusCode }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    message: "Internal Server Error",
                },
                { status: 500 }
            );
        }
    };
}
