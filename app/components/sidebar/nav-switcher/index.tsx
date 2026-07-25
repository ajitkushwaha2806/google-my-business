"use client"
import * as React from "react"
import { NavSwitcherProps } from "./types"
import { ChevronsUpDownIcon, PlusIcon, CheckIcon } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function TeamSwitcher({ title, addLabel, businesses }: NavSwitcherProps) {
  const { isMobile } = useSidebar()
  const [activeBusiness, setActiveBusiness] = React.useState(businesses[0])
  if (!activeBusiness) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              {activeBusiness.logo}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeBusiness.name}</span>
              <span className="truncate text-xs">{activeBusiness.address}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-md border-border/40 p-2 shadow-xl shadow-black/5 dark:shadow-white/5"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              {title && (
                <DropdownMenuLabel className="px-2 text-xs font-semibold text-gray-400">
                  {title}
                </DropdownMenuLabel>
              )}
              {businesses.map((business, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => setActiveBusiness(business)}
                  className="group flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex size-10 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                    <div className="size-5 [&>svg]:size-5">
                      {business.logo}
                    </div>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-gray-900 dark:text-gray-100">{business.name}</span>
                    <span className="truncate text-[13px] text-gray-500">{business.address}</span>
                  </div>
                  {activeBusiness.name === business.name && (
                    <CheckIcon className="size-4 ml-auto text-gray-900 dark:text-gray-100" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="group flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="flex size-10 items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700 bg-transparent text-gray-500">
                  <PlusIcon className="size-5" />
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {addLabel || "Add"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
