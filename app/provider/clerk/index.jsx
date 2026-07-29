"use client";
import { ClerkProvider } from "@clerk/nextjs";

export function AppClerkProvider({ children }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
