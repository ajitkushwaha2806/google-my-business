import { LayoutDashboard, Sparkles, MessageSquare, Star, FileText, Image, Video, Trophy, Gamepad2, Send, QrCode, Code2, CreditCard, Crosshair, ChartColumn, Search, Globe, GalleryVerticalEndIcon, AudioLinesIcon, UserIcon, HelpCircleIcon } from "lucide-react";

export const APP_SIDEBAR_CONFIG = {
    navUserItems: [
        {
            title: "Account Settings",
            icon: <UserIcon />,
            url: "#"
        },
        {
            title: "Help Center",
            icon: <HelpCircleIcon />,
            url: "#",
        },
    ],
    switcherTitle: "Businesses",
    switcherAddLabel: "Add business",
    businesses: [
        {
            name: "Acme Inc",
            logo: <GalleryVerticalEndIcon />,
            address: "New York, NY",
        },
        {
            name: "Acme Corp.",
            logo: <AudioLinesIcon />,
            address: "San Francisco, CA",
        },
        {
            name: "Evil Corp.",
            logo: <GalleryVerticalEndIcon />,
            address: "Free",
        },
    ],
    navMain: {
        title: "Your Google listings",
        items: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: <LayoutDashboard />,
            },
            {
                title: "Optimization",
                url: "/optimization",
                icon: <Sparkles />,
            },
            {
                title: "Content & Reviews",
                url: "#",
                icon: <MessageSquare />,
                items: [
                    {
                        title: "Google Reviews",
                        url: "/content-reviews/google-reviews",
                        icon: <Star />,
                    },
                    {
                        title: "Posts",
                        url: "/content-reviews/posts",
                        icon: <FileText />,
                    },
                    {
                        title: "Photos",
                        url: "/content-reviews/photos",
                        icon: <Image />,
                    },
                    {
                        title: "Videos",
                        url: "/content-reviews/videos",
                        icon: <Video />,
                    },
                ],
            },
            {
                title: "Review Booster",
                url: "#",
                icon: <Trophy />,
                items: [
                    {
                        title: "Review Game",
                        url: "/review-booster/review-game",
                        icon: <Gamepad2 />,
                    },
                    {
                        title: "Review Campaigns",
                        url: "/review-booster/review-campaigns",
                        icon: <Send />,
                    },
                    {
                        title: "QR Poster",
                        url: "/review-booster/qr-poster",
                        icon: <QrCode />,
                    },
                    {
                        title: "Review Widget",
                        url: "/review-booster/review-widget",
                        icon: <Code2 />,
                    },
                    {
                        title: "NFC Card",
                        url: "/review-booster/nfc-card",
                        icon: <CreditCard />,
                    },
                ],
            },
            {
                title: "Local Visibility",
                url: "#",
                icon: <Crosshair />,
                items: [
                    {
                        title: "Local Rankings",
                        url: "/local-visibility/local-rankings",
                        icon: <ChartColumn />,
                    },
                    {
                        title: "Local Citations",
                        url: "/local-visibility/local-citations",
                        icon: <Search />,
                    },
                    {
                        title: "AI Visibility (GEO)",
                        url: "/local-visibility/ai-visibility",
                        icon: <Sparkles />,
                    },
                    {
                        title: "Websites",
                        url: "/local-visibility/websites",
                        icon: <Globe />,
                    },
                ],
            },
        ]
    },
};
