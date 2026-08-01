"use client";
import { AppSidebar } from "./index";
import { usePathname } from "next/navigation";
import { Breadcrumbs } from "../global/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function SidebarLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up") || pathname?.startsWith("/restaurant/onboarding");

  if (isAuthPage) {
    return (
      <main className="flex min-h-screen w-full flex-col">{children}</main>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50/30 dark:bg-zinc-950">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/40 px-6 bg-white dark:bg-zinc-900 transition-[width,height] ease-linear">
            <div className="flex items-center gap-2 w-full">
              <SidebarTrigger className="-ml-2" />
              <div className="h-4 w-px bg-border/60 mx-2" />
              <Breadcrumbs />
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
