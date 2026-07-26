import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Providers } from "@/provider";
import { fontPoppins } from "./constants/fonts";
import { appMetadata } from "@/constants/metadata";
import { SidebarLayout } from "./components/sidebar/sidebar-layout";

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
          <SidebarLayout>
            {children}
          </SidebarLayout>
        </Providers>
      </body>
    </html>
  );
}