"use client"
import * as React from "react"
import { NavSwitcherProps } from "./types"
import { ChevronsUpDownIcon, PlusIcon, CheckIcon, Loader2 } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGoogleIntegrations } from "@/hooks/useGoogleIntegrations"
import { API_ROUTES } from "@/constants/api"

export function TeamSwitcher({ title, addLabel }: NavSwitcherProps) {
  const { isMobile } = useSidebar()
  const { data, isLoading } = useGoogleIntegrations()
  const googleAccounts = data?.integrations || []
  
  const fallbackBusiness = {
    name: "No Google Account",
    address: "Tap to connect",
    logo: <div className="font-semibold text-gray-400 dark:text-gray-500">G</div>
  };

  const [activeBusiness, setActiveBusiness] = React.useState(fallbackBusiness)

  React.useEffect(() => {
    if (googleAccounts.length > 0) {
      setActiveBusiness({
          name: googleAccounts[0].name,
          address: googleAccounts[0].email,
          logo: <Avatar className="size-6"><AvatarImage src={googleAccounts[0].avatar} /><AvatarFallback>G</AvatarFallback></Avatar>
      })
    } else if (!isLoading) {
      setActiveBusiness(fallbackBusiness);
    }
  }, [data?.integrations, isLoading])

  const displayList = googleAccounts.map((acc: any) => ({
      name: acc.name,
      address: acc.email,
      logo: <Avatar className="size-6"><AvatarImage src={acc.avatar} /><AvatarFallback>G</AvatarFallback></Avatar>
  }));

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
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
              {activeBusiness.logo}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight ml-1">
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
              {isLoading ? (
                  <div className="flex justify-center p-4">
                      <Loader2 className="size-4 animate-spin text-gray-400" />
                  </div>
              ) : (
                  displayList.map((business, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => setActiveBusiness(business)}
                      className="group flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="flex size-10 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                        <div className="size-5 [&>svg]:size-5 flex items-center justify-center">
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
                  ))
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => window.location.href = `/api${API_ROUTES.GOOGLE.LOGIN}`} className="group flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="flex size-8 items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700 bg-transparent text-gray-500">
                    <PlusIcon className="size-4" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {addLabel || "Connect Google Account"}
                  </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
