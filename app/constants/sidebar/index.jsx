import { LayoutDashboard, Store } from "lucide-react";

export const APP_SIDEBAR_CONFIG = {
  navUserItems: [
    // {
    //   title: 'Account Settings',
    //   icon: <UserIcon />,
    //   url: '#',
    // },
    // {
    //   title: 'Help Center',
    //   icon: <HelpCircleIcon />,
    //   url: '#',
    // },
  ],
  navMain: {
    title: "MANAGE",
    items: [
      {
        title: "Menu",
        url: "/menu-management",
        icon: <LayoutDashboard />,
      },
      {
        title: "Profile",
        url: "/restaurant/profile",
        icon: <Store />,
      },
      //   {
      //     title: 'Content & Reviews',
      //     url: '#',
      //     icon: <MessageSquare />,
      //     items: [
      //       {
      //         title: 'Google Reviews',
      //         url: '/content-reviews/google-reviews',
      //         icon: <Star />,
      //       },
      //     ],
      //   },
    ],
  },
};
