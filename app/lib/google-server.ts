import dbConnect from "./db";
import { google } from "googleapis";
import { googleOAuth } from "./google";
import GoogleIntegration from "@/models/GoogleIntegration"

export async function getGoogleClient(userId: string, googleId?: string) {
    await dbConnect();

    const query = googleId ? { userId, googleId } : { userId };
    const integration = await GoogleIntegration.findOne(query);

    if (!integration) {
        throw new Error("Google integration not found for user.");
    }

    const isExpired = integration.expiryDate < Date.now() + 5 * 60 * 1000;
    let accessToken = integration.accessToken;

    if (isExpired && integration.refreshToken) {
        try {
            googleOAuth.setCredentials({
                refresh_token: integration.refreshToken,
            });

            const { credentials } = await googleOAuth.refreshAccessToken();

            accessToken = credentials.access_token!;
            integration.accessToken = accessToken;
            if (credentials.refresh_token) {
                integration.refreshToken = credentials.refresh_token;
            }
            if (credentials.expiry_date) {
                integration.expiryDate = credentials.expiry_date;
            }
            await integration.save();
        } catch (error) {
            console.error("Failed to refresh Google token:", error);
            throw new Error("Google API authentication expired. Please reconnect.");
        }
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: integration.refreshToken,
    });

    return google.mybusinessbusinessinformation({
        version: "v1",
        auth: oauth2Client,
    });
}
