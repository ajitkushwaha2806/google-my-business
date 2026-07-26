import React from "react";
import { GoogleIntegrationSettings } from "@/components/integrations/google-connect";

export default function IntegrationsPage() {
    return (
        <div className="flex-1 w-full p-8 max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Integrations
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Manage your connected platforms and third-party services.
                </p>
            </div>

            <div className="grid gap-6">
                <GoogleIntegrationSettings />
            </div>
        </div>
    );
}
