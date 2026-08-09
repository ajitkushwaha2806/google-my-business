import { LayoutDashboard, Settings, Store, User } from "lucide-react";

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
        url: "/restaurant/menu",
        icon: <LayoutDashboard />,
      },
       {
        title: "User Management",
        url: "/restaurant/users",
        icon: <User />,
      },
      {
        title: "Settings",
        url: "/restaurant/profile",
        icon: <Settings />,
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
