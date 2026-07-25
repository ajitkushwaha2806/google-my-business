import type { Metadata } from "next";
import { APP_NAME, APP_URL } from ".";
import { SITE_IMAGES } from "./images";

const description = `${APP_NAME} is an AI-powered platform for managing Google Business Profiles, automating review replies, scheduling social media posts, conducting local market research, and growing your business across Google, Instagram, and Facebook.`;

export const appMetadata: Metadata = {
    metadataBase: new URL(APP_URL),

    title: {
        default: APP_NAME,
        template: `%s | ${APP_NAME}`,
    },

    description,

    keywords: [
        "Google Business Profile",
        "Google Reviews",
        "Review Management",
        "AI Review Replies",
        "Local SEO",
        "Google Maps",
        "Instagram Business",
        "Facebook Business",
        "Social Media Automation",
        "Business Automation",
        "Local Marketing",
        "Market Research",
        "AI Marketing",
    ],

    applicationName: APP_NAME,

    authors: [
        {
            name: APP_NAME,
        },
    ],

    creator: APP_NAME,
    publisher: APP_NAME,

    openGraph: {
        type: "website",
        locale: "en_US",
        url: APP_URL,
        siteName: APP_NAME,
        title: APP_NAME,
        description,
        images: [
            {
                url: SITE_IMAGES.og,
                width: 1200,
                height: 630,
                alt: APP_NAME,
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: APP_NAME,
        description,
        images: [SITE_IMAGES.og],
    },

    robots: {
        index: true,
        follow: true,
    },

    icons: {
        icon: SITE_IMAGES.favicon,
        shortcut: SITE_IMAGES.shortcut,
        apple: SITE_IMAGES.appleTouchIcon,
    },
};