import { Store } from "lucide-react"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

const EmptyState = () => {
    return (
        <div>
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="rounded-xl border border-dashed p-5 text-center bg-muted/20">
                        <Store className="mx-auto mb-2.5 size-6 text-muted-foreground/70" />
                        <p className="text-sm font-medium">No Restaurants Found</p>
                        <p className="text-muted-foreground mt-1 text-xs max-w-[200px] mx-auto leading-normal">
                            We couldn't find any restaurants associated with this account.
                        </p>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        </div>
    )
}

export default EmptyState