"use client"
import * as React from "react"
import { NavUser } from "./nav-user"
import { NavMain } from "./nav-main"
import { TeamSwitcher } from "./nav-switcher"
import { useUser } from "@/store/hooks/useUser"
import { APP_SIDEBAR_CONFIG } from "@/constants/sidebar"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarSeparator } from "@/components/ui/sidebar"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { user: userData, isLoaded } = useUser();

    const sidebarConfig = {
        user: {
            avatar: userData?.avatar || "",
            name: userData?.name || "",
            email: userData?.email || ""
        },
    }

    return (
        <Sidebar collapsible="icon" {...props} className="bg-sidebar">
            <SidebarHeader>
                <TeamSwitcher
                    title={APP_SIDEBAR_CONFIG?.switcherTitle}
                    addLabel={APP_SIDEBAR_CONFIG?.switcherAddLabel}
                    businesses={APP_SIDEBAR_CONFIG?.businesses}
                />
            </SidebarHeader>
            <SidebarContent>
                <NavMain title={APP_SIDEBAR_CONFIG?.navMain?.title} items={APP_SIDEBAR_CONFIG?.navMain?.items} />
            </SidebarContent>
            <SidebarSeparator className="mx-2 bg-gray-200 dark:bg-gray-800" />
            {isLoaded && (
                <SidebarFooter>
                    <NavUser user={sidebarConfig?.user} menuItems={APP_SIDEBAR_CONFIG?.navUserItems} />
                </SidebarFooter>
            )}
            <SidebarRail />
        </Sidebar>
    )
}
