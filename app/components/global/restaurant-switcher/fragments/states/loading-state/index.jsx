import { Skeleton } from "@/components/ui/skeleton";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

const LoadingState = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-36 rounded-full" />
            <Skeleton className="h-3 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default LoadingState