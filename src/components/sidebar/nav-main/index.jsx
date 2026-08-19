// Import Link at the top of the file
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({ title, items }) {
  return (
    <SidebarGroup>
      {title && (
        <SidebarGroupLabel className="mb-2 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
          {title}
        </SidebarGroupLabel>
      )}
      <SidebarMenu className="gap-1">
        {items?.map((item) =>
          item?.items && item?.items.length > 0 ? (
            <Collapsible
              key={item?.title}
              defaultOpen={item?.isActive}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton
                    tooltip={item?.title}
                    className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${item?.isActive ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-blue-600" : "text-gray-600 dark:text-gray-400"}`}
                  />
                }
              >
                <div className="flex size-5 items-center justify-center opacity-80 group-hover:opacity-100">
                  {item?.icon}
                </div>
                <span className="flex-1 text-left">{item?.title}</span>
                <ChevronRightIcon className="size-4 opacity-50 transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="mt-1 border-l-2 border-gray-100 dark:border-gray-800 pl-4 ml-4">
                  {item?.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem?.title}>
                      <SidebarMenuSubButton
                        render={<Link href={subItem?.url} />}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors"
                      >
                        {subItem?.icon && (
                          <div className="flex size-4 items-center justify-center opacity-80">
                            {subItem.icon}
                          </div>
                        )}
                        <span>{subItem?.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item?.title}>
              <SidebarMenuButton
                render={<Link href={item?.url} />}
                tooltip={item?.title}
                className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${item?.isActive ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-blue-600" : "text-gray-600 dark:text-gray-400"}`}
              >
                <div className="flex size-5 items-center justify-center opacity-80 group-hover:opacity-100">
                  {item?.icon}
                </div>
                <span className="flex-1 text-left">{item?.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
