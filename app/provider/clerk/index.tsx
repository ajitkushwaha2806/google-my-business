"use client";
import { ClerkProps } from "../type";
import { ClerkProvider } from "@clerk/nextjs";

export function AppClerkProvider({ children }: ClerkProps) {
    return <ClerkProvider>{children}</ClerkProvider>;
}