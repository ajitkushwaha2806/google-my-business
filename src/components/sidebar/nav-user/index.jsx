"use client"
import { useClerk } from "@clerk/nextjs"
import { ChevronRightIcon, BadgeCheckIcon, LogOutIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function NavUser({ user, menuItems }) {
    const { isMobile } = useSidebar()
    const { signOut } = useClerk()

    return (
        <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                size="lg"
                                className="bg-transparent data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900 group flex w-full items-center gap-4 overflow-hidden rounded-md p-2 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                            />
                        }
                    >
                        <Avatar className="h-9 w-9 rounded-md transition-transform duration-300 group-hover:scale-105">
                            <AvatarImage src={user?.avatar} alt={user?.name} className="object-cover rounded-md" />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-md">
                                {user?.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 min-w-0 text-left text-sm leading-tight">
                            <div className="flex items-center gap-1.5">
                                <span className="truncate font-semibold tracking-tight text-gray-900 dark:text-gray-100">{user?.name}</span>
                                <BadgeCheckIcon className="size-4 text-blue-500 fill-blue-50" />
                            </div>
                            <span className="truncate text-[13px] text-gray-500">{user?.email}</span>
                        </div>
                        <ChevronRightIcon className="ml-auto size-4 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-[260px] rounded-md border-border/40 bg-white dark:bg-zinc-950 p-3 shadow-xl shadow-black/5 dark:shadow-white/5"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={16}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-3 px-1 py-2 text-left text-sm">
                                    <Avatar className="h-9 w-9 rounded-md transition-transform duration-300 group-hover:scale-105">
                                        <AvatarImage src={user?.avatar} alt={user?.name} className="object-cover rounded-md" />
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-md">
                                            {user?.name?.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 min-w-0 text-left text-sm leading-tight">
                                        <div className="flex items-center gap-1.5">
                                            <span className="truncate font-semibold tracking-tight text-gray-900 dark:text-gray-100">{user?.name}</span>
                                            <BadgeCheckIcon className="size-4 text-blue-500 fill-blue-50" />
                                        </div>
                                        <span className="truncate text-[13px] text-gray-500">{user?.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-gray-800" />

                        {menuItems && menuItems?.length > 0 && (
                            <>
                                <DropdownMenuGroup className="space-y-0.5">
                                    {menuItems?.map((item, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                        >
                                            <a
                                                href={item?.url || "#"}
                                                className="group w-full flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 focus:bg-gray-100/80 focus:text-gray-900"
                                            >
                                                <div className="size-4 text-gray-400 group-hover:text-gray-700 [&>svg]:size-4">
                                                    {item?.icon}
                                                </div>
                                                <span className="font-medium">{item?.title}</span>
                                            </a>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-gray-800" />
                            </>
                        )}

                        <DropdownMenuItem onClick={() => signOut({ redirectUrl: '/' })}>
                            <div className="group w-full flex bg-red-50 cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 focus:bg-gray-100/80 focus:text-gray-900">
                                <LogOutIcon className="size-4 text-red-400 group-hover:text-red-700 transition-transform duration-200 group-hover:-translate-x-0.5" />
                                <span className="font-medium text-red-700">Logout</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
