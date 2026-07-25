import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Providers } from "@/provider";
import { fontPoppins } from "./constants/fonts";
import { AppSidebar } from "./components/sidebar";
import { appMetadata } from "@/constants/metadata";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = appMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased font-sans",
        fontPoppins.variable
      )}
    >
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <AppSidebar />
              <SidebarInset className="flex-1 overflow-hidden">
                {children}
              </SidebarInset>
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}