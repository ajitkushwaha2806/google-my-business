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
        title: "Website Settings",
        icon: <Store />,
        items: [
          {
            title: "Homepage",
            url: "/restaurant/website/homepage",
            icon: <LayoutDashboard />,
          },
          {
            title: "Menu Page",
            url: "/restaurant/website/menu-page",
            icon: <LayoutDashboard />,
          },
          {
            title: "About Us Page",
            url: "/restaurant/website/about-us-page",
            icon: <LayoutDashboard />,
          },
          {
            title: "Contact Page",
            url: "/restaurant/website/contact-page",
            icon: <LayoutDashboard />,
          },
          {
            title: "Footer",
            url: "/restaurant/website/footer",
            icon: <LayoutDashboard />,
          },
        ]
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
