import { LayoutDashboard, Settings, Users, User } from "lucide-react";

export const APP_SIDEBAR_CONFIG = {
  navUserItems: [
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
        title: "Staff Management",
        url: "/restaurant/staff",
        icon: <Users />,
      },
      {
        title: "Settings",
        url: "/restaurant/profile",
        icon: <Settings />,
      },
    ],
  },
};
