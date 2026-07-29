import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/provider";
import { fontPoppins } from "./constants/fonts";
import { appMetadata } from "@/constants/metadata";
import { SidebarLayout } from "./components/sidebar/layout";

export const metadata = appMetadata;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full antialiased font-sans", fontPoppins.variable)}
    >
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          <SidebarLayout>{children}</SidebarLayout>
        </Providers>
      </body>
    </html>
  );
}
